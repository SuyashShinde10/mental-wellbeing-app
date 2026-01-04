const Alert = require('../models/Alert');
const User = require('../models/User');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// @desc    Create SOS Alert & Send SMS to Admin, Doctor, AND Trusted Contacts
// @route   POST /api/alerts
const createAlert = async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    // 1. Create Alert in DB
    const alert = await Alert.create({
      user: req.user._id,
      location: { latitude, longitude },
      type: 'SOS',
      status: 'Active'
    });

    // 2. Prepare Message
    const mapsLink = latitude && longitude 
      ? `https://www.google.com/maps?q=${latitude},${longitude}` 
      : 'Location data unavailable';
    
    const sosMessage = `🚨 SOS ALERT: ${req.user.name} needs help! Location: ${mapsLink}`;

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

    // 5. NEW: Send to TRUSTED CONTACTS
    if (patientData.emergencyContacts && patientData.emergencyContacts.length > 0) {
        // Use Promise.all to send multiple SMS in parallel
        await Promise.all(patientData.emergencyContacts.map(contact => {
            if (contact.phone) {
                return client.messages.create({
                    body: `🆘 Emergency Alert: ${req.user.name} has added you as a trusted contact and requires help. Location: ${mapsLink}`,
                    from: process.env.TWILIO_PHONE,
                    to: contact.phone
                });
            }
        }));
    }

    res.status(201).json(alert);
  } catch (error) {
    console.error('SOS Logic Error:', error.message);
    res.status(201).json({ 
        message: 'SOS recorded, but some SMS notifications may have failed.', 
        alert: req.body 
    });
  }
};

const getAlerts = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'doctor') {
      const patients = await User.find({ assignedDoctor: req.user._id }).select('_id');
      query = { user: { $in: patients.map(p => p._id) } };
    } 
    const alerts = await Alert.find(query).populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAlert, getAlerts };