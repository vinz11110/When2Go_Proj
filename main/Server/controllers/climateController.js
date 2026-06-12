const climateService = require("../services/climateService")

exports.getClimate = async (req, res) => {
    try {
        const destination = await climateService.getClimateData(req.params.city)
        
        res.status(201).json({
            success: true,
            message: destination
    });
    } catch (error) {
        res.status(500).json({
            error: "Interal Server Error"
        });
    }
}
