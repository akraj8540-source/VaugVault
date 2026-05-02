const User = require('../models/user.model');
const Product = require('../models/product.model');


// add to cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const user = await User.findById(req.user._id);

        const existingItem = user.cart.find(
            item => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            user.cart.push({
                productId,
                quantity: quantity || 1
            });
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Product added to cart',
            cart: user.cart
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// get cart
const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('cart.productId');

        res.status(200).json({
            success: true,
            cart: user.cart
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// update cart item
const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const user = await User.findById(req.user._id);

        const item = user.cart.find(
            item => item.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = quantity;

        await user.save();

        res.status(200).json({
            success: true,
            cart: user.cart
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// remove from cart
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;

        const user = await User.findById(req.user._id);

        user.cart = user.cart.filter(
            item => item.productId.toString() !== productId
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cart: user.cart
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
};