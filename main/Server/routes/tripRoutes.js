const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, tripController.saveTrip);
router.get('/', auth, tripController.getTrips);

module.exports = router;