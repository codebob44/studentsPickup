// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Driver and Student models
var Driver = require("./models/Driver.js");
var Traveler = require("./models/Traveler.js");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Make public a static dir
app.use(express.static("public"));


// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
// Database configuration with mongoose
mongoose.connect("mongodb://localhost/studentsPickup3");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});


//config passport
var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


var flash = require('connect-flash');
app.use(flash());


// Initialize Passport
var initPassport = require('./passport/passport');
initPassport(passport);


var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated()){
        return next();
    }
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}


// Routes
// ======

app.post('/passengerSignup', passport.authenticate('TravelerSignup', {
    successRedirect: '/passengerProfile',
    failureRedirect: '/mainPage',
    failureFlash : true  
}));

// app.get("/home", function(req, res){
//     res.json(req.user);
// })

app.get("/mainPage", function(req,res){
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/passengerProfile", function(req,res){
    res.sendFile(__dirname + "/public/passengerProfile.html");
});

app.get('/home', isAuthenticated, function(req, res){
    console.log(req);
    res.json(req.user);
    //res.render('home', { user: req.user });
});

app.post('/passengerLogin', passport.authenticate('TravelerLogin', {
    successRedirect: '/home',
    failureRedirect: '/mainPage',
    failureFlash : true  
}));


// // This will get the drivers listed
// app.get("/drivers", function(req, res) {
//     // Grab every doc in the Students array
//     Driver.find({}, function(error, doc) {
//         // Log any errors
//         if (error) {
//             console.log(error);
//         }
//         // Or send the doc to the browser as a json object
//         else {
//             res.json(doc);
//         }
//     });
// });

// // This will get the drivers listed
// app.get("/travelers", function(req, res) {
//     // Grab every doc in the Students array
//     Traveler.find({}, function(error, doc) {
//         // Log any errors
//         if (error) {
//             console.log(error);
//         }
//         // Or send the doc to the browser as a json object
//         else {
//             res.json(doc);
//         }
//     });
// });
// app.post("/travelerSignup", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     var newTraveler = new Traveler(req.body);

//     // And save the new note the db
//     newTraveler.save(function(error, doc) {
//         // Log any errors
//         if (error) {
//             console.log(error);
//         }
//         // Otherwise
//         else {
//             res.json(doc);
//             //res.redirect("/pProfile");
//         }
//     });
// });

app.post("/travelerProfile", function(req, res) {
    // Create a new note and pass the req.body to the entry
    var profile = req.body;
    console.log(req.user);
    // for testing purpose, "77 77" must be the name of one of your existed records in database
    Traveler.findOneAndUpdate({ _id: req.user._id }, req.body, function(error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Or send the doc to the browser as a json object
        else {
            res.json(doc);
        }
    });
});

app.post("/pickupRequest", function(req, res) {
    // Create a new note and pass the req.body to the entry
    var pickupRequest = req.body;
    console.log(pickupRequest);
    console.log(req.user);
    // for testing purpose, "77 77" must be the name of one of your existed records in database
    Traveler.findOneAndUpdate({ _id: req.user._id}, pickupRequest, function(error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Or send the doc to the browser as a json object
        else {
            res.json(doc);
        }
    });
});
// // app.get("/pProfile", function(req, res) {
// //     res.sendFile("passengerProfile.html", { root: __dirname + '/public' });
// // });


// app.post("/driverProfile", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     var profile = req.body;
//     console.log(profile);
//     // for testing purpose, "Tony W" must be the name of one of your existed records in database
//     Driver.findOneAndUpdate({ name: "Tony W" }, profile, function(error, doc) {
//         // Log any errors
//         if (error) {
//             console.log(error);
//         }
//         // Or send the doc to the browser as a json object
//         else {
//             res.json(doc);
//         }
//     });
// });

// app.get("/dProfile", function(req, res) {
//     res.sendFile("driverProfile.html", { root: __dirname + '/public' });
// });
// Listen on port 3000

app.listen(3000, function() {
    console.log("App running on port 3000!");
});


// db.col.update({'id':'driver1'},{$set:{'title':'MongoDB'}})
// db.col.update({'id':'driver1'},{$set:driver1Profile})

