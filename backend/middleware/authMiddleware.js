const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];

      // 🔥 DEBUG (optional, remove later)
      console.log("TOKEN:", token);

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔥 DEBUG
      console.log("DECODED:", decoded);

      // ✅ Fetch full user from DB
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // ✅ Attach user to request
      req.user = user;

      return next(); // 🔥 IMPORTANT (return added)

    } else {
      return res.status(401).json({
        message: 'No token, authorization denied'
      });
    }

  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    return res.status(401).json({
      message: 'Token is invalid or expired'
    });
  }
};

module.exports = { protect };