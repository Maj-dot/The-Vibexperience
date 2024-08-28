require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');
const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.set('view engine', 'ejs');

// Morgan for logging HTTP requests
app.use(morgan('dev'));
// Serves static assets to the browser
app.use(express.static('public'));
// Middleware to parse URL-encoded data from forms
// express.urlencoded is what creates req.body
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Require the middleware that adds the user doc to the req & the res.locals objects
const addUserToReqAndLocals = require('./middleware/addUserToReqAndLocals');
// Be sure to mount after the session middleware above
app.use(addUserToReqAndLocals);


// Routes/Controllers
const ensureLoggedIn = require('./middleware/ensureLoggedIn');
const home = require('./controllers/home');
const booking = require('./controllers/booking');
const profile = require('./controllers/profile');
const djs = require('./controllers/djs');
const djDashboard = require('./controllers/djDashboard');
const clientDashboard = require('./controllers/clientDashboard');
const reviews = require('./controllers/reviews');

// '/auth' is a "starts with" path that all paths
// within authCtrl are appended to
app.use('/auth', require('./controllers/auth'));
app.use('/', require('./controllers/home'));
app.use('/djs', require('./controllers/djs'));
app.use('/djDashboard', require('./controllers/djDashboard'));
app.use('/clientDashboard', require('./controllers/clientDashboard'));
app.use('/profile', require('./controllers/profile'));
app.use('/bookings', require('./controllers/booking'));
app.use('/reviews', require('./controllers/reviews'));

// If you wanted to protect ALL routes 
// app.use('/todos', ensureLoggedIn, require('./controllers/todos'));


// GET / (root/landing page)
//app.get('/', async (req, res) => {
  //res.render('home.ejs');
//});




// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";
// An alternative to above
// const port = process.env.PORT || "3000";

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
