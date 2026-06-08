const express = require("express");
const router = express.Router();

router.get("/:city", async(req, res) => {
    try {
        const city = req.params.city;

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
        );

        const data = await response.json();

        res.json(data)
    } catch (err) {
        res.status(500).json({
            error: "Failed to fetch Weather"
        });
    }
})
module.exports = router;