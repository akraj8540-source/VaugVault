const express = require('express');


const app = express();
const cookies = require('cookie-parser');
const Owner = require('./models/owner.model');
app.use(cookies());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.json());


app.use('/owner', require('./routes/owner.router'));
app.use('/user', require('./routes/user.router'));
app.use('/product', require('./routes/product.router'));

module.exports = app;