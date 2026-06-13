const mongoose = require('mongoose');

//defining structure of data
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, //email must be provided 
        unique: true    //email must be unique
    },
    password: {
        type: String,
        required: true
    },
    savedPlans: [{
        destination: String,
        imageUrl: String,
        tripLength: Number,
        startDate: Date,
        endDate: Date,
        vacationType: String,
        packingList: [{
            item: String,
            isPacked: {
                type: Boolean,
                default: false
            }
        }],
        dayPlanner: {
            type: Map,
            of: [String], //important for Mongoose so it knows that keys will be array of strings
            default: {}
        },
        score: Number
    }],
}, {
    timestamps: true 
});

//exporting user model so controller can use it
module.exports = mongoose.models.User || mongoose.model('User', userSchema)