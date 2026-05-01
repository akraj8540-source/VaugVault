const { text } = require('express');
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    image: String,
    discount: {
        type: Number,
        default: 0
    },
    stock: Number,
    bgColor: String,
    textColor: String,
    panelcolor: String

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;   
    