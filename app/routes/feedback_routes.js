const express = require('express')
const passport = require('passport')

// pull in Mongoose model for employees
const Employee = require('../models/employee')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

//////////////////////////////////////////////////
// routes go here

// Create a feedback
// POST -> Create a feedback and give that feedback to a employee
// POST /feedbacks/:employeeId
// we'll make it so that ANYBODY can give a employee a feedback
// which means we wont requireToken
// our feedbackSchema has some non-required fields
// so we'll use removeBlanks
router.post('/feedbacks/:employeeId', removeBlanks, (req, res, next) => {
    // save the feedback from req.body to a variable
    const feedback = req.body.feedback
    // isolate the employee id for ease of use
    const employeeId = req.params.employeeId
    // find the employee
    Employee.findById(employeeId)
        // make sure we have a employee
        .then(handle404)
        // push the new feedback into the employee's array
        // save the employee
        .then(employee => {
            employee.feedbacks.push(feedback)
            
            return employee.save()
        })
        // send our info after the employee has been updated
        // .json({ nameOfObject: value })
        .then(employee => res.status(201).json({ employee: employee }))
        // handle any errors
        .catch(next)
})

// ONLY the owner of a employee can update or delete a employee feedback
// PATCH -> Update a feedback
// PATCH /feedbacks/:employeeId/:feedbackId
router.patch('/feedbacks/:employeeId/:feedbackId', requireToken, removeBlanks, (req, res, next) => {
    // save both ids to variable to easily use later
    const employeeId = req.params.employeeId
    const feedbackId = req.params.feedbackId

    // find our employee
    Employee.findById(employeeId)
        .then(handle404)
        .then(employee => {
            // single out the feedback
            const theFeedback = employee.feedbacks.id(feedbackId)
            // make sure the user is the employee's owner
            requireOwnership(req, employee)
            // update the feedback with req.body.feedback
            theFeedback.set(req.body.feedback)

            // return the saved employee
            return employee.save()
        })
        // send a status
        .then(() => res.sendStatus(204))
        .catch(next)
})

// Delete a feedback

// ONLY the owner of a employee can update or delete a employee feedback
// DELETE -> delete a feedback
// DELETE /feedbacks/:employeeId/:feedbackId
router.delete('/feedbacks/:employeeId/:feedbackId', requireToken, removeBlanks, (req, res, next) => {
    // save both ids to variable to easily use later
    const employeeId = req.params.employeeId
    const feedbackId = req.params.feedbackId

    // find our employee
    Employee.findById(employeeId)
        .then(handle404)
        .then(employee => {
            // single out the feedback
            const theFeedback = employee.feedbacks.id(feedbackId)
            // make sure the user is the employee's owner
            requireOwnership(req, employee)
            // delete the feedback from the employee
            theFeedback.deleteOne()

            // return the saved employee
            return employee.save()
        })
        // send a status
        .then(() => res.sendStatus(204))
        .catch(next)
})


// End of routes
//////////////////////////////////////////////////

// export router
module.exports = router