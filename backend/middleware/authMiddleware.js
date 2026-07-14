const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify signature and expiry
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized — user no longer exists');
      }

      return next();
    } catch (error) {
      // Log server-side only; never expose JWT internals to the client
      console.error(`[Auth] Token verification failed: ${error.message}`);
      res.status(401);
      throw new Error('Not authorized — invalid token');
    }
  }

  res.status(401);
  throw new Error('Not authorized — no token provided');
});

module.exports = { protect };