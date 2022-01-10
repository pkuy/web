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
const { authenToken, checkUserIsLogin, checkCurrentUser } = require('./middlewares/authorizacation.Mw')

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
    helpers: {
        // so sanh chuoi
        compareString(s1, s2, options) {
            return s1 === s2 ? options.fn(this) : options.inverse(this);
        },

        // so sanh hai so
        compareInt(int1, int2, options) {
            return +int1 === +int2 ? options.fn(this) : options.inverse(this);
        },
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');



// kiểm tra user
app.use('/', checkCurrentUser, require("./controllers/Site/home.C"))
    // route cho dangnhap, dangki
app.use('/dangnhap', checkUserIsLogin, require("./controllers/Auth/logIn.C"));

app.use('/dangki', checkUserIsLogin, require("./controllers/Auth/logUp.C"));
// app.use('*', authenToken);

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
app.use('/giohang', authenToken, require("./controllers/Cart/cart.C"));

app.use('/donhang', authenToken, require("./controllers/Order/order.C"));

//route cho quan li san pham
app.use('/quanlisanpham', require("./controllers/Owner/product.C"));

//route cho quan li don hang
app.use('/quanlidonhang', require("./controllers/Owner/order.C"));


app.use('*', require("./controllers/Site/whoop.C"));

app.listen(port, () => {
    console.log(`Listen in port http://localhost:${port}`);
});