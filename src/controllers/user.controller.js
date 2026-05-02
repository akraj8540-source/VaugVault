const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');


// ================= REGISTER =================
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.log("REGISTER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};


// ================= LOGIN =================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};


// ================= GET PROFILE =================
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};


// ================= UPDATE PROFILE =================
const updateUserProfile = async (req, res) => {
    try {
        const updateData = {};

        if (req.body.username) updateData.username = req.body.username;
        if (req.body.picture) updateData.picture = req.body.picture;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};


// ================= ADD ADDRESS =================
const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.address.push(req.body);
        await user.save();

        return res.status(200).json({
            success: true,
            address: user.address
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};


// ================= DELETE ADDRESS =================
const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.address = user.address.filter(
            addr => addr._id.toString() !== addressId
        );

        await user.save();

        return res.status(200).json({
            success: true,
            address: user.address
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};


// ================= LOGOUT =================
const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};


// ================= EXPORT =================
module.exports = {
    register,
    login,
    getUserProfile,
    updateUserProfile,
    addAddress,
    deleteAddress,
    logout
};