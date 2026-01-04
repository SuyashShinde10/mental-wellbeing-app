const User = require('../models/User');
const Appointment = require('../models/Appointment');
const asyncHandler = require('express-async-handler');

// @desc    Get Admin data (Doctors with Stats)
const getAllUsers = asyncHandler(async (req, res) => {
    // 1. Fetch all doctors
    const doctors = await User.find({ role: 'doctor' }).select('-password');

    // 2. Calculate Stats
    const doctorsWithStats = await Promise.all(doctors.map(async (doc) => {
        // Fetch all appointments assigned to this doctor
        const appointments = await Appointment.find({ doctor: doc._id });

        // A. Completed (History)
        const completedSessions = appointments.filter(a => a.status === 'Completed').length;

        // B. Pending/Active (Currently working on)
        const pendingSessions = appointments.filter(a => a.status === 'Confirmed').length;

        // C. Total Sessions (All time load)
        const totalSessions = appointments.length;

        // D. Average Rating
        const ratedAppts = appointments.filter(a => a.rating > 0);
        const totalRating = ratedAppts.reduce((sum, item) => sum + item.rating, 0);
        const avgRating = ratedAppts.length > 0 ? (totalRating / ratedAppts.length).toFixed(1) : 0;

        return {
            ...doc.toObject(),
            completedSessions,
            pendingSessions,
            totalSessions, // <--- New Metric
            averageRating: avgRating,
            reviewCount: ratedAppts.length
        };
    }));
    
    // 3. Fetch patients
    const patients = await User.find({ 
        role: 'patient', 
        assignedAdmin: req.user._id 
    }).select('-password').populate('assignedDoctor', 'name');
    
    res.json({ doctors: doctorsWithStats, patients, users: patients });
});

// @desc    Assign doctor to appointment
const assignDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    const doctorDoc = await User.findById(doctorId);
    if (!doctorDoc) {
        res.status(404); throw new Error('Doctor not found');
    }
    if (doctorDoc.isAvailable === false) {
        res.status(400); throw new Error(`Dr. ${doctorDoc.name} is unavailable.`);
    }

    appointment.doctor = doctorId;
    appointment.status = 'Confirmed';
    appointment.assignedBy = req.user._id; 
    appointment.assignmentDate = new Date(); 

    await appointment.save();

    await User.findByIdAndUpdate(appointment.patient, { 
        assignedAdmin: req.user._id,
        assignedDoctor: doctorId 
    });

    res.json({ message: "Doctor assigned successfully", appointment });
});

module.exports = { getAllUsers, assignDoctor };