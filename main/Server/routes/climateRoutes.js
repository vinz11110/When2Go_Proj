const express = require("express");
const router = express.Router();
const climateController = require('../controllers/climateController.js');

router.get("/:city", climateController.getClimate);
module.exports = router;