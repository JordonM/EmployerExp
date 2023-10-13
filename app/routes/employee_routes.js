// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for employees
const Employee = require('../models/employee')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { employee: { title: '', text: 'foo' } } -> { employee: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /employees
router.get('/employees', (req, res, next) => {
	Employee.find()
		.populate('owner')
		.then((employees) => {

			return employees.map((employee) => employee.toObject())
		})
		// respond with status 200 and JSON of the employees
		.then((employees) => res.status(200).json({ employees: employees }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW
// GET /employees/
router.get('/employees/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Employee.findById(req.params.id)
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "employee" JSON
		.then((employee) => res.status(200).json({ employee: employee.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
		
})

// CREATE
// POST /employees
router.post('/employees',  requireToken, (req, res, next) => {
	// set owner of new employee to be current user
	req.body.employee.owner = req.user.id

	Employee.create(req.body.employee)
		// respond to succesful `create` with status 201 and JSON of new "employee"
		.then((employee) => {
			res.status(201).json({ employee: employee.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// UPDATE
// PATCH /employees/
router.patch('/employees/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.employee.owner

	Employee.findById(req.params.id)
		.then(handle404)
		.then((employee) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, employee)

			// pass the result of Mongoose's `.update` to the next `.then`
			return employee.updateOne(req.body.employee)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY
// DELETE 
router.delete('/employees/:id', requireToken, (req, res, next) => {
	Employee.findById(req.params.id)
		.then(handle404)
		.then((employee) => {
			// throw an error if current user doesn't own `employee`
			requireOwnership(req, employee)
			// delete the employee ONLY IF the above didn't throw
			employee.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router
