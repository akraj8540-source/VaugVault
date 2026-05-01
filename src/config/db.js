const mongoose = require('mongoose');
const dbgr = require('debug')('app:db');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        dbgr('Connected to MongoDB');
    } catch (error) {
        dbgr('Error connecting to MongoDB:', error);
    }
};

module.exports = connectDB;