const Appointment = require('../models/Appointment');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// ... [Keep existing assignDoctor, getAllAppointments, completeAppointment, createAppointment] ...
// (I will include them in the full export below, ensuring no code is lost)

const assignDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) { res.status(404); throw new Error('Appointment not found'); }
    
    // Safety Check
    const doctorDoc = await User.findById(doctorId);
    if (doctorDoc && doctorDoc.isAvailable === false) {
        res.status(400); throw new Error('Selected doctor is currently unavailable.');
    }

    appointment.doctor = doctorId;
    appointment.status = 'Confirmed';
    appointment.assignedBy = req.user._id; 
    appointment.assignmentDate = new Date(); 
    await appointment.save();

    await User.findByIdAndUpdate(appointment.patient, { assignedAdmin: req.user._id, assignedDoctor: doctorId });
    res.json({ message: "Doctor assigned successfully", appointment });
});

const getAllAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({
        $or: [{ status: 'Pending' }, { assignedBy: req.user._id }, { doctor: req.user._id }]
    })
    .populate('patient', 'name email phone')
    .populate('doctor', 'name')
    .populate('assignedBy', 'name');
    res.json(appointments);
});

const completeAppointment = asyncHandler(async (req, res) => {
    const { medicalNotes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) { res.status(404); throw new Error('Appointment not found'); }
    appointment.status = 'Completed';
    appointment.medicalNotes = medicalNotes;
    await appointment.save();
    res.json({ message: 'Appointment completed', appointment });
});

const createAppointment = asyncHandler(async (req, res) => {
    const { appointmentDate, reason } = req.body;
    const appointment = await Appointment.create({
        patient: req.user._id,
        appointmentDate,
        reason,
        status: 'Pending' 
    });
    res.status(201).json(appointment);
});

const getMyAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({ patient: req.user._id })
        .populate('doctor', 'name email phone') 
        .populate('assignedBy', 'name');
    res.json(appointments);
});

const cancelAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);
    if (appointment) { await appointment.deleteOne(); res.json({ message: 'Appointment removed' }); } 
    else { res.status(404); throw new Error('Appointment not found'); }
});

// NEW: Add Feedback & Rating
const addFeedback = asyncHandler(async (req, res) => {
    const { rating, feedback } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    // Ensure only the patient who owns the appointment can review it
    if (appointment.patient.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to review this appointment');
    }

    if (appointment.status !== 'Completed') {
        res.status(400);
        throw new Error('You can only rate completed sessions');
    }

    appointment.rating = rating;
    appointment.feedback = feedback;
    await appointment.save();

    res.json({ message: 'Review submitted successfully', appointment });
});

module.exports = { 
    assignDoctor, 
    completeAppointment, 
    createAppointment, 
    getAllAppointments, 
    getMyAppointments, 
    cancelAppointment,
    addFeedback // Export the new function
};