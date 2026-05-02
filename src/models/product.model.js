const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    image: {
        type: String
    },

    discount: {
        type: Number,
        default: 0
    },

    stock: {
        type: Number,
        default: 0
    },

    bgColor: {
        type: String
    },

    textColor: {
        type: String
    },

    panelColor: { // fixed naming
        type: String
    },

    //  link product to owner
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
  

}, 
{ timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;