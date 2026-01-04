const express = require('express');
const router = express.Router();
const { createAlert, getAlerts } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

// Base route: /api/alerts
router.post('/', protect, createAlert); // POST to trigger SOS
router.get('/', protect, getAlerts);    // GET to view alerts (Admin/Doctor)

module.exports = router;