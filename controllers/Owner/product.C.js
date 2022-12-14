const express = require("express");
const router = express.Router();
const {getAllProducts,priceForShow} = require("../../models/owner/products.M.js");

router.get("/", async(req,res) =>{
    
    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const start = (page - 1) * perPage;
    const end = page * perPage;

    allData = (await getAllProducts()).length;
    allPage = Math.ceil(allData / perPage);

    previousPage = page
    nextPage = page
    if (page > 1) {
        previousPage = page - 1
    }
    if (page < allPage) {
        nextPage = page + 1
    }

    let pds = await (await getAllProducts()).slice(start, end);
    //let pds = await getAllProducts()

    // Thay đổi thông tin để hiển thị
    for (let pd of pds) {

        pd.price = priceForShow(pd.price);

        if (pd.brand_id == 1) {
            pd.brand_id ="Nike"
        } else if (pd.brand_id == 2) {
            pd.brand_id = "Adidas"
        } else {
            pd.brand_id = "Bitis"
        }
    }

    res.render('Manager/product', {
        title: 'Quản lý sản phẩm',
        cssP: () => 'OwnerProduct/cssProduct',
        scriptsP: () => 'OwnerProduct/scriptProduct',
        Packages: pds,
        page: page,
        NextPage: nextPage,
        PreviousPage: previousPage,
    });
});

module.exports = router;