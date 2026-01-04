const Mood = require('../models/Mood');

// @desc    Log a new mood
// @route   POST /api/moods
const createMood = async (req, res) => {
  const { mood, note } = req.body;

  if (!mood) {
    return res.status(400).json({ message: 'Please select a mood' });
  }

  try {
    const newMood = await Mood.create({
      user: req.user.id,
      mood,
      note,
    });
    res.status(201).json(newMood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user mood history
// @route   GET /api/moods
const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMood, getMoods };