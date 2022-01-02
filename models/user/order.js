const db = require('../db');
const { getUserById, getCartId, getCartContent, getCrrCartPrice,
    addToCart, removeOneFromCart, removeAllFromCart } = require('./cart');

exports.createOrder = async(c_id, type) => {
    let creataRes;
    let c_content = await getCartContent(c_id);
    if (c_content.length == 0) {
        creataRes = {
            state: 0, // fail
            msg: "Chưa có sản phẩm trong giỏ"
        }
        return creataRes;
    }
};