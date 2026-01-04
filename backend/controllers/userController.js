const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, emergencyContacts } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Load Balancing: Find admin with fewest patients (Simplified)
  let assignedAdmin = null;
  if (role === 'patient') {
    const admins = await User.find({ role: 'admin' });
    if (admins.length > 0) {
        assignedAdmin = admins[0]._id; 
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'patient',
    assignedAdmin,
    emergencyContacts: emergencyContacts || []
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emergencyContacts: user.emergencyContacts,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('assignedDoctor', 'name phone');

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      assignedDoctor: user.assignedDoctor,
      emergencyContacts: user.emergencyContacts,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user data
// @route   GET /api/users/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('assignedDoctor');
  res.status(200).json(user);
});

// @desc    Update Emergency Contacts
// @route   PUT /api/users/contacts
const updateContacts = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if(user) {
        user.emergencyContacts = req.body.contacts || user.emergencyContacts;
        const updatedUser = await user.save();
        
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            emergencyContacts: updatedUser.emergencyContacts,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update Doctor Availability
// @route   PUT /api/users/status
const updateStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.isAvailable = req.body.isAvailable;
        await user.save();
        res.json({ isAvailable: user.isAvailable });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Get patients for a specific doctor
const getMyPatients = asyncHandler(async (req, res) => {
    const patients = await User.find({ assignedDoctor: req.user._id });
    res.json(patients);
});

// Utility: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// CRITICAL: Ensure ALL functions are exported here
module.exports = { 
    registerUser, 
    loginUser, 
    getMe, 
    updateContacts,
    updateStatus,
    getMyPatients
};