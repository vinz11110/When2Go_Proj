const express = require("express");
const router = express.Router();
const recommendationController = require('../controllers/recommendationController.js');
const auth = require('../middleware/authMiddleware');


router.post('/getTripRecommendations', auth, recommendationController.getRecomms);
module.exports = router;