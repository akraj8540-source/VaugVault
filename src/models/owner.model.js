const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const OwnerSchema = new mongoose.Schema({
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
        
    },
isAdmin: {
    type: Boolean,
    default: true
},
    gstin: {
        type: String
    },

    picture: {
        type: String
    },

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { timestamps: true });


// JWT token
OwnerSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id, role: 'owner' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};




const Owner = mongoose.model('Owner', OwnerSchema);

module.exports = Owner;