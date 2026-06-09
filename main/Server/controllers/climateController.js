const climateService = require("../services/climateService")

exports.getClimate = async (req, res) => {
    try {
        const destination = await Destination.findOne({ city: req.params.city});
        if(!destination){
            return res.status(404).json({
                 error: 'Destination not found'
                });
        }
        return destination
        
    } catch {
        res.status(500).json({
            message: "Interal Server Error"
        });
    }
}