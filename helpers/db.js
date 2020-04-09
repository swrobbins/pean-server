require('rootpath')();
const Sequelize = require('sequelize');
const AccountAttributes = require('routes/accounts/account.model');

// Get/set defaults.
require('dotenv').config();
const DATABASE_NAME = process.env.DATABASE_NAME || 'postgres';
const DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'postgres';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_HOST = process.env.DATABASE_HOST || 'database';

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

// Check the database connection
sequelize.authenticate()
    .then(function () {
        console.log('Database connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

const AccountModel = sequelize.define('account', AccountAttributes);

// Create empty accounts table
AccountModel.sync({ force: true }).then(async function () {
});

module.exports = AccountModel;
