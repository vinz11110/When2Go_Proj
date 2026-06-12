const recommendationService = require("../services/recommendationService");
const jwt = require("jsonwebtoken");

    exports.getRecomms = async(req, res) => {
        try {
            const {
                triplength,
                months,
                vacationType,
                token
            } = req.body;

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            const recommendations = await recommendationService.getRecommendations(months, vacationType, userId, triplength);

            res.json(recommendations)
        } catch(error){
            res.status(500).json({
                succes: false,
                message: "Server Error generating Recommendations"
            });
        }
    };
