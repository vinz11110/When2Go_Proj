const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController")

router.get("/:city", weatherController.getForecast);
module.exports = router;