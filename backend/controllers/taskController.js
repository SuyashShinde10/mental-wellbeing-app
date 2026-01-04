const Task = require('../models/Task');

// @desc    Get user tasks
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  const { text, patientId } = req.body;

  if (!text || !patientId) {
    return res.status(400).json({ message: 'Please add text and patient ID' });
  }

  try {
    if (req.user.role !== 'doctor') {
       return res.status(401).json({ message: 'Only doctors can assign tasks' });
    }

    const task = await Task.create({
      text: text,
      user: patientId,     // Assigned to Patient
      doctor: req.user.id, // Assigned by Doctor
      isCompleted: false
    });
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user.id && task.doctor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.doctor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Only the doctor who created this can delete it' });
    }

    await task.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tasks of a specific patient
// @route   GET /api/tasks/patient/:patientId
const getPatientTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.params.patientId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getPatientTasks };