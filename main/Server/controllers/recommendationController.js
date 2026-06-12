const recommendationService = require("../services/recommendationService")

    exports.getRecomms = async(req, res) => {
        try {
            const {
                triplength,
                month,
                vacationType
            } = req.body;
            if(!month || !vacationType || month == null || vacationType == null){
                return res.status(400).json({
                    success: false,
                    message: "Missing vacation Details"
                });
            }
            const recommendations = await recommendationService.getRecommendations(month, vacationType);

            res.json(recommendations)
        } catch(error){
            res.status(500).json({
                succes: false,
                message: "Server Error generating Recommendations"
            });
        }
    };
