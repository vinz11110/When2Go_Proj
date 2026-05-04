const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registersUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        //Check if user already exists
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({success: false, message: 'User already exists'});
        }

        //Hasing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //creating new user in database
        user = new User({
            email,
            password: hashedPassword
        });
        await user.save();

        //create JWT to keep user looged in
        const payload = {
            userId: user._id
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.status(201).json({
            sucess: true,
            message: 'User registered successfully',
            token: TokenExpiredError
        });

    }   catch (error) {
        console.error("Error in registereUser:", error);
        res.status(500).json({sucess: false, message: 'Server error'});
    }
};


exports.loginUser = async (req, res) => {
    try {
        
    }
}