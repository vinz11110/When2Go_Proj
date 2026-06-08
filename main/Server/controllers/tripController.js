const User = require('../models/user');

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
        const { destination, startDate, endDate, vacanType} = req.body;

        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found'});
        }

        const generatedList = generatePackingItems(vacationType);
        // attaching list to the newly generated trip
        const newTrip = {
            destination,
            startDate,
            endDate,
            vacationType,
            packingList: generatedList
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
