const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
    getUserById,
    getCartId,
    getCartContent,
    getCrrCartPrice,
    priceForShow
} = require('../../models/user/cart');

const {
    createOrder,
    getAllUserOrder,
    getOneUserOrder,
    getUserOrderContent
} = require('../../models/user/order');

var username = "user01";
var role = "0";
var idUser = '1';

const getToken = (req, res) => {
        const access_token = req.cookies.jwt;

        if (access_token) {
            const token = access_token.split(' ')[1];

            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {

                username = data.username;
                idUser = data.id;
                // console.log(data);
                return username;
            });
        } else {
            res.redirect('/dangnhap');
        }

    }
    // Tạo hóa đơn
router.post("/:type", async(req, res) => {
    // Tạm cần user id

    getToken(req, res);
    console.log(idUser);
    let u_id = idUser;

    //let u_id = req.params.user_id;
    let user = await getUserById(u_id);
    let c_id = await getCartId(u_id);
    let p_type = req.params.type;
    let o_phone = req.body.o_phone;
    let o_address = req.body.o_address;

    //Nếu thiếu thông tin thanh toán/đặt hàng
    if (!o_phone || !o_address) {
        let createRes;
        let errorFields = [];
        if (!o_phone) {
            errorFields.push({ shoes_name: "Sđt" });
        }
        if (!o_address) {
            errorFields.push({ shoes_name: "Địa chỉ" });
        }
        if (p_type == 0) {
            createRes = {
                state: -1, // Đặt hàng thất bại
                msg: "  Vui lòng điền đầy đủ các thông tin sau:",
                eProduct: errorFields,
            }
        } else {
            createRes = {
                state: -2, // Thanh toán thất bại
                msg: "  Vui lòng điền đầy đủ các thông tin sau:",
                eProduct: errorFields,
            }
        }

        let c_content = await getCartContent(c_id);
        let c_price = await getCrrCartPrice(c_id);

        //Hiển thị giá
        for (let content of c_content) {
            content.price = priceForShow(content.price);
        }
        c_price = priceForShow(c_price);

        res.render('cart/cart', {
            title: "Hóa Đơn",
            cssP: () => 'Cart/cssCart',
            scriptsP: () => 'Cart/scriptCart',
            Cart_id: c_id,
            User: user,
            Contents: c_content,
            sumPrice: c_price,
            result: createRes,
        });
        return;
    }

    // Tạo háo đơn
    let createRes = await createOrder(c_id, o_phone, o_address, p_type);

    // Cập nhật lại giỏ hàng sau khi tọa hóa đơn
    let c_content = await getCartContent(c_id);
    let c_price = await getCrrCartPrice(c_id);

    //Hiển thị giá
    for (let content of c_content) {
        content.price = priceForShow(content.price);
    }
    c_price = priceForShow(c_price);

    if (createRes) {
        res.render('cart/cart', {
            title: "Thông tin hóa đơn",
            cssP: () => 'Cart/cssCart',
            scriptsP: () => 'Cart/scriptCart',
            Cart_id: c_id,
            User: user,
            Contents: c_content,
            sumPrice: c_price,
            result: createRes,
        });
        return;
    }

    res.redirect('back');

});

// Xem hóa đơn
router.get('/', async(req, res) => {
    // Tạm cần user id
    getToken(req, res);
    console.log(idUser);
    let u_id = idUser;

    let user = await getUserById(u_id);

    let ods = await getAllUserOrder(u_id);


    // Thay đổi thông tin để hiển thị
    for (let od of ods) {

        od.total = priceForShow(od.total);

        let today = od.order_time;
        var date = ((today.getDate() < 10) ? "0" : "") + today.getDate() + '-' +
            ((today.getMonth() < 10) ? "0" : "") + (today.getMonth() + 1) + '-' + today.getFullYear();
        var time = ((today.getHours() < 10) ? "0" : "") + today.getHours() + ":" +
            ((today.getMinutes() < 10) ? "0" : "") + today.getMinutes() + ":" + ((today.getSeconds() < 10) ? "0" : "") + today.getSeconds();
        var dateTime = date + ' ' + time;

        od.order_time = dateTime;

        if (od.status == 0) {
            od.status = "Chưa thanh toán"
        } else if (od.status == 1) {
            od.status = "Đã thanh toán"
        } else {
            od.status = "Đã hủy"
        }
    }

    res.render('order/order', {
        title: "Hóa đơn",
        cssP: () => 'Cart/cssCart',
        scriptsP: () => 'Cart/scriptCart',
        User: user,
        Orders: ods,
    })
});


// Xem thông tin hóa đơn
router.get('/:o_id/detail', async(req, res) => {


    let o_id = req.params.o_id;

    let od = await getOneUserOrder(o_id);
    let o_content = await getUserOrderContent(o_id);

    // Thay đổi thông tin để hiển thị
    for (let content of o_content) {
        content.price = priceForShow(content.price);
    }
    od.total = priceForShow(od.total);

    res.render('order/orderDetail', {
        title: "Thông tin hóa đơn",
        cssP: () => 'Cart/cssCart',
        scriptsP: () => 'Cart/scriptCart',
        Order: od,
        Contents: o_content,
    })
});

module.exports = router;