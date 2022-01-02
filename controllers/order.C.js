const express = require("express");
const router = express.Router();
const { getUserById, getCartId, getCartContent, getCrrCartPrice,
    addToCart, removeOneFromCart, removeAllFromCart } = require('../models/user/cart');

const { createOrder } = require('../models/user/order');

router.post("/:type", async(req,res) =>{
    
    // Tạm
    let u_id = 3;

    //let u_id = req.params.user_id;
    let user = await getUserById(u_id);
    let c_id = await getCartId(u_id);
    let p_type  = req.params.type;
    
    let createRes = await createOrder(2, p_type);
    console.log(createRes);
    
    let c_content = await getCartContent(c_id);
    let c_price = await getCrrCartPrice(c_id);
    
    if (createRes) {
        res.render('cart/cart', {
            titleP: () => 'titleCart',
            cssP: () => 'cssCart',
            scriptsP: () => 'scriptCart',
            navP: () => 'nav',
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

module.exports = router;