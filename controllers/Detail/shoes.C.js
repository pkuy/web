const express = require("express");
const { getShoes, priceForShow } = require("../../models/user/shoes");
const router = express.Router();

router.get("/:id/detail", async(req, res) => {
    let shoesId = req.params.id;
    let pd = await getShoes(shoesId);
    pd.price = priceForShow(pd.price);

    console.log(pd);

    let Brand;

    if (pd.brand_id == 1) {
        Brand = "Nike"
    } else if (pd.brand_id == 2) {
        Brand = "Adidas"
    } else {
        Brand = "Bitis"
    }

    res.render('Brandpage/shoesPage', {
        title: `${pd.shoes_name}`,
        cssP: () => 'Detail/cssShoes',
        scriptsP: () => 'Adidas/scriptAdidasPage',
        Shoes: pd,
        brand: Brand
    });
});



module.exports = router;