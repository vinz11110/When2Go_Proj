const listController = require('../controllers/listController');
const Trip = require('../models/trip')

generatePackingItems = (type) => {

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

async function updateLists(getTripById, updateData) {
    const trip = await Trip.findById(tripId);

    if(!trip){
        throw new Error("Trip not Found")
    };

    if(updateData.packingList){
        trip.packingList = updateData.packingList
    }
    if(updateData.dayPlanner){
        trip.dayPlanner = updateData.dayPlanner
    }

    await trip.save()

    return trip;
}

module.exports = {
    generatePackingItems,
    updateLists
};