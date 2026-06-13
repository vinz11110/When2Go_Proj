const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController")

router.get("/getTripWeather/:tripId", weatherController.getTripWeather);
module.exports = router;