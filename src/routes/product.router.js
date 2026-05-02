const express = require('express');
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');

const { protect, isOwner } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');


// public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);


// owner routes
router.post('/', protect, isOwner, upload.single('image'), createProduct);
router.put('/:id', protect, isOwner, upload.single('image'), updateProduct);
router.delete('/:id', protect, isOwner, deleteProduct);


module.exports = router;