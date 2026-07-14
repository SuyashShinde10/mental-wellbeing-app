const Alert = require('../models/Alert');
const User = require('../models/User');

// Lazy-init Twilio client so missing env vars don’t crash the server on startup
let twilioClient = null;
const getTwilioClient = () => {
  if (!twilioClient) {
    if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.warn('[Alert] Twilio credentials missing — SMS will be skipped');
      return null;
    }
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
};

// @desc    Create SOS Alert & Send SMS to Admin, Doctor, AND Trusted Contacts
// @route   POST /api/alerts
const createAlert = async (req, res) => {
  // SECURITY: Validate and sanitise coordinates — prevent injection
  const rawLat = req.body.latitude;
  const rawLng = req.body.longitude;
  const latitude = rawLat !== undefined ? parseFloat(rawLat) : null;
  const longitude = rawLng !== undefined ? parseFloat(rawLng) : null;

  if (
    (latitude !== null && (isNaN(latitude) || latitude < -90 || latitude > 90)) ||
    (longitude !== null && (isNaN(longitude) || longitude < -180 || longitude > 180))
  ) {
    return res.status(400).json({ message: 'Invalid coordinates' });
  }

  try {
    // 1. Create Alert in DB
    const alert = await Alert.create({
      user: req.user._id,
      location: { latitude, longitude },
      type: 'SOS',
      status: 'Active'
    });

    // 2. Prepare Message
    const mapsLink =
      latitude !== null && longitude !== null
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : 'Location data unavailable';

    const sosMessage = `🚨 SOS ALERT: ${req.user.name} needs help! Location: ${mapsLink}`;

    const client = getTwilioClient();

    if (client) {
      // 3. Send to SYSTEM ADMIN (Always)
      if (process.env.ADMIN_PHONE) {
        await client.messages.create({
          body: sosMessage,
          from: process.env.TWILIO_PHONE,
          to: process.env.ADMIN_PHONE,
        });
      }

      // 4. Send to ASSIGNED DOCTOR (If exists)
      const patientData = await User.findById(req.user._id).populate('assignedDoctor');
      if (patientData?.assignedDoctor?.phone) {
        await client.messages.create({
          body: `👨‍⚕️ Medical Emergency: Your patient ${req.user.name} has triggered an SOS.`,
          from: process.env.TWILIO_PHONE,
          to: patientData.assignedDoctor.phone,
        });
      }

      // 5. Send to TRUSTED CONTACTS
      if (patientData?.emergencyContacts?.length > 0) {
        await Promise.all(
          patientData.emergencyContacts
            .filter(c => c.phone)
            .map(contact =>
              client.messages.create({
                body: `🆘 Emergency Alert: ${req.user.name} has added you as a trusted contact and requires help. Location: ${mapsLink}`,
                from: process.env.TWILIO_PHONE,
                to: contact.phone,
              })
            )
        );
      }
    }

    res.status(201).json(alert);
  } catch (error) {
    console.error('[SOS] Error:', error.message);
    // SECURITY FIX: Return 500 (not 201) on error so the client knows the alert
    // was NOT fully processed. Returning 201 on failure is misleading and
    // could give patients false confidence that help is coming.
    res.status(500).json({
      message: 'SOS recorded, but some notifications may have failed.',
    });
  }
};

const getAlerts = async (req, res) => {
  try {
    // Only admins can see ALL alerts; doctors only see their patients' alerts
    let query = {};
    if (req.user.role === 'doctor') {
      const patients = await User.find({ assignedDoctor: req.user._id }).select('_id');
      query = { user: { $in: patients.map(p => p._id) } };
    } else if (req.user.role !== 'admin') {
      // Patients can only see their own alerts
      query = { user: req.user._id };
    }
    const alerts = await Alert
      .find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAlert, getAlerts };