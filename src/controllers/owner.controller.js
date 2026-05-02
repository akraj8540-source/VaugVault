const Owner = require('../models/owner.model');
const bcrypt = require('bcrypt');


// register owner
const registerOwner = async (req, res) => {
    try {
        const { username, email, password, gstin } = req.body;

        // validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // check existing owner
        const existingOwner = await Owner.findOne({ email });
        if (existingOwner) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // password will be hashed in model (pre-save)
        const owner = await Owner.create({
            username,
            email,
            password,
            gstin
        });

        sendTokenResponse(owner, 201, res);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// login owner
const loginOwner = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // get owner with password
        const owner = await Owner.findOne({ email }).select('+password');

        if (!owner) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, owner.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        sendTokenResponse(owner, 200, res);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// get current owner
const getOwnerProfile = async (req, res) => {
    try {
        const owner = await Owner.findById(req.user._id);

        res.status(200).json({
            success: true,
            owner: {
                id: owner._id,
                username: owner.username,
                email: owner.email,
                gstin: owner.gstin,
                picture: owner.picture,
                createdAt: owner.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// logout owner
const logoutOwner = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Owner logged out successfully'
    });
};


// helper to send token response
const sendTokenResponse = (owner, statusCode, res) => {
    const token = owner.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            owner: {
                id: owner._id,
                username: owner.username,
                email: owner.email,
                gstin: owner.gstin
            }
        });
};


module.exports = {
    registerOwner,
    loginOwner,
    getOwnerProfile,
    logoutOwner
};