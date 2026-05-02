const Product = require('../models/product.model');
const imagekit = require('../config/imagekit');


// create product
const createProduct = async (req, res) => {
    try {
        let imageUrl = "";

        // upload image to ImageKit
        if (req.file) {
            const uploadedImage = await imagekit.upload({
                file: req.file.buffer.toString("base64"),
                fileName: Date.now() + "-" + req.file.originalname
            });

            imageUrl = uploadedImage.url;
        }

        const product = await Product.create({
            ...req.body,
            image: imageUrl,
            owner: req.user.id
        });

        return res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        console.log("CREATE PRODUCT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// get single product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// update product
const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // owner check
        if (product.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // owner check
        if (product.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        await product.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Product deleted"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct
};