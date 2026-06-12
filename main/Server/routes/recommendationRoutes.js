const express = require("express");
const router = express.Router();
const recommendationController = require('../controllers/recommendationController.js');

router.post('/getTripRecommendations', recommendationController.getRecomms);
module.exports = router;