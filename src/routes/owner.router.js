const express = require('express');
const Owner = require('../models/owner.model');
const router = express.Router();

// Route to display the owner dashboard
router.get('/', (req, res) => {
    res.send('it works');
});

router.post('/create' , async (req, res) => {
    res.send('it works');
  
});

module.exports = router;