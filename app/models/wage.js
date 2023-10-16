// import dependencies
const mongoose = require('mongoose')



const wageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    frequency: {
        type: String
    },
    isSqueaky: {
        type: Boolean,
        required: true,
        default: false
    },
    condition: {
        type: String,

        enum: ['new', 'used', 'disgusting'],
        default: 'new'
    }
}, { timestamps: true })

module.exports = wageSchema