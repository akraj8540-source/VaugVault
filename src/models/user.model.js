const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false //  hide password
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],

    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],

    picture: {
        type: String
    },

    address: [{
        street: String,
        city: String,
        state: String,
        zipCode: String,
        contact: String
    }]

}, { timestamps: true });


// JWT Token method
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '1d' }
    );
};

const User = mongoose.model('User', userSchema);

module.exports = User;