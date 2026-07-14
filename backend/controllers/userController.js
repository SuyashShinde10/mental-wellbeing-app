const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, emergencyContacts } = req.body;

  // Basic presence validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }

  // Password strength check
  if (password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters long');
  }

  const userExists = await User.findOne({ email: email.toLowerCase().trim() });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // SECURITY FIX: Role is ALWAYS forced to 'patient' on self-registration.
  // Only a logged-in admin can create doctor/admin accounts via a separate
  // privileged route. Never trust a client-supplied role value here.
  const role = 'patient';

  // Load Balancing: Find admin with fewest patients
  let assignedAdmin = null;
  const admins = await User.find({ role: 'admin' });
  if (admins.length > 0) {
    assignedAdmin = admins[0]._id;
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
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

// @desc    Get user data (sanitised — no password)
// @route   GET /api/users/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('assignedDoctor', 'name email phone');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
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

// Utility: Generate JWT with a short, sensible expiry
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // SECURITY FIX: 30d expiry is too long for a health app with sensitive PII.
    // Reduced to 7d. Implement refresh tokens for better UX if needed.
    expiresIn: '7d',
  });
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