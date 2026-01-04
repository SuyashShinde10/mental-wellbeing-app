const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getPatientTasks
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Route for /api/tasks
router.route('/').get(protect, getTasks).post(protect, createTask);

// Route for /api/tasks/:id
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

// NEW ROUTE: Doctor views patient tasks
router.get('/patient/:patientId', protect, getPatientTasks);

module.exports = router;