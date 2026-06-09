const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/authMiddleware');
const Destination = require('../models/destination');

router.post('/', auth, tripController.saveTrip);
router.get('/', auth, tripController.getTrips);

router.get('/all', async (req, res) => {
    try {
        const destination = await Destination.find({});
        res.json(destination);
    }   catch (error) {
        res.status(500).json({ error: 'Failed to retrieve information: ' + error.message});
    }
});

router.get(':/city', async (req, res) => {
    try {
        const destination = await Destination.findOne({ city: req.params.city});
        if (!destination) {
            return res.status(404).json({ error: 'Destination not found'});
        }
        const cityData = await response.json();
        res.json(cityData);
    }   catch (error) {
        res.status(500).json({ error: "Internal server error: " + error.message});
    }
});

module.exports = router;