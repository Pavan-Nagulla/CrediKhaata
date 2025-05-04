const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // 1. Check for Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        error: 'Authorization header missing' 
      });
    }

    // 2. Verify token format
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token format'
      });
    }

    // 3. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?._id) {
      throw new Error('Invalid token payload');
    }

    // 4. Find user with valid token
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    }).select('-password'); // Exclude password from user object

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found or token revoked'
      });
    }

    // 5. Attach user and token to request
    req.token = token;
    req.user = user;
    next();

  } catch (error) {
    console.error('Authentication error:', error.message);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }

    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

module.exports = auth;