//const Trip = require("../models/trip");
const Destination = require("../models/destination")
const recommendationService = require("./recommendationService")
const climateService = require("./climateService")
const User = require("../models/User")

async function getForecast (city){
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    const data = await response.json();

    const avgTemp = data.list.reduce(
        (sum, item) => sum + item.main.temp, 0
    ) / data.list.length;

    const rainProbability = data.list.reduce(
        (sum, item) => sum+item.pop, 0
    ) / data.list.length * 100;

    const windSpeed = data.list.reduce(
        (sum, item) => sum + item.wind.speed, 0
    ) / data.list.length;


    return { avgTemp, rainProbability, windSpeed};
}

async function getTripWeather(userId, tripId){
    const user = await User.findById(userId)
    const trip = await User.savedPlans.findById(tripId);

    if(!trip){
        throw new Error("Trip not found");
    }
    const month = trip.startDate.toLocaleString("en-US", {month: "long"});

    const daysUntilTrip = recommendationService.getDaysUntilTrip(trip.startDate);

    if(daysUntilTrip <= 10){
        return await getForecast(trip.destination)
    } else {
        return await climateService.getClimateData(trip.destination, month)
    }
    
}

module.exports = {
    getForecast,
    getTripWeather
};