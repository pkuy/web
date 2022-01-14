const express = require("express");
const { getOrder,getOrdertotal,priceForShow} = require("../../models/owner/ordersDetail.M");
const router = express.Router();

router.get("/:id/detail", async(req, res) => {
    let orderId = req.params.id;
    let pds = await getOrder(orderId);

    let od = await getOrdertotal(orderId);

    for (let pd of pds) {

        pd.price = priceForShow(pd.price);
    }

    od.total = priceForShow(od.total);

    res.render('Manager/orderDetail', {
        title: "Chi tiết hóa đơn",
        cssP: () => 'Cart/cssCart',
        scriptsP: () => 'Cart/scriptCart',
        Packages: pds,
        Order: od,
    });
});

module.exports = router;