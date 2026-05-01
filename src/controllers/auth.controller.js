const userModel =  require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
      // existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const User = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        sendTokenResponse(User, 201, res);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

   // login
   const  login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
    }
    catch (error){
        res.status(500).json({ message: 'Server error' });
    }
    

    // check for user and password match
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);

};


// get current user
const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        res.status(200).json({ success: true, data:{
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            picture: user.picture,
            address: user.address
        }
     });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// logout
const logout = (req, res) => {
    res.cookie('token', 'none', {   
         expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
         httpOnly: true
     });
     res.status(200).json({ success: true, message: 'Logged out' });
 };

 // get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        httpOnly: true
    };
    res.status(statusCode).cookie('token', token, options).json({ success: true, token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                
            }
        });
};

module.exports = {
    register,
    login,
    getMe,
    logout
};