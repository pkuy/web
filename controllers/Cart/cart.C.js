const express = require("express");
const router = express.Router();
const { getUserById, getCartId, priceForShow, getCartContent, getCrrCartPrice,
    addToCart, removeOneFromCart, removeAllFromCart } = require('../../models/user/cart');


router.get("/", async(req,res) =>{
    // Tạm
    let u_id = 3;
    
    //let u_id = req.params.user_id;
    let user = await getUserById(u_id);
    let c_id = await getCartId(u_id);

    let c_content = await getCartContent(c_id);
    let c_price = await getCrrCartPrice(c_id);
    if (!c_price) {
        c_price = 0;
    }

    //Hiển thị giá
    for (let content of c_content) {
        content.price = priceForShow(content.price);
    }
    c_price = priceForShow(c_price);

    res.render('cart/cart', {
        title: "Giỏ hàng",
        cssP: () => 'Cart/cssCart',
        scriptsP: () => 'Cart/scriptCart',
        Cart_id: c_id,
        User: user,
        Contents: c_content,
        sumPrice: c_price,
    });
});

router.post('/:shoesid/', async(req, res) => {
    // Tạm
    let u_id = 3;
    
    //let u_id = req.params.user_id;
    let c_id = await getCartId(u_id);

    let s_id = req.params.shoesid;
    let quantity = req.body.quantity;

    let addRow = await addToCart(c_id, s_id, quantity);
    
    res.redirect('back');
});

router.delete('/:shoesid/', async(req, res) => {
    // Tạm
    let u_id = 3;
    
    //let u_id = req.params.user_id;
    let c_id = await getCartId(u_id);

    let s_id = req.params.shoesid;
    
    let deletedRow = await removeOneFromCart(c_id, s_id);
    console.log("Đã xóa:", deletedRow);

    res.redirect('back');
});

router.delete('/', async(req, res) => {
    // Tạm
    let u_id = 3;
    
    //let u_id = req.params.user_id;
    let c_id = await getCartId(u_id);

    let deletedRows = await removeAllFromCart(c_id);
    console.log("Đã xóa: ", deletedRows);

    res.redirect('back');
});

module.exports = router;