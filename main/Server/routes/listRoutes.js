const express = require("express");
const router = express.Router();
const listController = require('../controllers/listController.js');
const auth = require("../middleware/authMiddleware");


router.put('/packingList', auth, listController.updateLists);
module.exports = router;