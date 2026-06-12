const weatherService = require("../services/weatherService");


exports.getForecast = async(req,res) => {
    try {
        const city = req.params.city;

        const weather = await weatherService.getForecast(city);
        if(!weather)
            return status(404).json({
                Error: "City not Found"
            });

        else{
            res.status(201).json({
                success: true,
                message: weather
        });
        } 
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
