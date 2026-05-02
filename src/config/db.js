const mongoose = require('mongoose');
const debug = require('debug')('app:db');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        debug('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;