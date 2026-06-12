const Destination = require("../models/destination");
const weatherService = require("./weatherService");
const climateService = require("./climateService");
const listService = require("./listService");
const User = require("../models/User")
const tripService = require("./tripService")

function getDaysUntilTrip(startDate) {
    const today = new Date();
    const tripDate = new Date(startDate);

    const difference = tripDate.getTime() - today.getTime();

    const daysUntilTrip = Math.ceil(difference / (1000 * 60 * 60 * 24) );

    return daysUntilTrip;
}


function forecastBasedScore(destination, vacationType) {
        const preference = vacationPreferences[vacationType];

    let score = 100;

    score -= Math.abs((destination.avgTemp - preference.idealTemp) * preference.temperatureImpact)            
    score -= Math.abs(destination.rainProbability * preference.rainImpact)
    score -= Math.abs(destination.windSpeed * preference.windImpact)

    return score;
}

function climateBasedScore(destination,vacationType, month) {
    const weather = destination.weather[month.toLowerCase()]
    const preference = vacationPreferences[vacationType];

    let score = 100;

    score -= Math.abs((weather.avg_temp - preference.idealTemp) * preference.temperatureImpact)
    score -= Math.abs(weather.rain_probability * preference.rainImpact)
    score -= Math.abs(weather.avg_wind * preference.windImpact)
    if(destination.rainProbability > preference.maxRainProbability){

    }

    return score;
}



async function calculateDestinationScore(destination, tripDate, month, vacationType) {
    const daysUntilTrip = getDaysUntilTrip(tripDate);

    if (daysUntilTrip <= 10) {
        const forecast = await weatherService.getForecast(destination.name);

        return forecastBasedScore(forecast, vacationType, month);
    }

    else return climateBasedScore(destination, vacationType, month);
}

const vacationPreferences = {
    // these values are currently placeholder and to be determined
    beach:      {idealTemp: 30, temperatureImpact: 1, maxRainProbability: 50, rainImpact: 0.15, windImpact: 1},
    city:       {idealTemp: 22, temperatureImpact: 1, maxRainProbability: 50, rainImpact: 0.25, windImpact: 1},
    adventure:  {idealTemp: 18, temperatureImpact: 1, maxRainProbability: 50, rainImpact: 0.25, windImpact: 1},
    wellness:   {idealTemp: 22, temperatureImpact: 1, maxRainProbability: 50, rainImpact: 0.05, windImpact: 1}
};
async function createTrips(recommendations, userId, month, vacationType, duration){
    const user = await User.findById(userId)

        const trips = recommendations.map(
            recommendation => ({
                    destination: recommendation.city,
                    duration,
                    startDate,
                    endDate,
                    vacationType,
                    packingList: listService.generatePackingItems(vacationType),
                    dayPlanner: {},
                    score: recommendation.score
                })
            );

            user.savedPlans.push(...plans);

            await user.save();

            return user.savedPlans;
        }


async function getRecommendations(month, vacationType, userId, duration){
    const destinations = await Destination.find();


    const categoryMatches = destinations.filter(
        d => d.categories.includes(vacationType)
    );

    const scored = categoryMatches.map(
        destination => ({
            ...destination.toObject(),

            score: climateBasedScore(destination,vacationType,month)
            
        })
    );

    scored.sort( 
        (a,b) => b.score - a.score
    );

    const top10 = scored.slice(0,10).map(d => ({
        city: d.city,
        country: d.country,
        description: d.description,
        score: d.score
    }));

    return await createTrips(
        top10,
        userId,
        month,
        vacationType,
        duration
    )
}

function buildTrip(destination, vacationType){
    return {
        destination,
        startDate,
        endDate,
        vacationType,
        packingList:
            listService.generatePackingItems(vacationType),
        dayPlanner: {}
        
    }
}

module.exports = {
    getDaysUntilTrip,
    calculateDestinationScore,
    getRecommendations
};
