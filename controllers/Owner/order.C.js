const express = require("express");
const router = express.Router();

router.get("/", (req,res) =>{

    res.render('Manager/order', {
        title: 'Quản lý đơn hàng',
        cssP: () => 'OwnerOrder/cssOrder',
        scriptsP: () => 'OwnerOrder/scriptOrder',
    });
});

module.exports = router;