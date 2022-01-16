const db = require('../db');
const { getCartContent, getCrrCartPrice, removeOneFromCart } = require('./cart');

exports.getUserIdByCartId =  async(c_id) => {
    let user = await db.query(`select user_id from carts where cart_id = ${c_id}`);
    return user.rows[0].user_id;
};

exports.getOneUserOrder = async(o_id) => {
    let odrer = await db.query(`select * from orders where order_id = ${o_id}`);
    return odrer.rows[0];
};

exports.getAllUserOrder =async(u_id) => {
    let ods = await db.query(`select * from orders where user_id = ${u_id} order by order_time;`);
    return ods.rows;
}

exports.getUserOrderContent = async(o_id) => {
    let o_content = await db.query(`select * from order_content where order_id = ${o_id} order by shoes_id;`);
    return o_content.rows;
}

exports.createOrder = async(c_id, o_phone, o_address, type) => {
    let creataRes;
    let c_content = await getCartContent(c_id);
    // Nếu không có sản phẩm trong giỏ
    if (c_content.length == 0 && type == 0) {
        creataRes = {
            state: -1, // đặt hàng thất bại
            msg: "Chưa có sản phẩm trong giỏ"
        }
        return creataRes;
    }
    else if (c_content.length == 0 && type == 1) {
        creataRes = {
            state: -2, // thanh toán thất bại
            msg: "Chưa có sản phẩm trong giỏ"
        }
        return creataRes;
    }
    
    let errorProducts = [];
    let safeProducts = [];
    // Kiểm tra số lượng trong kho của từng sản phẩm trong giỏ
    for (let content of c_content) {
        let crrShoes = (await db.query(`select * from shoes where shoes_id = ${content.shoes_id};`)).rows[0];
        if (crrShoes.stock < content.cart_quantity) {
            errorProducts.push(crrShoes);
        }
        safeProducts.push(crrShoes);
    }

    // Nếu tồn tại ít nhất 1 sản phẩm hết hàng
    if (errorProducts.length != 0) {
        if (type == 0) {
            creataRes = {
                state: -1, // đặt hàng thất bại
                msg: "Các sản phẩm sau đã hết hàng:",
                eProduct: errorProducts,
            }
            return creataRes;
        }
        creataRes = {
            state: -2, // Thanh toán thất bại
            msg: "  Các sản phẩm sau đã hết hàng:",
            eProduct: errorProducts,
        }
        return creataRes;
    }

    // Tạo hóa đơn
    let u_id = await this.getUserIdByCartId(c_id);
    let orderPrice = await getCrrCartPrice(c_id);
    if (!o_address) {
        o_address = "Không";
    }
    let newOrder = await db.query(`insert into orders("user_id", "total", "order_time", "order_phone" , "address", "status")
    values (${u_id}, ${orderPrice}, Now(), '${o_phone}', '${o_address}', ${type}) returning *;`);
    newOrder = newOrder.rows[0];
    
    let orderId = newOrder.order_id;

    // Tạo order_content
    for (let i= 0; i < c_content.length; i++) {
        let crrShoes = safeProducts[i];
        let crrCC = c_content[i];

        // Tạo dòng mới từ crrShoes và crrCC
        await db.query(`insert into order_content("order_id", "shoes_id", "shoes_name", "image", "size", "price", "quantity")
        values (${orderId}, ${crrShoes.shoes_id}, '${crrShoes.shoes_name}', '${crrShoes.image}', ${crrShoes.size}, ${crrShoes.price},
        ${crrCC.cart_quantity})`);

        // Trừ số lượng trong kho
        crrInStock = parseInt(crrShoes.stock) - parseInt(crrCC.cart_quantity);
        await db.query(`update shoes set stock = ${crrInStock} where shoes_id = ${crrShoes.shoes_id};`);

        // Xóa cart content
        await removeOneFromCart(crrCC.cart_id, crrCC.shoes_id);
    }

    if (type == 0) {
        creataRes = {
            state: 1, // Đặt hàng thành công
            msg: "  Đặt hàng thành công. Đã tạo hóa đơn.",
        }
        return creataRes;
    }
    creataRes = {
        state: 2, // Thanh toán thành công
        msg: "  Thanh toán thành công. Đã tạo hóa đơn.",
    }

    return creataRes;
};