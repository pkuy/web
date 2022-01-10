const express = require("express");
const { getAllNike, priceForShow } = require("../../models/user/nike");
const { getAllAdidas } = require("../../models/user/adidas");
const { getAllBitis } = require("../../models/user/bitis");

const router = express.Router();

// [GET] localhost: //3000/ -> render trang đăng nhập

router.get("/", async(req, res) => {
    // phan cua trang chu

    let pdsNike = await (await getAllNike()).slice(5, 10);
    let pdsAdidas = await (await getAllAdidas()).slice(5, 10);
    let pdsBitis = await (await getAllBitis()).slice(5, 10);

    for (let pd of pdsNike) {
        pd.price = priceForShow(pd.price);
    }
    for (let pd of pdsAdidas) {
        pd.price = priceForShow(pd.price);
    }
    for (let pd of pdsBitis) {
        pd.price = priceForShow(pd.price);
    }

    res.render('home', {

        cssP: () => 'Homepage/css',
        scriptsP: () => 'Homepage/script',
        PackagesNike: pdsNike,
        PackagesAdidas: pdsAdidas,
        PackagesBitis: pdsBitis,
        title: 'Trang chủ',
    });
});



module.exports = router;