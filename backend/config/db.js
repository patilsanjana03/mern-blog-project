const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // We only pass the URI. No extra options needed for modern Mongoose.
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ Database Connection Failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;