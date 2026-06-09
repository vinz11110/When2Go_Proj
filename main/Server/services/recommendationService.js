function getDaysUntilTrip(startDate) {
    const today = new Date();
    const tripDate = new Date(startDate);

    const difference = tripDate.getTime() - today.getTime();

    const daysUntilTrip = Math.ceil(difference / (1000 * 60 * 60 * 24) );

    return daysUntilTrip;
}

function forecastBasedScore(destination) {
        const preference = vacationPreferences[vacationType];

    let score = 100;

    score -= Math.abs((destination.avgTemp - preference.idealTemp) * temperatureImpact)            
    score -= Math.abs(destination.rainProbability * vacationPreferences.rainImpact)
    score -= Math.abs(destination.windSpeed = vacationPreferences.windImpact)

    return score;
    let score = 100;
    return score;
}

function climateBasedScore(destination,vacationType) {
    const preference = vacationPreferences[vacationType];

    let score = 100;

    score -= Math.abs((destination.temperature - preference.idealTemp) * temperatureImpact)            
    score -= Math.abs(destination.rainProbability * vacationPreferences.rainImpact)
    score -= Math.abs(destination.windSpeed = vacationPreferences.windImpact)
    if(destination.rainProbability > vacationPreferences.maxRainProbability){

    }

    return score;
}



async function calculateDestinationScore( destination, tripDate, month) {
    const daysUntilTrip = getDaysUntilTrip(tripDate);

    if (daysUntilTrip <= 10) {
        const forecast = await getForecast(destination.name);

        return forecastBasedScore(forecast);
    }

    else return climateBasedScore(destination, month);
}

const vacationPreferences = {
    // these values are currently placeholder and to be determined
    beach:      {idealTemp: 30, temperatureImpact: 1, maxRainProbability: 50, rainImpact: 0.15, windImpact: 1},
    city:       {idealTemp: 22, temperatureImpact: 1, maxRainProbability: 50, rainImpact: 0.25, windImpact: 1},
    adventure:  {idealTemp: 18, temperatureImpact: 1, maxRainProbability: 50, rainImpact: 0.25, windImpact: 1},
    wellness:   {idealTemp: 22, temperatureImpact: 1, maxRainProbability: 50, rainImpact: 0.05, windImpact: 1}
};

module.exports = {
    getDaysUntilTrip,
    calculateDestinationScore
};
