const Owner = require('../models/owner.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const JWT = require('jsonwebtoken');

//create owner
const createOwner = async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        const owner = await Owner.create({ name, email, password });
        res.status(201).json(owner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};