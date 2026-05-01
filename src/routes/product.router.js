const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
// Route to display the product dashboard
router.get('/', (req, res) => {
    res.send('it works');
}); 

module.exports = router;