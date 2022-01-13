const express = require("express");
const router = express.Router();
const {getOrders,priceForShow} = require("../../models/owner/orders.M.js");

// Xem hóa đơn
router.get('/', async(req, res) => {

    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const start = (page - 1) * perPage;
    const end = page * perPage;

    allData = (await getOrders()).length;
    allPage = Math.ceil(allData / perPage);

    previousPage = page
    nextPage = page
    if (page > 1) {
        previousPage = page - 1
    }
    if (page < allPage) {
        nextPage = page + 1
    }

    let ods = await (await getOrders()).slice(start, end);


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

    res.render('Manager/order', {
        title: "Hóa đơn",
        cssP: () => 'Cart/cssCart',
        scriptsP: () => 'Cart/scriptCart',
        //User: user,
        Orders: ods,
        page: page,
        NextPage: nextPage,
        PreviousPage: previousPage,
    })
});


module.exports = router;