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
    console.log("inside getBestMonthScore")
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

    const monthIndexMap = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12
    }
    const monthIndex = monthIndexMap[month];

    const startDate = new Date(currentYear, monthIndex, 1);

    const endDate = new Date(startDate)

    endDate.setDate(endDate.getDate() + duration);

    return {
        startDate,
        endDate
    }
}


function forecastBasedScore(destination, vacationType,) {
        const preference = vacationPreferences[vacationType];

    let score = 100;

    score -= Math.abs((destination.avgTemp - preference.idealTemp) * preference.temperatureImpact)            
    score -= Math.abs(destination.rainProbability * preference.rainImpact)
    score -= Math.abs(destination.windSpeed * preference.windImpact)

    return score;
}

function climateBasedScore(destination,category, month) {
    const monthMap = {
    Jan: "january",
    Feb: "february",
    Mar: "march",
    Apr: "april",
    May: "may",
    Jun: "june",
    Jul: "july",
    Aug: "august",
    Sep: "september",
    Oct: "october",
    Nov: "november",
    Dec: "december"
    };
    const weather = destination.weather[monthMap[month]]
    const preference = vacationPreferences[category];
    if (!weather) {
    console.log(
        "Missing weather data:",
        destination.city,
        month
    );
    return 0;
    }

    let score = 100;

    score -= Math.abs((weather.avg_temp - preference.idealTemp) * preference.temperatureImpact)
    score -= Math.abs(weather.rain_probability * preference.rainImpact)
    score -= Math.abs(weather.avg_wind * preference.windImpact)
    if(weather.rain_probability > preference.maxRainProbability){

    }
    console.log("Month:", month);
    console.log("Weather:", weather);

    return Math.max(0, score);
}



async function calculateDestinationScore(destination, tripDate, month, vacationType) {
    const daysUntilTrip = getDaysUntilTrip(tripDate);

    if (daysUntilTrip <= 10) {
        const forecast = await weatherService.getForecast(destination.name);

        return forecastBasedScore(forecast, vacationType);
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
    console.log("inside createTrips")
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
            user.savedPlans = trips

            await user.save();

            return user.savedPlans;
        }


async function getRecommendations(months, categories, userId, tripLength) {
    console.log("inside getRecommendations")
    console.log(
    "Destination count:",
    await Destination.countDocuments()
);
    const destinations =
        await Destination.find();

    console.log("Categories:", categories);
    console.log("Destinations found:", destinations.length);

    for (const destination of destinations) {
        console.log(
            destination.city,
            destination.categories
        );
    }    
    const matchingDestinations =
        destinations.filter(
            destination =>
                categories.some(
                    category =>
                        destination.categories.some(
                            c => c.toLowerCase() === category.toLowerCase()
                        )
                )
        );
        console.log(
        "Matching destinations:",
        matchingDestinations.length
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

    const top4 = scored.slice(0, 4);
    console.log("top4:", top4);
    return await createTrips(
        top4,
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
