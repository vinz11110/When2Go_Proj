const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController")

router.get("/trip/:tripId", weatherController.getTripWeather);
module.exports = router;