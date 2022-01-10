const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.status(404).send(
        `
            <style> 
            html{
                text-align: center;
            }
            h1{
                margin-top:10rem;
                color:#e63946;
            }
            </style>
           <h1>Whoops, looks like something went wrong ! <h1>
        `
    );
});

module.exports = router;