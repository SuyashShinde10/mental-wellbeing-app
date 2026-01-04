const mongoose = require('mongoose');

const moodSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    mood: {
      type: String, // e.g., 'Happy', 'Sad', 'Angry'
      required: true,
    },
    note: {
      type: String, // Optional text note
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Mood = mongoose.model('Mood', moodSchema);
module.exports = Mood;