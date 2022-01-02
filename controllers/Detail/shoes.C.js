const express = require("express");
const { getShoes } = require("../../models/user/shoes");
const router = express.Router();

router.get("/:id/detail", async(req, res) => {
    let shoesId = req.params.id;
    let pd = await getShoes(shoesId);

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
        name: pd.shoes_name,
        size: pd.size,
        stock: pd.stock,
        image: pd.image,
        price: pd.price,
        brand: Brand
    });
});



module.exports = router;