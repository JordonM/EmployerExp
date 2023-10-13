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


employeeSchema.virtual('fullTitle').get(function () {	return `${this.name} the ${this.type}`
})

module.exports = mongoose.model('Employee', employeeSchema)
