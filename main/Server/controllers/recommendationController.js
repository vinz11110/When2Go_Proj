const recommendationService = require("../services/recommendationService")

    exports.getRecomms = async(req, res) => {
        try {
            const {
                triplength,
                month,
                vacationType
            } = req.body;

            const recommendations = await recommendationService.getRecommendations(month, vacationType);

            res.json(recommendations)
        } catch(error){
            res.status(500).json()({
                error: "Failed to get recommendations"
            })
        }
    }
