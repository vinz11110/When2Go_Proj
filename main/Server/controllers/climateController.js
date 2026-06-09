const climateService = require("../services/climateService")

exports.getClimate = async (req, res) => {
    try {
        const destionation = await climateService.getClimateData(req.params.city)
        
    } catch {
        res.status(500).json({
            message: "Interal Server Error"
        });
    }
}