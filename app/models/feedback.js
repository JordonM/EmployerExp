// import dependencies
const mongoose = require('mongoose')

// toy is a subdocument NOT A MODEL
// toy will exist as part of a pet's toys array
// each toy will belong to one pet, that's it
// one to many ( pet -|---< toys )

const feedbackSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    }, 

}, { timestamps: true })

module.exports = feedbackSchema