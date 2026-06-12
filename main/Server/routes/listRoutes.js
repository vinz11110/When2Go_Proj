const express = require("express");
const router = express.Router();
const listController = require('../controllers/listController.js');


router.put('/:tripId/packinglist', auth, listController.updatePackingList);