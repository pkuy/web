const express = require("express");
const { getOrder,getOrdertotal} = require("../../models/owner/ordersDetail.M");
const router = express.Router();

router.get("/:id/detail", async(req, res) => {
    let orderId = req.params.id;
    let pd = await getOrder(orderId);

    let od = await getOrdertotal(orderId);

    res.render('Manager/orderDetail', {
        title: "Chi tiết hóa đơn",
        cssP: () => 'Cart/cssCart',
        scriptsP: () => 'Cart/scriptCart',
        Packages: pd,
        Order: od,
    });
});

module.exports = router;