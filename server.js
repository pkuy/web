const express = require("express");
const app = express();
const port = 3000;
const exhbs = require("express-handlebars");
const methodOverride = require('method-override');


// import cookie-parse
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
app.use(methodOverride('_method'))


// import dotenv - bien moi truong
require('dotenv').config();

// import authenToken 
const { authenToken, checkUserIsLogin } = require('./middlewares/authorizacation.Mw')

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public thư mục ra ngoài
app.use(express.static(__dirname + '/public'));


// doi ten
var hbs = exhbs.create({
    defaultLayout: "main",
    extname: "hbs",
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');


// kiểm tra user
app.use('/', require("./controllers/Site/home.C"))
    // route cho dangnhap, dangki
//app.use('/dangnhap', checkUserIsLogin, require("./controllers/Auth/logIn.C"));
app.use('/dangnhap', require("./controllers/Auth/logIn.C"));

app.use('/dangki', require("./controllers/Auth/logUp.C"));
//app.use('*', authenToken);

// router danh cho homepage
app.use('/', require("./controllers/Site/home.C"));

// route cho chi tiết giày
app.use('/shoes', require("./controllers/Detail/shoes.C"));

// route cho adidas
app.use('/adidas', require("./controllers/BrandPage/adidas.C"));
// route cho nike
app.use('/nike', require("./controllers/BrandPage/nike.C"));
// route cho bitis
app.use('/bitis', require("./controllers/BrandPage/bitis.C"));


// route dang xuat
app.use('/dangxuat', require("./controllers/Auth/logOut.C"));

// route cho gio hang
app.use('/cart', require("./controllers/Cart/cart.C"))

app.use('/order', require("./controllers/Order/order.C"))

app.listen(port, () => {
    console.log(`Listen in port http://localhost:${port}`);
});