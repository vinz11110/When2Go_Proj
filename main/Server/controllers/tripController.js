const User = require('../models/user');

exports.saveTrip = async (req, res) => {
    try {
        const { destination, startDate, endDate, vacanType} = req.body;

        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found'});
        }

        const newTrip = { destination, startDate, endDate, vacationType};
        user.savedPlans.push(newTrip);

        await user.save();

        res.status(201).json({ sucess: true, message: 'Trip saved successfully', data: newTrip });
    }   catch (error) {
        console.error("Saving Trip Error: " + error);
        res.status(500).json({ success: false, message: 'Serer error while saving trip'});
    }
};


exports.getTrips = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found'});
        }
        res.status(200).json({ success: true, data: user.savedPlans});
    }   catch (error) {
        console.error("Get Trips Error: ", error);
        res.status(500).json({ success: false, message: 'Server  error while fetching saved trips'});
    }
};