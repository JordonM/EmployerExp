// import dependencies
const mongoose = require('mongoose')



const feedbackSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    }, 

}, { timestamps: true })

module.exports = feedbackSchema