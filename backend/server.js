const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Security Middlewares
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

dotenv.config();
connectDB();

const app = express();

// --- 🛡️ SECURITY MIDDLEWARE ---
app.use(helmet()); // Sets secure HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allows frontend to load images
app.use((req, res, next) => {
    Object.defineProperty(req, 'query', {
        value: { ...req.query },
        writable: true,
        configurable: true,
        enumerable: true
    });
    next();
});

app.use(mongoSanitize()); // Prevents NoSQL injection attacks

// Rate limiting: max 100 requests per 10 minutes per IP
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter); 

// --- ⚙️ STANDARD MIDDLEWARE ---
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Update this when deploying frontend!
    credentials: true
}));

// --- 📂 STATIC FILES (MULTER) ---
// This allows the frontend to access uploaded files via http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 🛣️ ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes')); // <-- Updated from posts to blogs!

app.get('/', (req, res) => res.send('Secure API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on  http://localhost:${PORT}`);
});