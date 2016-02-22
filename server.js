var express = require('express');
var passport = require('passport');
var Strategy = require('passport-relayr').Strategy;
var hbs = require('hbs');
var path = require('path');

function requestLogger(httpModule, proto) {
    var original = httpModule.request;
    httpModule.request = function (options, callback) {
        console.log(proto + "://" + options.host + options.path, options);
        return original(options, callback);
    }
}

requestLogger(require('http'), 'http');
requestLogger(require('https'), 'https');

// Configure the relayr strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the relayr API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/login/relayr/return'
    },
    function (accessToken, refreshToken, profile, done) {
        // In this example, the user's relayr profile is supplied as the user
        // record.  In a production-quality application, the relayr profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.

        console.log('accessToken: ' + accessToken);
        console.log('refreshToken: ' + refreshToken);
        console.log('profile: ' + profile);

        return done(null, profile);
    }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});


// Create a new Express application.
var app = express();

app.set('port', process.env.PORT || 3000);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({secret: 'keyboard cat', resave: true, saveUninitialized: true}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.get('/',
    function (req, res) {

        res.render('home', {user: req.user});
    });

app.get('/login',
    function (req, res) {
        res.render('login');
    });

app.get('/login/relayr',
    passport.authenticate('relayr'));

app.get('/login/relayr/return',
    passport.authenticate('relayr', {failureRedirect: '/login'}),
    function (req, res) {
        res.redirect('/');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
        res.render('profile', {user: req.user});
    });

app.listen(app.get('port'), function () {
    console.log('Express started in ' + app.get('env') +
        ' mode on http://localhost:' + app.get('port') +
        '; press Ctrl-C to terminate.');
});