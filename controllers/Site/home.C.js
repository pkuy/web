const express = require("express");
const { getAllNike } = require("../../models/user/nike");
const { getAllAdidas } = require("../../models/user/adidas");
const { getAllBitis } = require("../../models/user/bitis");
const { authenToken, checkUserIsLogin } = require("../../middlewares/authorizacation.Mw")
const router = express.Router();

// [GET] localhost://3000/ -> render trang đăng nhập
router.get("/", (req, res) => {
    res.render('account/logIn', {
        titleP: () => 'titleLogIn',
        cssP: () => 'Auth/auth',
        scriptsP: () => 'Auth/scriptLogin',
        navP: () => 'nav',
    });
});

router.get("/home", authenToken, async(req, res) => {
    // phan cua adidas

    let pdsNike = await (await getAllNike()).slice(5, 10);
    let pdsAdidas = await (await getAllAdidas()).slice(5, 10);
    let pdsBitis = await (await getAllBitis()).slice(5, 10);
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