const mongoose = require('mongoose');


const TripSchema = new mongoose.Schema({
        destination: {type: String, required: true},
        startDate: {type: Date, required: true},
        endDate: {type: Date, required: true},
        vacationType: {type: String, required: true},
        packingList: {type: [String], default: []},
        dayPlanner: {type: [String], default: []}
})

module.exports = mongoose.model("Trip", TripSchema)