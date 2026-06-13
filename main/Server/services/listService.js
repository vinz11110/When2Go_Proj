const User = require('../models/User')

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

async function updateLists(userId, tripId, updateData) {
    const user = await User.findById(userId)

    const trip = user.savedPlans.id(tripId)
    console.log("trip.dayPlanner Before:", updateData.dayPlanner);
    if(!trip){
        throw new Error("Trip not Found")
    };

    if(updateData.packingList){
        trip.packingList = updateData.packingList
    }
    trip.dayPlanner.clear();
    for(const [key, value] of Object.entries(updateData.dayPlanner)) {
        trip.dayPlanner.set(key, value);
    }
    console.log("trip.dayPlanner After:", trip.dayPlanner)

    user.markModified("savedPlans")

    await user.save()

    return trip;
}

module.exports = {
    generatePackingItems,
    updateLists
};