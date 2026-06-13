const User = require('../models/User');


async function deleteTrips(userId, tripIds) {
    const user = await User.findById(userId);

    if(!user) {
        throw new Error("User not found");
    }

    user.savedPlans = user.savedPlans.filter(
        trip => 
            !tripIds.includes(trip._id.toString())
    );

    await user.save();

    return user.savedPlans
}