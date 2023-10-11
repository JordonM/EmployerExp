const mongoose = require('mongoose')
const Employee = require('./employee')
const db = require('../../config/db')

const startEmployees = [
    { name: 'Sparky', type: 'dog', age: 2, adoptable: true},
    { name: 'Leroy', type: 'dog', age: 10, adoptable: true},
    { name: 'Biscuits', type: 'cat', age: 3, adoptable: true},
    { name: 'Hulk Hogan', type: 'hamster', age: 1, adoptable: true}
]

// first connect to the db
// then remove all employees without owners
// then insert the startemployees
// then ALWAYS close the connection from this file

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