const User = require("../models/user")
const listService = require("../services/listService")


exports.updateLists = async (req, res) => {
    try {
        console.log(listService);
        const updatedTrip = await listService.updateLists(req.user, req.body.tripId, req.body);
        
        res.status(200).json({
            success: true,
            message: "",
            data: updatedTrip
        });
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
}