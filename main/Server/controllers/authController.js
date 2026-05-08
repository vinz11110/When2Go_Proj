const jwt = require('jsonwebtoken');

// 🛑 TEMPORARY FAKE DATABASE 
const fakeUsers = [];

exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Checking if user exists in fakearray
        const userExists = fakeUsers.find(user => user.email === email);
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        //Saving to temporary fake database
        const newUser = { id: Date.now(), email, password };
        fakeUsers.push(newUser);
        
        //Checking in terminal
        console.log("Current Fake Database:", fakeUsers); 

        //Creating fake token
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

        res.status(201).json({ success: true, message: 'User registered successfully', token });
    } catch (error) {
        //Error detection
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = fakeUsers.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({sucess: false, message: 'Invalid credentials'});
        }

        if (user.password !== password) {
            return res.status(400).json({sucess: false, message: 'Invalid credentials'});
        }

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET || 'fallback_secret', {expiresIn: '7d'});
        res.status(200).json({success: true, message: 'Logged in successfully', token});
    }   catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({success: false, message: 'Server error'});
    }
};