const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// POST request to /api/auth/register
router.post('/register', authController.registerUser);

// POST request to /api/auth/login
router.post('/login', authController.loginUser);

//GET request to api/auth/verify
router.get('/verify', auth, (req, res) => {
    res.status(200).json({ success: true, message: 'Valid session'});
})

module.exports = router;