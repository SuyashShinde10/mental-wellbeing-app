const express = require('express');
const router = express.Router();
const { 
    assignDoctor, 
    completeAppointment, 
    createAppointment, 
    getAllAppointments, 
    getMyAppointments, 
    cancelAppointment,
    addFeedback // Import
} = require('../controllers/appointmentController');

const { protect } = require('../middleware/authMiddleware');

// Route Defintions
router.put('/:id/assign', protect, assignDoctor);
router.put('/:id/complete', protect, completeAppointment);
router.post('/', protect, createAppointment);
router.get('/admin', protect, getAllAppointments);
router.get('/my', protect, getMyAppointments);
router.delete('/:id', protect, cancelAppointment);

// NEW: Feedback Route
router.put('/:id/feedback', protect, addFeedback);

module.exports = router;