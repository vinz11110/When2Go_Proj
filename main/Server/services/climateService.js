function getClimateData(city) {
     const climate = await city.findOne({ city: city});
            if(!climate){
            return res.status(404).json({
                 error: 'Destination not found'
                });
        }
        return climate
}