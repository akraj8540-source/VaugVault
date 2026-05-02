const express = require('express');
const router = express.Router();

const {
    registerOwner,
    loginOwner,
    getOwnerProfile,
    logoutOwner
} = require('../controllers/owner.controller');

const { protect } = require('../middlewares/auth.middleware');

router.post('/register', registerOwner);
router.post('/login', loginOwner);
router.get('/me', protect, getOwnerProfile);
router.get('/logout', logoutOwner);

module.exports = router;