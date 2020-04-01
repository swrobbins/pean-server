// Import dependencies

const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const router = express.Router();

var sequelize = new Sequelize('postgres', 'postgres', 'docker', {
    host: 'database',
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

//Check the database connection
sequelize
    .authenticate()
    .then(function (err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

// Define a user type  
var User = sequelize.define('user', {
    name: {
        type: DataTypes.STRING
    },
    age: {
        type: DataTypes.SMALLINT
    }
});

// Create empty Users table
User.sync({ force: true }).then(function () {
});

// GET api listing.
router.get('/', (req, res) => {
    res.send('api works');
});

// GET all users.
router.get('/users', (req, res) => {
    User.findAll().then(users => res.json(users));
});


// Create a user and pass it to the db
router.post('/users', function (request, response) {
    return User.create({
        name: request.body.name,
        age: request.body.age
    }).then(function (User) {
        if (User) {
            response.send(User);
        } else {
            response.status(400).send('Error in insert new record');
        }
    });
});

// GET one user by id
router.get('/users/:id', (req, res) => {
    const id = req.params.id;
    User.findByPk(id)
        .then(user => {
            res.json(user);
        });
});

// Delete one user by id
router.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    User.destroy({ where: { id: id } })
        .then(user => {
            res.json(user);
        });
});

module.exports = router;
