const express = require('express');
const User = require('../models/user.model');
const router = express.Router();

// Route to display the user dashboard
router.get('/', (req, res) => {
    res.send('it works');
});

module.exports = router;