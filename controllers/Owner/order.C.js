const express = require("express");
const router = express.Router();
const {getOrders} = require("../../models/owner/orders.M.js");

router.get("/", async(req,res) =>{

    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const start = (page - 1) * perPage;
    const end = page * perPage;

    allData = (await getOrders()).length;
    allPage = Math.ceil(allData / perPage);

    previousPage = page
    nextPage = page
    if (page > 1) {
        previousPage = page - 1
    }
    if (page < allPage) {
        nextPage = page + 1
    }

    let pds = await (await getOrders()).slice(start, end);

    res.render('Manager/order', {
        title: 'Quản lý đơn hàng',
        cssP: () => 'OwnerOrder/cssOrder',
        scriptsP: () => 'OwnerOrder/scriptOrder',
        Packages: pds,
        page: page,
        NextPage: nextPage,
        PreviousPage: previousPage,
    });
});

module.exports = router;