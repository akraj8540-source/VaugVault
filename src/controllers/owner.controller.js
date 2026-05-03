const Owner = require('../models/owner.model');
const bcrypt = require('bcrypt');


// REGISTER OWNER
const registerOwner = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields required'
            });
        }

        const exists = await Owner.findOne({ email });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'Email already used'
            });
        }

        // hash password ONLY HERE
        const hashedPassword = await bcrypt.hash(password, 10);

        const owner = await Owner.create({
            username,
            email,
            password: hashedPassword
        });

        sendToken(owner, 201, res);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// LOGIN OWNER
const loginOwner = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields required'
            });
        }

        // MUST include password
        const owner = await Owner.findOne({ email }).select('+password');

        if (!owner) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const match = await bcrypt.compare(password, owner.password);

        if (!match) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        sendToken(owner, 200, res);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET OWNER PROFILE
const getOwnerProfile = async (req, res) => {
    try {
        const owner = await Owner.findById(req.user._id);

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner not found'
            });
        }

        res.status(200).json({
            success: true,
            owner
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// LOGOUT OWNER
const logoutOwner = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out'
    });
};


// SEND TOKEN
const sendToken = (owner, statusCode, res) => {
    const token = owner.getSignedJwtToken();

    res.status(statusCode).cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict'
    }).json({
        success: true,
        token,
        owner: {
            id: owner._id,
            username: owner.username,
            email: owner.email
        }
    });
};

module.exports = {
    registerOwner,
    loginOwner,
    getOwnerProfile,
    logoutOwner
};