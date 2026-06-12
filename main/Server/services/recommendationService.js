const Destination = require("../models/destination");
const weatherService = require("./weatherService");
const listService = require("./listService");
const User = require("../models/User")

function getDaysUntilTrip(startDate) {
    const today = new Date();
    const tripDate = new Date(startDate);

    const difference = tripDate.getTime() - today.getTime();

    const daysUntilTrip = Math.ceil(difference / (1000 * 60 * 60 * 24) );

    return daysUntilTrip;
}

function getBestMonthScore(destination, categories, months){
    let bestScore = -Infinity;
    let BestMonth = null;

    for(const month of months){
        let totalScore = 0;

        for(const category of categories){
            totalScore += climateBasedScore(destination, category, month);
        }
        const score = totalScore / categories.length;

        if(score > bestScore){
            bestScore = score;
            BestMonth = month;
        }
    }



    return {
        score: bestScore,
        month: BestMonth
    };
}

function generateTripDates(month, duration) {
    const currentYear = new Date().getFullYear();

    const monthIndex = [
        "january","february","march","april",
        "may","june","july","august","september",
        "october","november","december"
    ].indexOf(month.toLowerCase());

    const startDate = new Date(currentYear, monthIndex, 1);

    const endDate = new Date(startDate)

    endDate.setDate(endDate.getDate() + duration);

    return {
        startDate,
        endDate
    }
}


function forecastBasedScore(destination, vacationType) {
        const preference = vacationPreferences[vacationType];

    let score = 100;

    score -= Math.abs((destination.avgTemp - preference.idealTemp) * preference.temperatureImpact)            
    score -= Math.abs(destination.rainProbability * preference.rainImpact)
    score -= Math.abs(destination.windSpeed * preference.windImpact)

    return score;
}

function climateBasedScore(destination,category, month) {
    const weather = destination.weather[month.toLowerCase()]
    const preference = vacationPreferences[category];

    let score = 100;

    score -= Math.abs((weather.avg_temp - preference.idealTemp) * preference.temperatureImpact)
    score -= Math.abs(weather.rain_probability * preference.rainImpact)
    score -= Math.abs(weather.avg_wind * preference.windImpact)
    if(weather.rain_probability > preference.maxRainProbability){

    }

    return Math.max(0, score);
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


async function createTrips(recommendations, userId, categories, duration){
    const user = await User.findById(userId)



        const trips = recommendations.map(
            recommendation => {
                const {
                    startDate,
                    endDate
                } = generateTripDates(
                    recommendation.recommendedMonth, duration
                );

                return {
                    destination: recommendation.city,
                    tripLength: duration,
                    startDate,
                    endDate,
                    vacationType: categories[0],
                    packingList:
                        listService.generatePackingItems(categories[0]),
                    dayPlanner: {},
                    score: recommendation.score,
                };
            }
        );
            if(!user){
                throw new Error("User not found");
            }
            user.savedPlans.push(...trips);

            await user.save();

            return user.savedPlans.slice(-trips.length);
        }


async function getRecommendations(months, categories, userId, tripLength) {

    const destinations =
        await Destination.find();

    const matchingDestinations =
        destinations.filter(
            destination =>
                categories.some(
                    category =>
                        destination.categories.includes(
                            category
                        )
                )
        );

    const scored = matchingDestinations.map(
            destination => {
                const best = getBestMonthScore(destination, categories, months);

                return {
                    ...destination.toObject(),
                    score: best.score,
                    recommendedMonth: best.month
                };
            }
    ); 

    scored.sort(
        (a, b) => b.score - a.score
    );

    const top10 = scored.slice(0, 10);

    return await createTrips(
        top10,
        userId,
        categories,
        tripLength
    );
}



module.exports = {
    getDaysUntilTrip,
    calculateDestinationScore,
    getRecommendations
};
