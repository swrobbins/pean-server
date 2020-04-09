module.exports = function (app) {
    const express = require('express');
    const router = express.Router();
    const passport = require('passport');
    const GitHubStrategy = require('passport-github2').Strategy;
    const GoogleStrategy = require('passport-google-oauth20').Strategy;

    // Get/set defaults.
    require('dotenv').config();
    const BACKEND_PORT = process.env.BACKEND_PORT || 4200;
    const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${BACKEND_PORT}`;
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';
    const HOME_URL = `${FRONTEND_URL}/home`;
    const REDIRECT_SIGNIN_URL = `${FRONTEND_URL}/signin`;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    // ===== Google strategy =====
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: `${BACKEND_URL}/auth/google/callback`
        },
        function (accessToken, refreshToken, profile, done) {
            const user = {
                isAuthenticated: true,
                authenticationSource: 'Google',
                profile
            };
            // TODO: SROBBINS -- look up user in accounts table and add or update as appropriate!
            return done(null, user);
        }
    ));

    router.get('/google', passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email']
    }));

    router.get('/google/callback',
        passport.authenticate('google', {
            failureRedirect: `${REDIRECT_SIGNIN_URL}`,
            scope: ['user:email']
        }),
        function (req, res) {
            console.log(`Logged ${req.user.profile.displayName} in from Google`);
            res.redirect(HOME_URL);
        });

    // ===== GitHub strategy =====
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
    passport.use(new GitHubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: `${BACKEND_URL}/auth/github/callback`
        },
        function (accessToken, refreshToken, profile, done) {
            const user = {
                isAuthenticated: true,
                authenticationSource: 'GitHub',
                profile
            };
            // TODO: SROBBINS -- look up user in accounts table and add or update as appropriate!
            return done(null, user);
        }
    ));

    router.get('/github', passport.authenticate('github', {scope: ['user:email']}));

    router.get('/github/callback',
        passport.authenticate('github', {
            failureRedirect: `${REDIRECT_SIGNIN_URL}`,
            scope: ['user:email']
        }),
        function (req, res) {
            console.log(`Logged ${req.user.profile.displayName} in from GitHub`);
            res.redirect(HOME_URL);
        });

    router.get('/isAuthenticated', (req, res) => {
        const profile = req.user ? req.user : {isAuthenticated: false};
        res.status(200).send(profile);
    });

    router.get('/signout', function (req, res) {
        const authenticated = req.isAuthenticated && req.isAuthenticated();
        const user = req.user && req.user.profile && req.user.profile.displayName || 'some unknown user';
        req.logout();
        console.log(`Signed out ${user} who was ${authenticated ? '' : 'not '}authenticated.`);
        res.status(200).send(JSON.stringify(`Signed out ${user}`));
    });

    return router;
};
