const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        minlength: 3,
     } ,
    email:{ type: String, 
        required: true,
        unique: true ,
    } ,
    password: {type: String,
        required: true,
        minlength: 6
    },
    cart : [{  
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
            quantity:{type: Number, default: 1}
        }],
    isAdmin: {
        type: Boolean,
        default: false
    },
    order: {
        type: Array,
        default: []
    },
    picture:{
        type: String
    },
    address : [{
        street: String,
        city: String,
        state: String,
        zipCode: String,
        contact: String
    }]

});

const User = mongoose.model('User', userSchema);

module.exports = User;