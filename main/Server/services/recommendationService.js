const Destination = require("../models/destination");

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
    const weather = destination.weather[month]
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
        const forecast = await getForecast(destination.name);

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

async function getRecommendations(month, vacationType){
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

    return scored.slice(0,10);
}

module.exports = {
    getDaysUntilTrip,
    calculateDestinationScore,
    getRecommendations
};
