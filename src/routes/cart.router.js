const express = require('express');
const router = express.Router();
const { protect, isUser } = require('../middlewares/auth.middleware');


const {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
} = require('../controllers/cart.controller');


//  USER ONLY
router.post('/add', protect, isUser, addToCart);
router.get('/', protect, isUser, getCart);
router.put('/update', protect, isUser, updateCartItem);
router.delete('/remove', protect, isUser, removeFromCart);

module.exports = router;