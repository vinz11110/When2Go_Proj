const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController")
const auth = require('../middleware/authMiddleware')

router.get("/getTripWeather/:tripId", auth, weatherController.getTripWeather);
module.exports = router;