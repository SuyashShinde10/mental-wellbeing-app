const express = require('express');
const router = express.Router();
// Ensure the path to controllers is correct
const { getAllUsers, assignDoctor } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Middleware to check if user is Admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// GET /api/admin/users
router.get('/users', protect, adminOnly, getAllUsers);

// POST /api/admin/assign
// Line 16 fix: ensure 'assignDoctor' is not undefined
router.post('/assign', protect, adminOnly, assignDoctor);

module.exports = router;