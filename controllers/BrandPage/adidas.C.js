const express = require("express");
const { getAllAdidas } = require("../../models/user/adidas");
const router = express.Router();

router.get("/", async(req, res) => {
    // phan cua adidas
    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const start = (page - 1) * perPage;
    const end = page * perPage;

    allData = (await getAllAdidas()).length;
    allPage = Math.ceil(allData / perPage);

    previousPage = page
    nextPage = page
    if (page > 1) {
        previousPage = page - 1
    }
    if (page < allPage) {
        nextPage = page + 1
    }

    let pds = await (await getAllAdidas()).slice(start, end);
    res.render('Brandpage/adidasPage', {
        title: 'Adidas',
        cssP: () => 'Adidas/cssAdidasPage',
        scriptsP: () => 'Adidas/scriptAdidasPage',
        Packages: pds,
        page: page,
        NextPage: nextPage,
        PreviousPage: previousPage,
    });
});



module.exports = router;