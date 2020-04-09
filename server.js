'use strict';

console.log('Server running in', process.cwd(), 'directory.');

require('rootpath')();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const expressSession = require('express-session');
const helmet = require('helmet');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// Get/set defaults.
require('dotenv').config();
const THREE_HUNDRED_SIXTY_FIVE_DAYS_IN_SECONDS = 31536000;
const BACKEND_PORT = process.env.BACKEND_PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';
const REDIRECT_SIGNIN_URL = `${FRONTEND_URL}/signin`;
const APP_SECRET = process.env.APP_SECRET || 'make-one-up';

// Set up parsing of request body.
const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(cors());  // TODO: SROBBINS -- May need to limit API to certain hosts? (see https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b)
app.use(morgan('dev'));
app.use(expressSession({secret: APP_SECRET, resave: true, saveUninitialized: true}));

// Protect server from well-known web vulnerabilities. Force browser to use HTTPS for this site for at least next 365 days.
app.use(helmet({hsts: {maxAge: THREE_HUNDRED_SIXTY_FIVE_DAYS_IN_SECONDS}}));

// ===== Configure routes =====
app.use('/auth', require('helpers/authentication-service')(app));
app.use(ensureLoggedIn(REDIRECT_SIGNIN_URL)); // User must be authenticated for the following routes.
app.use('/api/users', require('routes/api'));
app.use('/api/accounts', require('routes/accounts/account.controller'));

// ===== Start server =====
const server = app.listen(BACKEND_PORT, function () {
    console.log('Server not listening on port ' + BACKEND_PORT);
});

// Shutdown error handler -- logs and shuts down gracefully.
process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    // some other closing procedures go here
    process.exit();
});
