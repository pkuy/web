const express = require("express");
const { getAllNike, priceForShow } = require("../../models/user/nike");
const router = express.Router();

router.get("/", async(req, res) => {
    // phan cua adidas
    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const start = (page - 1) * perPage;
    const end = page * perPage;

    allData = (await getAllNike()).length;
    allPage = Math.ceil(allData / perPage);

    previousPage = page
    nextPage = page
    if (page > 1) {
        previousPage = page - 1
    }
    if (page < allPage) {
        nextPage = page + 1
    }

    let pds = await (await getAllNike()).slice(start, end);

    for (let pd of pds) {
        pd.price = priceForShow(pd.price);
    }

    res.render('Brandpage/nikePage', {
        title: () => 'Nike',
        cssP: () => 'Nike/cssNikePage',
        scriptsP: () => 'Nike/scriptNikePage',
        Packages: pds,
        page: page,
        NextPage: nextPage,
        PreviousPage: previousPage,
    });
});



module.exports = router;