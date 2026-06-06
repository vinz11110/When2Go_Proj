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
        startDate: Date,
        endDate: Date,
        vacationType: String
    }],
}, {
    timestamps: true 
});

//exporting user model so controller can use it
module.exports = mongoose.model('User', userSchema)