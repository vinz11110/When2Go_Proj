const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("DATA RECEIVED FROM FRONTEND:", req.body);
        //checking if user already exists in Databse
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists"});
        }

        // Creating and saving the new user
        const newUser = new User({
            email,
            password: password
        });
        await newUser.save();

        // Creating JWT
        const token = jwt.sign(
            {
                userId: newUser._id
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d'}
        );

        res.status(201).json({ success: true, message: 'User registered successfully', token});
    }   catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: "Server error during registration"});
    }
};

exports.loginUser = async (req, res) => {
    try {
        console.log("Error in authController")
        const { email, password } = req.body;
        console.log("DATA RECEIVED FROM FRONTEND:", req.body);
        //Finding user in DB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }

        // Comparing password with hashed password in the DB
        const isMatch = user.password === password;
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials'});
        }

        //Creating JWT
        const token = jwt.sign(
            { userId: user._id},
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        );

        res.status(200).json({ success: true, message: 'Logged in successfully', token});
    }   catch (error) {
        console.error("Login Error: ", error);
        res.status(500).json({ success: false, message: 'Server error during login'});
    }
};

