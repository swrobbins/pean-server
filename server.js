'use strict';

// Import required libraries.
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('config');
const morgan = require('morgan');
const expressSession = require('express-session');
const serveStatic = require('serve-static');
const helmet = require('helmet');
const http = require('http');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

// Import routes.
const api = require('./routes/api');
const auth = require('./routes/auth')(passport);

// Save environment.
const staticFiles = './public';
const processDirectory = process.cwd();
const indexFile = path.join(processDirectory, staticFiles, 'index.html');
console.log('Server is running in', processDirectory, 'directory.');

// Get configuration information.
const databaseConfig = config.get('database');
const serverConfig = config.get('server');
const securityConfig = config.get('security');
const authorizationIsEnabled = securityConfig.authorization === true;
const authenticationIsEnabled = securityConfig.authentication === true;

// Use application-level middleware for common functionality, including logging and parsing.
const app = express();
// See https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b
app.use(cors());  // TODO: SROBBINS -- May need to limit API to certain hosts?
app.use(morgan('combined'));
app.use(expressSession({secret: '--7Xk!6st*W@3WyF@vR]%obn+Nb}8oNf', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


// Protect server from well-known web vulnerabilties.
// Force browser to use HTTPS for this site for at least next 365 days.
const threeHundredSixtyFiveDaysInSeconds = 31536000;
app.use(helmet({
    hsts: {
        maxAge: threeHundredSixtyFiveDaysInSeconds
    }
}));

// Set up parsing of request body.
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(cookieParser());

// ===== Serve static files =====
app.use(serveStatic(staticFiles));

// ===== Configure routes =====
app.use('/api', api);
app.use('/auth', auth);

// ===== Catch 404s and let Angular router handle request =====
// app.all('*', function (req, res) {
//     console.log('Catch 404 request:', req.url);
//     res.status(200).sendFile(indexFile);
// });

const GITHUB_CLIENT_ID = "0f6e2000b7ecce3203b6";
const GITHUB_CLIENT_SECRET = "67f4110230dc53c68f096e7d9db786e984223687";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});


// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // To keep the example simple, the user's GitHub profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the GitHub account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));

// ===== Start server =====
http.createServer(app).listen(serverConfig.port, function () {
    console.log('Server is listening on port', serverConfig.port);
});

// ===== Error handlers =====

// Development error handler for express application -- will print stacktrace.
// if (app.get('env') === 'development') {
//     app.use(function (err, req, res) {
//         console.error(err);
//         res.status(err.status || 500).json(err);
//     });
// }

// Development error handler for express application -- no stacktraces leaked to user.
// app.use(function (err, req, res) {
//     console.error(err);
//     if (err.stack) {
//         delete err.stack;
//     }
//     res.status(err.status || 500).json(err);
// });


// Shutdown error handler -- logs and shuts down gracefully.
process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    // some other closing procedures go here
    process.exit();
});
