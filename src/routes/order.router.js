const express = require('express');
const router = express.Router();

const { placeOrder, getMyOrders } = require('../controllers/order.controller');
const { protect, isUser } = require('../middlewares/auth.middleware');

router.post('/', protect, isUser, placeOrder);
router.get('/', protect, isUser, getMyOrders);

module.exports = router;