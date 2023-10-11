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

// Create a wage
// POST -> Create a wage and give that wage to a employee
// POST /wages/:employeeId
// we'll make it so that ANYBODY can give a employee a wage
// which means we wont requireToken
// our wageSchema has some non-required fields
// so we'll use removeBlanks
router.post('/wages/:employeeId', removeBlanks, (req, res, next) => {
    // save the wage from req.body to a variable
    const wage = req.body.wage
    // isolate the employee id for ease of use
    const employeeId = req.params.employeeId
    // find the employee
    Employee.findById(employeeId)
        // make sure we have a employee
        .then(handle404)
        // push the new wage into the employee's array
        // save the employee
        .then(employee => {
            employee.wages.push(wage)
            
            return employee.save()
        })
        // send our info after the employee has been updated
        // .json({ nameOfObject: value })
        .then(employee => res.status(201).json({ employee: employee }))
        // handle any errors
        .catch(next)
})

// ONLY the owner of a employee can update or delete a employee wage
// PATCH -> Update a wage
// PATCH /wages/:employeeId/:wageId
router.patch('/wages/:employeeId/:wageId', requireToken, removeBlanks, (req, res, next) => {
    // save both ids to variable to easily use later
    const employeeId = req.params.employeeId
    const wageId = req.params.wageId

    // find our employee
    Employee.findById(employeeId)
        .then(handle404)
        .then(employee => {
            // single out the wage
            const theWage = employee.wages.id(wageId)
            // make sure the user is the employee's owner
            requireOwnership(req, employee)
            // update the wage with req.body.wage
            theWage.set(req.body.wage)

            // return the saved employee
            return employee.save()
        })
        // send a status
        .then(() => res.sendStatus(204))
        .catch(next)
})

// Delete a wage

// ONLY the owner of a employee can update or delete a employee wage
// DELETE -> delete a wage
// DELETE /wages/:employeeId/:wageId
router.delete('/wages/:employeeId/:wageId', requireToken, removeBlanks, (req, res, next) => {
    // save both ids to variable to easily use later
    const employeeId = req.params.employeeId
    const wageId = req.params.wageId

    // find our employee
    Employee.findById(employeeId)
        .then(handle404)
        .then(employee => {
            // single out the wage
            const theWage = employee.wages.id(wageId)
            // make sure the user is the employee's owner
            requireOwnership(req, employee)
            // delete the wage from the employee
            theWage.deleteOne()

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