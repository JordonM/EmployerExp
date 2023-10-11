const mongoose = require('mongoose')

const wageSchema = require('./wage')

const employeeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		position: {
			type: String,
			required: true,
		},
		dob: {
			type: Number,
			required: true,
		},
		paid: {
			type: Boolean,
			required: true,
			default: false
		},
		wages: [wageSchema],
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		}
	},
	{
		timestamps: true,
		toObject: {virtuals: true},
		toJSON: {virtuals: true}
	}
)


employeeSchema.virtual('fullTitle').get(function () {
	return `${this.name} the ${this.type}`
})

// this second virtual will tell us if the employee is a baby based on their age
employeeSchema.virtual('isABaby').get(function () {
	if (this.age < 5) {
		return "Yeah, theyre just a baby"
	} else if (this.age >= 5 && this.age < 10) {
		return "Not really a baby, but theyre still a baby"
	} else {
		return "A good old employee(definitely still a baby)"
	}
})

module.exports = mongoose.model('Employee', employeeSchema)
