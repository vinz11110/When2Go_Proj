const recommendationService = require("../services/recommendationService");
const jwt = require("jsonwebtoken");

    exports.getRecomms = async(req, res) => {
        try {
            const {
                vacationType,
                months,
                token,
                triplength
            } = req.body;

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decodedToken.userId;

            const recommendations = await recommendationService.getRecommendations(months, vacationType, userId, triplength);

            res.json(recommendations)
        } catch(error){
            res.status(500).json({
                success: false,
                message: "Server Error generating Recommendations"
            });
        }
    };
