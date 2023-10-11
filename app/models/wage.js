// import dependencies
const mongoose = require('mongoose')

// toy is a subdocument NOT A MODEL
// toy will exist as part of a pet's toys array
// each toy will belong to one pet, that's it
// one to many ( pet -|---< toys )

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
        // here we're going to use enum
        // only specific strings will be allowed for this field
        // enum is a validator on the type String
        // "you can only use one of the strings in this array"
        enum: ['new', 'used', 'disgusting'],
        default: 'new'
    }
}, { timestamps: true })

module.exports = wageSchema