// Import dependencies
require('dotenv').config();
const DATABASE_NAME = process.env.DATABASE_NAME || 'postgres';
const DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'postgres';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'docker';
const DATABASE_HOST = process.env.DATABASE_HOST || 'database';

const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const router = express.Router();

var sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
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
    .then(function () {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });



// Define a user type  
const User = sequelize.define('user', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    mobile: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    }
});

(async () => {
    await User.sync({ force: true });
    User.hasOne(Address, {onDelete: 'SET NULL', onUpdate: 'CASCADE' })
})().catch(function (err) {
    console.log('Unable to create table:', err);
});



const Address = sequelize.define('address', {
    userId: {
        foreignKey: true,
        type: DataTypes.INTEGER
    },
    street: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    zip: {
        type: DataTypes.STRING
    }
});

(async () => {
    await Address.sync({ force: true });
    Address.belongsTo(User, {onDelete: 'SET NULL', onUpdate: 'CASCADE' });
})().catch(function (err) {
    console.log('Unable to create table:', err);
});

// GET api listing.
router.get('/', (req, res) => {
    User.findAll().then(users => res.json(users));
});

// Create a user and pass it to the db
router.post('/', function (request, response) {
	return User.create(request.body.user, { include: { association: User.Address, model: Address }}).then(function (User) {  // 
        if (User) {
            response.send(User);
        } else {
            response.status(400).send('Error in insert new record');
        }
    });
});

// GET one user by id
router.get('/:id', (req, res) => {
    const id = req.params.id;
    User.findByPk(id)
        .then(user => {
            res.json(user);
        });
});

// Delete one user by id
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    User.destroy({ where: { id: id } })
        .then(user => {
            res.json(user);
        });
});

module.exports = router;
