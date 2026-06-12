const User = require("../models/User")
const listService = require("../services/listService")

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