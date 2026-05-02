const express = require('express');
const router = express.Router();

const { protect, isUser } = require('../middlewares/auth.middleware');

const {
    register,
    login,
    getUserProfile,
    updateUserProfile,
    addAddress,
    deleteAddress
} = require('../controllers/user.controller');


// auth routes
router.post('/register', register);
router.post('/login', login);

// user routes
router.get('/profile', protect, isUser, getUserProfile);
router.put('/profile', protect, isUser, updateUserProfile);

// address
router.post('/address', protect, isUser, addAddress);
router.delete('/address/:addressId', protect, isUser, deleteAddress);

module.exports = router;