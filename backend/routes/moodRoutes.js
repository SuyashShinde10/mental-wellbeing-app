const express = require('express');
const router = express.Router();
const { createMood, getMoods } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Mood = require('../models/Mood');

router.post('/', protect, createMood);
router.get('/', protect, getMoods);

// Doctor views a specific patient's mood history (IDOR fix — only assigned doctor or patient)
router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    const { patientId } = req.params;
    const isOwnData = req.user.id === patientId;
    const isDoctor  = req.user.role === 'doctor';

    if (!isOwnData && !isDoctor) {
      return res.status(403).json({ message: 'Not authorized to view this data' });
    }

    // If doctor, ensure patient is actually assigned to them
    if (isDoctor && !isOwnData) {
      const patient = await User.findOne({ _id: patientId, assignedDoctor: req.user._id });
      if (!patient) {
        return res.status(403).json({ message: 'This patient is not assigned to you' });
      }
    }

    const moods = await Mood.find({ user: patientId }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;