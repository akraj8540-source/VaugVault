const mongoose = require('mongoose');


const OwnerSchema = new mongoose.Schema({
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
 
    products: {
        type: Array,
        default: []
    },
    picture:{
        type: String,
        gstin: String
    },
   

});

const Owner = mongoose.model('Owner', OwnerSchema);

module.exports = Owner;