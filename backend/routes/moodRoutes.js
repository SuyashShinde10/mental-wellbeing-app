const express = require('express');
const router = express.Router();
const { createMood, getMoods } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createMood);
router.get('/', protect, getMoods);

// Route for Doctors to view a specific patient's mood history
router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    const Mood = require('../models/Mood');
    const moods = await Mood.find({ user: req.params.patientId }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;