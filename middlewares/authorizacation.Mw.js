const jwt = require('jsonwebtoken');
const { getAll, getOne, addOne } = require('../models/auth/auth.M');


const authenToken = (req, res, next) => {
    const access_token = req.cookies.jwt;
    // access_token có dạng  `Beaer [token]`


    if (!access_token) {
        // unauthorized
        res.status(401).send(`
        <style>
        h1{
            text-align:center;
        }
        a{
            display:block;
            text-align:center;
        }
        button{
          border:none;
          border-radius:15px;
          background-color:#176fd3;
          padding: 1rem 2rem;
          color:white;
          font-size:1.8rem;
        }
        </style>
        <h1> Bạn chưa đăng nhập </h1>
        <a href ="/dangnhap">
        <button> Đăng nhập </button>
        </a>
        `);
        // res.redirect('/dangnhap');

    }

    // lấy thông tin của token
    const token = access_token.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {

        if (err) {
            res.status(401).send(
                `<style>
            h1{
                text-align:center;
            }
            a{
                display:block;
                text-align:center;
            }
            button{
            border:none;
            border-radius:15px;
            background-color:#176fd3;
            padding: 1rem 2rem;
            color:white;
            font-size:1.8rem;
            }
            </style>
            <h1> Phiên hết hạn. Hãy đăng nhập lại </h1>
            <a href ="/dangnhap">
            <button> Đăng nhập </button>
            </a>`)
            res.locals.user = null;

        }
        // console.log("data: ", data);
        res.locals.user = data;
    });

    next();
}

const checkUserIsLogin = (req, res, next) => {

    const access_token = req.cookies.jwt;
    if (!access_token) {
        next();
    } else if (access_token) {
        // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        //     if (err) {
        //         res.clearCookie("jwt");
        //     }

        // });

        res.redirect('/');

    }

}

const checkCurrentUser = (req, res, next) => {
    const access_token = req.cookies.jwt;
    if (!access_token) {
        next();
    } else {
        const token = access_token.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {

            res.locals.user = data;
        });
        next();
    }

}


const checkRole = (req, res, next) => {


    const access_token = req.cookies.jwt;
    if (!access_token) {

        res.redirect('/dangnhap')
    } else {
        const token = access_token.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {

            const roleUser = data.role;

            if (roleUser != 1) {
                // unauthorized
                res.status(401).send(
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
                )
            }
        });

        next();
    }
}
module.exports = { authenToken, checkUserIsLogin, checkCurrentUser };