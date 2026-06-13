const weatherService = require("../services/weatherService");
const User = require('../models/User')


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
                message: "weather Forecast returned Successfully",
                data: weather
        });
        } 
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

exports.getTripWeather = async (req, res) => {
    try {
        const weather = await weatherService.getTripWeather(req.user, req.params.tripId);
        res.status(200).json({
            success: true,
            message: "Trip weather returned Successfully",
            data: weather
    });
    }   catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
}
} 
