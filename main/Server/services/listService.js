

exports.generatePackingItems = (type) => {

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