const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();
connectDB();

const app = express();

// --- ⚙️ 1. CORS MIDDLEWARE (Must be very early) ---
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// --- 🛡️ 2. SECURITY MIDDLEWARE ---
// Adjusted helmet for local development so it doesn't block images/requests
app.use(helmet({
    crossOriginResourcePolicy: false, 
}));

app.use(express.json());

// --- ⏳ 3. RATE LIMITER (Increased for testing) ---
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 500, // Increased to 500 so you don't get blocked while testing
    message: 'Too many requests, please try again later.'
});
app.use('/api', limiter);

// --- 📂 4. STATIC FILES ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 🛣️ 5. ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));

app.get('/', (req, res) => res.send('Secure API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});