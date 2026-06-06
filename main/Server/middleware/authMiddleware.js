const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ sucess: false, message: 'No token recognized, connection denied'});
    }

    const  token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        
        req.user = decoded.userId;
        next();
    }   catch (error) {
        res.status(401).json({ sucess: false, message: 'Token is not valid'});
    }
};