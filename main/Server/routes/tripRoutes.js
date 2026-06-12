const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/authMiddleware');
const Destination = require('../models/destination');

router.get('/all', async (req, res) => {
    try {
        const destination = await Destination.find({});
        res.json(destination);
    }   catch (error) {
        res.status(500).json({ error: 'Failed to retrieve information: ' + error.message});
    }
});

router.post('/save', auth, tripController.saveTrip);

router.get('/:tripId', auth, tripController.getTripById);

router.put('/:tripId/packinglist', auth, tripController.updatePackingList);

router.delete('/:tripId', auth, tripController.deleteTrip);

module.exports = router;
