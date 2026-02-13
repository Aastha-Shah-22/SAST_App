require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Fallback to local Mongo if env var is missing
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/dast';

        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
