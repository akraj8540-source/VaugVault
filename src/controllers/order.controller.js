const Order = require('../models/order.model');
const User = require('../models/user.model');


// place order
const placeOrder = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.productId');

        if (!user.cart.length) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let totalAmount = 0;

        user.cart.forEach(item => {
            totalAmount += item.productId.price * item.quantity;
        });

        const order = await Order.create({
            user: user._id,
            items: user.cart,
            totalAmount,
            address: req.body.address
        });

        // clear cart
        user.cart = [];
        await user.save();

        res.status(201).json({
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// get user orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    placeOrder,
    getMyOrders
};