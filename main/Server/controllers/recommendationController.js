const Destination = require('../models/destination');
const recommendationService = require('../services/recommendationService');

exports.getRecommendation = async (req, res) => {
    try {
        const { startDate, days, vacationType } = req.body;

        if (!startDate || !day || !vacationType) {
            return res.status(400).json({ success: false, message: 'Missing vacation details'});
        }

        const allDestinations = await Destination.find({});

        //implement after fixed service
    }   catch (error) {
        console.error("Recommendation Error: ", error);
        res.status(500).json({ success: false, message: 'Server error generating recommendations'});
    }
};