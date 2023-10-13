const mongoose = require('mongoose')
const Employee = require('./employee')
const db = require('../../config/db')

const startEmployees = [
    { name: 'John', position: 'Manage', dob: 2, paid: true},

]



mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        Employee.deleteMany({ owner: null })
            .then(deletedEmployees => {
                console.log('the deleted employees: \n', deletedEmployees)

                employee.create(startEmployees)
                    .then(newEmployees => {
                        console.log('new employees added to db: \n', newEmployees)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log('an error occurred: \n', error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log('an error occurred: \n', error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log('an error occurred: \n', error)
        mongoose.connection.close()
    })