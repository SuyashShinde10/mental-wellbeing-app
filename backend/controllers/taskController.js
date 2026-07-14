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

    if (
      task.user.toString() !== req.user.id &&
      task.doctor.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    // SECURITY FIX: Only allow updating safe, whitelisted fields.
    // Passing the whole req.body to findByIdAndUpdate is a mass-assignment
    // vulnerability — an attacker could overwrite user, doctor, or inject
    // MongoDB operators.
    const allowedUpdates = {};
    if (req.body.isCompleted !== undefined) {
      allowedUpdates.isCompleted = Boolean(req.body.isCompleted);
    }
    if (req.body.text !== undefined) {
      allowedUpdates.text = String(req.body.text).slice(0, 500); // max 500 chars
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
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

// @desc    Get tasks of a specific patient (doctor or patient only)
// @route   GET /api/tasks/patient/:patientId
const getPatientTasks = async (req, res) => {
  try {
    // SECURITY FIX: Verify the caller is authorised to view this patient's tasks.
    // A doctor can only view tasks they assigned; a patient can only view their own.
    const { patientId } = req.params;

    const isPatient = req.user.id === patientId;
    const isDoctor = req.user.role === 'doctor';

    if (!isPatient && !isDoctor) {
      return res.status(403).json({ message: 'Not authorized to view these tasks' });
    }

    const query = { user: patientId };
    // Doctors only see tasks THEY assigned
    if (isDoctor && !isPatient) {
      query.doctor = req.user.id;
    }

    const tasks = await Task.find(query);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getPatientTasks };