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
        select: false // hide password
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


//  JWT method (for owner login)
OwnerSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id, role: 'owner' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

// Hash password before saving
OwnerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const Owner = mongoose.model('Owner', OwnerSchema);

module.exports = Owner;