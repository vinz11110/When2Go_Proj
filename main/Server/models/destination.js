const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    country: { type: String, required: true},
    city: { type: String, required: true},
    description: { type: String, required: true},
    categories: [{ type: String, default: "City-Trip"}],
    weather: {
        january: monthylWeatherSchema,
        february: monthylWeatherSchema,
        march: monthylWeatherSchema,
        april: monthylWeatherSchema,
        may: monthylWeatherSchema,
        june: monthylWeatherSchema,
        july: monthylWeatherSchema,
        august: monthylWeatherSchema,
        september: monthylWeatherSchema,
        october: monthylWeatherSchema,
        november: monthylWeatherSchema,
        december: monthylWeatherSchema
    }
});

const monthylWeatherSchema = new mongoose.Schema({
    avg_temp: { type: Number, required: true},
    avg_wind: { type: Number, required: true},
    rain_probability: { type: Number, requireD: true}
})

module.exports = mongoose.model('Destination', destinationSchema);