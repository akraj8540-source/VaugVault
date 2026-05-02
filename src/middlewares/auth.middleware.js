const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Owner = require('../models/owner.model');


//  PROTECT ROUTE
const protect = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // fetch user based on role
        if (decoded.role === 'owner') {
            req.user = await Owner.findById(decoded.id);
        } else {
            req.user = await User.findById(decoded.id);
        }

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized"
        });
    }
};


//  OWNER ONLY 
const isOwner = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: "Admin access only"
        });
    }
    next();
};


// User only
const isUser = (req, res, next) => {
    if (!req.user || req.user.constructor.modelName !== 'User') {
        return res.status(403).json({
            success: false,
            message: "User access only"
        });
    }
    next();
};


module.exports = {
    protect,
    isOwner,
    isUser
};