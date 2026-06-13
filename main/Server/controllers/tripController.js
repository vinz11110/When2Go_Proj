const User = require('../models/user');
const listService = require('../services/listService');
const tripService = require('../services/tripService');

const generatePackingItems = (type) => {

    const baseItems = ["Toothbrush", "Toothpaste", "Phone Charger", "Passport"];
    let specificItems= [];

    
    switch (type.toLowerCase()) {
        case 'beach':
            specificItems = ['Bathing Suit', 'Sunscreen', 'Beach Towel', 'Flip Flops', 'Sunglasses'];
            break;
        case 'citytrip':
            specificItems = ['Walking Shoes', 'Backpack', 'Power Bank', 'Umbrella', 'Water Bottle'];
            break;
        case 'wellness':
            specificItems = ['Robe', 'Slippers', 'Bathing Suit', 'Book'];
            break;
        case 'adventure':
            specificItems = ['Hiking Boots', 'Water Bottle', 'First Aid Kit', 'Flaslight', 'Rain Coat', 'Sunscreen'];
            break;
        default:
            specificItems = ['General Travel Gear'];
    }

    const combinedList = [...baseItems, ...specificItems];

    return combinedList.map(itemName => {
        return { item: itemName, isPacked: false};
    });
};

exports.saveTrip = async (req, res) => {
    try {
        const { tripLength, destination, startDate, endDate, vacationType, dayPlanner } = req.body;

        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found'});
        }

        const generatedList = listService.generatePackingItems(vacationType);
        // attaching list to the newly generated trip
        const newTrip = {
            destination,
            startDate,
            endDate,
            vacationType,
            packingList: generatedList,
            dayPlanner: dayPlanner || {}
        }

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

exports.getTripById = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found'});
        }

        const trip = user.savedPlans.id(tripId);

        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found'});
        }

        res.status(200).json({ success: true, data: trip});
    }   catch (error) {
        console.error('Get trip by ID error: ', error);
        res.status(500).json({ success: false, message: 'Server error trying to retrieve trip'});
    }
};

exports.updatePackingList = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { action, itemName, itemId} = req.body;

        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found'});
        }

        const trip = user.savedPlans.id(tripId);
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found'});        
        }

        if (action === 'add') {
            if (!itemName) {
                return res.status(400).json({ success: false, message: 'Item name is required'});
            }
            trip.packingList.push({ item: itemName, isPacked: false});
        }
        else if (action === 'remove') {
            if (!itemId) {
                return res.status(400).json({ success: false, message: 'Item ID required to remove'});
            }
            trip.packingList = trip.packingList.filter(item => item._id.toString() !== itemId);
        }
        else if (action === 'toggle') {
            if (!itemId) {
                return res.status(400).json({ success: false, message: 'Item ID required to toggle'});
            }
            const itemToToggle = trip.packingList.id(itemId);

            if (itemToToggle) {
                itemToToggle.isPacked = !itemToToggle.isPacked;
            }   else {
                return res.status(404).json({ success: false, message: 'Item not found in packing list'});
            }
        }
        else {
            return res.status(400).json({ success: false, message: 'Invalid action'});
        }

        await user.save();
    
        res.status(200).json({ success: true, message: 'Packing list updated', data: trip.packingList});
    } catch (error) {
        console.error('Update Packing List Error: ', error);
        res.status(500).json({ success: false, message: 'Server updating error list'});
    }
};


exports.deleteTrip = async (req, res) => {
    try {
        const {tripId} = req.params;

        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found'});
        }

        const trip = user.savedPlans.id(tripId);
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found'});
        }

        user.savedPlans.pull(tripId);

        await user.save();

        res.status(200).json({ success: true, message: 'Trip deleted successfully'});
    }   catch (error) {
        console.error('Trip deletion error: ', error);
        res.status(500).json({ success: false, message: 'Server error while deleting trip'});
    }
};
    exports.deleteTrips = async(req, res) => {
        try {
            const { tripIds } = req.body;

            const remainingTrips = await tripService.deleteTrips(req.user.userId, tripIds);
                    res.status(201).json({
            success: true,
            trips: remainingTrips
        });
        } catch(error){
            res.status(500).json({
                success: false,
                message: "Error while only keeping trips to save"
            })
        }


    }
