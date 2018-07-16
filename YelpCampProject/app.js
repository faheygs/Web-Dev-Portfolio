require('dotenv').config();

//create and require necessary libraries need for app
var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    seedDB     = require("./seeds"),
    flash      = require("connect-flash"),
    User       = require("./models/user"),
    Comment    = require("./models/comment");
    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");


//
//SETUP APP
//
//connect to mongoose db we created yelp_camp
mongoose.connect("mongodb://localhost/yelp_camp");
//make it so we don't need to add .ejs when requesting file
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //see the DB

app.locals.moment = require('moment');

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Gavin is going to number one some day",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//acquiring routes
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

//Create connection to server and connect to it
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("You are connected to the YelpCamp Server");
});