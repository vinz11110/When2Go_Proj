function getForecast(city){
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

module.exports = (getForecast);