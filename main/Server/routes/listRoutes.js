const express = require("express");
const router = express.Router();
const listController = require('../controllers/listController.js');


router.put('/packingList', auth, listController.updatePackingList);
module.exports = router;