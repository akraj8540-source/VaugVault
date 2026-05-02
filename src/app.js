const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();


// ================= MIDDLEWARE =================
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.set('view engine', 'ejs');


// ================= ROUTES =================
app.use('/user', require('./routes/user.router'));
app.use('/owner', require('./routes/owner.router'));
app.use('/product', require('./routes/product.router'));
app.use('/cart', require('./routes/cart.router'));
app.use('/order', require('./routes/order.router'));


// ================= HEALTH CHECK =================
app.get('/', (req, res) => {
    res.send('API is running...');
});


// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
    console.error(err.message);

    res.status(500).json({
        success: false,
        message: err.message || 'Server Error'
    });
});


module.exports = app;