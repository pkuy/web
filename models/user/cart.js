const db = require('../db');

exports.getUserById =  async(u_id) => {
    let user = await db.query(`select * from users where user_id = ${u_id}`);
    return user.rows[0];
};

exports.getCartId = async(u_id) => {
    const c_id = await db.query(`select cart_id from carts where user_id = ${u_id}`);
    return c_id.rows[0].cart_id;
};

exports.getCartContent = async(c_id) => {
    const contents = (await db.query(`select *
    from cart_content cc inner join shoes s
    on cc.shoes_id = s.shoes_id
    where cart_id = ${c_id}`)).rows;

    for (let content of contents) {
        content.price = parseInt(content.price);
        content.price = String(content.price).replace(/(.)(?=(\d{3})+$)/g,'$1,');
    }

    return contents;
};

exports.getCrrCartPrice = async(c_id) => {
    let sumPrice = (await db.query(`select sum(cc.cart_quantity*s.price) as price
    from cart_content cc inner join shoes s
    on cc.shoes_id = s.shoes_id
    where cart_id = ${c_id};`)).rows[0].price;
    sumPrice = parseInt(sumPrice);
    sumPrice = String(sumPrice).replace(/(.)(?=(\d{3})+$)/g,'$1,');
    return sumPrice;
};

exports.addToCart = async(c_id, s_id, quantity) => {
    // Kiểm tra sản phẩm đã có trong giỏ hàng từ trước chưa
    let testRow = await db.query(`select * from cart_content
    where cart_id = ${c_id} and shoes_id = ${s_id}`);

    // Nếu chưa, thêm mới
    if (testRow.rowCount == 0) {
        /*
        // Kiểm tra số lượng trong kho
        let crrShoes = (await db.query(`select * from shoes where shoes_id = ${s_id};`)).rows[0];
        let crrInStock = crrShoes.stock;
        if (crrInStock < quantity) {
            return {e: "Đã hết hàng, vui lòng chọn sản phẩm khác hoặc chọn số lượng ít hơn."};
        }
        
        // Trừ số lượng trong kho
        crrInStock -= quantity;
        await db.query(`update shoes set stock = ${crrInStock} where shoes_id = ${s_id};`);
        */

        // Thêm sản phẩm mới vào giỏ hàng
        let newRow = await db.query(`insert into cart_content ("cart_id", "shoes_id", "cart_quantity")
        values (${c_id}, ${s_id}, ${quantity}) returning *;`);

        return newRow.rows[0];
        
    }

    // Nếu rồi, cấp nhật số lượng trong giỏ hàng
    /*
    // Kiểm tra số lượng trong kho
    let crrShoes = (await db.query(`select * from shoes where shoes_id = ${s_id};`)).rows[0];
    let crrInStock = crrShoes.stock;
    if (crrInStock < quantity) {
        return {e: "Đã hết hàng, vui lòng chọn sản phẩm khác hoặc chọn số lượng ít hơn."};
    }

    // Trừ số lượng trong kho
    crrInStock -= quantity;
    await db.query(`update shoes set stock = ${crrInStock} where shoes_id = ${s_id};`);
    */

    // Update số lượng mới vào giỏ hàng
    let newInCart = testRow.rows[0].cart_quantity + quantity;
    let updatedRow = await db.query(`update cart_content set cart_quantity = ${newInCart}
    where cart_id = ${c_id} and shoes_id = ${s_id} returning *;`);

    return updatedRow.rows[0];
};

exports.removeOneFromCart = async(c_id, s_id) => {
    let deletedRow = (await db.query(`select * from cart_content where cart_id = ${c_id} and shoes_id = ${s_id};`)).rows[0];

    /*
    let newInStock = deletedRow.cart_quantity;

    // Thêm lại số lượng giày trong giỏ vào kho
    await db.query(`update shoes set stock = stock + ${newInStock} where shoes_id = ${s_id};`);
    */

    // Xóa giày khỏi giỏ
    await db.query(`delete from cart_content where cart_id = ${c_id} and shoes_id = ${s_id};`)

    return deletedRow;
};

exports.removeAllFromCart = async(c_id) => {
    let deletedRows = (await db.query(`select * from cart_content where cart_id = ${c_id};`)).rows;

    /*
    // Xóa từng giày trong giỏ
    for (let item of deletedRows) {
        await this.removeOneFromCart(item.cart_id, item.shoes_id);
    }*/

    // Xóa mọi giày trong giỏ
    await db.query(`delete from cart_content where cart_id = ${c_id};`)

    return deletedRows;
};