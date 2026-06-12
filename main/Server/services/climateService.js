const Destination = require("../models/destination")

async function getClimateData(cityName, month){
        const climate = await Destination.findOne({
                city: cityName
        });
        if(!climate){
                throw new Error("Destination not found")
        }

        return climate.weather[month.toLowerCase()];
}

module.exports = {
        getClimateData
};