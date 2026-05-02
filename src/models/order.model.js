const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number
        }
    ],
    totalAmount: Number,
    address: Object,
    status: {
        type: String,
        default: 'Placed' // Placed, Shipped, Delivered
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);