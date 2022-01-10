const express = require("express");
const router = express.Router();

router.get("/", (req,res) =>{

    res.render('Manager/product', {
        title: 'Quản lý sản phẩm',
        cssP: () => 'OwnerProduct/cssProduct',
        scriptsP: () => 'OwnerProduct/scriptProduct',
    });
});

module.exports = router;