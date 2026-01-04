const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getMe, 
    updateContacts, 
    updateStatus, 
    getMyPatients 
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Protected Routes
router.get('/me', protect, getMe);
router.put('/contacts', protect, updateContacts); // Fixes the crash if this was failing
router.put('/status', protect, updateStatus); // For Doctor availability
router.get('/mypatients', protect, getMyPatients); // For Doctor Dashboard

module.exports = router;