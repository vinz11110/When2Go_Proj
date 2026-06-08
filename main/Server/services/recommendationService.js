function getDaysUntilTrip(startDate) {
    const today = new Date();
    const tripDate = new Date(startDate);

    const difference = tripDate.getTime() - today.getTime();

    const daysUntilTrip = Math.ceil(difference / (1000 * 60 * 60 * 24) );

    return daysUntilTrip;
}

function forecastBasedScore(forecast) {
    let score = 0;

    score += forecast.avgTemp;
    score -= forecast.rainProbability *0.5;
    score -= forecast.windSpeed;

    return score;
}

function climateBasedScore(destination,month) {
    const climate = destination.monthlyClimate[month];

    let score = 0;

    score += climate.avgTemp
    score -= climate.rainProbability * 0.5;
    score -= climate.windSpeed;

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

module.exports = {
    getDaysUntilTrip,
    calculateDestinationScore
};