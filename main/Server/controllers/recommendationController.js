const recommendationService = require("../services/recommendationService");
const jwt = require("jsonwebtoken");

    exports.getRecomms = async(req, res) => {
        console.log(req.body);
        try {
            const {
                categories,
                months,
                token,
                tripLength
            } = req.body;
            console.log("tripLength:", tripLength);

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decodedToken.userId;
            if(req.body == []){
                
            }
            
            const recommendations = await recommendationService.getRecommendations(months, categories, userId, tripLength);

            res.json(recommendations)
        } catch(error){
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    
