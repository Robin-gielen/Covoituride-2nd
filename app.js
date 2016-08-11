//Module dependencies
var express = require('express');

var logger = require('express-logger');

//Mongodb dependencies
var MongoClient = require('mongodb')
, assert = require('assert')
, mongoose = require('mongoose')
, url = 'mongodb://localhost:27017/db'
, bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

mongoose.Promise = require('bluebird');

//Import mongoose models
var utilisateur = require('./models/users');
var trajet = require('./models/ride');

//Passport dependencies
var passport = require('passport');
var Strategy = require('passport-local');
var session = require('express-session');
var flash = require('req-flash');
var connectFlash = require('connect-flash');

var app = express()

//Lauching mongodb connection
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('CONNECTED');
});

//Views configuration
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(logger({path: "event.log"}));
app.use(express.static(__dirname + '/public'))

// Configuring Passport
app.use(session({secret: 'supernova',
	saveUninitialized: false,
	resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

// Passport serialization
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// passport/login.js
passport.use('login', new Strategy({
  passReqToCallback : true },
  function(req, username, password, done) {
    utilisateur.find({ username: req.body.username }, function(err, user) {
      //if there's an error with the reading of the db
      if (err)
        return done(err);
      console.log('from db' + user)
      // if no user with that username is Found
      if(user[0] == undefined) {
        console.log('No user with that username found')
        return done(null, false, req.flash('loginMessage','User not found.'));
      }
      //User found but wrong password
      else  if(user[0].toObject().password != req.body.password) {
          console.log('Wrong Password')
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      }
      //Everything is ok - return user connected
      req.session.username = user[0].toObject().username;
      console.log('Everything ok - connected')
      return done(null, user);
    });
  }
));

// passport/signup.js
passport.use('signup', new Strategy({
    passReqToCallback : true },
   function(req, email, password, done) {
       // asynchronous
       // User.findOne wont fire unless data is sent back
       process.nextTick(function() {
       // find a user whose username is the same as the forms username
       // we are checking to see if the user trying to login already exists
       utilisateur.find({ username: req.body.username }, function(err, user) {
           // if there are any errors, return the error
           if (err)
               return done(err);
           // check to see if theres already a user with that username
           if (user[0] != undefined) {
             console.log('That username is already taken.')
               return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
           } else {
               // if there is no user with that username
               // create the user
               var newUser = new utilisateur({
               // set the user's local credentials
               username : req.body.username,
               password : req.body.password,
               firstName : req.body.firstName,
               lastName : req.body.lastName,
               cityOfResidence : req.body.cityOfResidence,
               description : req.body.description,
               });
               // save the user
               newUser.save(function(err) {
                   if (err){
                     console.log('Error in Saving user: '+err);
                     throw err;
                   }
                   console.log('User Created with ' + newUser)
                   return done(null, newUser);
               });
           }
       });
       });
   })
 );

app.get('/aboutCovoituride.html', function (req, res) {
  res.render('aboutCovoituride.pug')
})

app.get('/homeUnlogged.html', function (req, res) {
  res.render('homeUnlogged.pug')
})

app.get('/signup.html', function (req, res) {
  if (req.flash('signupMessage')) {
    res.render('signup.pug', { message: req.flash('signupMessage')})
  }
  else res.render('signup.pug')
})

app.post('/signup.html', passport.authenticate('signup', {
    successRedirect: '/login.html',
    failureRedirect: '/subscribe.html',
    failureFlash: true //allow flash message
  }));

app.get('/login.html', function (req, res) {
  if (req.flash('loginMessage')) {
    res.render('login.pug', { message: req.flash('loginMessage')})
  }
  else res.render('login.pug')
})

app.post('/login.html', passport.authenticate('login', {
    successRedirect: '/homeLogged.html',
    failureRedirect: '/login.html',
    failureFlash: true //allow flash message
  }));

app.get('/home.html', function (req, res){
  if (req.user) {
    res.redirect('/homeLogged.html');
  }
  else {
    res.redirect('homeUnlogged.html');
  }
})

app.use(function (req, res, next) {
    if (req.user) {
        return next();
    } else {
        console.log('Must be logged in to acces this part of the site !');
        res.render('login.pug', {error: 'Please log in to acces this part of the site !'})
    }
});

app.get('/logout.html', function (req, res) {
  req.logout()
  res.render('homeUnlogged.pug')
})

app.get('/homeLogged.html', function (req, res) {
  res.render('homeLogged.pug')
})

app.get('/myProfile.html', function (req, res) {
  res.render('myProfile.pug')
})

app.get('/proposeARide.html', function (req, res) {
  res.render('proposeARide.pug')
})

app.post('/proposeARide.html', function (req, res) {
  var newRide = new trajet({
  // set the user's local credentials
  departure : req.body.departure,
  pickUpPlace : req.body.pickUpPlace,
  midRideTakeOff : req.body.midRideTakeOff,
  arrival : req.body.arrival,
  date : req.body.date,
  carModel : req.body.carModel,
  maxSeats : req.body.maxSeats,
  price : req.body.price,
  stops : req.body.stops,
  driverUsername : req.session.username,
  });
  console.log(newRide);
  // save the user
  newRide.save(function(err, resp) {
    if (err){
      console.log('Error in Saving ride: '+err);
      throw err;
    }
    console.log('Ride Registration succesful');
  });
  res.render('homeLogged.pug')
});

app.get('/proposedRides.html', function (req, res) {
  trajet.find({ driverUsername: req.session.username }, function(err, trajets) {
    if (err)
      res.render('proposedRides.pug');
    if(trajets == undefined) {
      console.log('No rides found for that username')
      res.render('proposedRides.pug')
    }
    console.log('Everything ok - rides found')
    console.log(trajets)
    res.render('proposedRides.pug', {drives: trajets})
  });
})

app.get('/subscribedRides.html', function (req, res) {
  res.render('subscribedRides.pug')
})

app.get('/searchRides.html', function (req, res) {
  res.render('searchRides.pug')
})

app.get('/searchRiders.html', function (req, res) {
  res.render('searchRiders.pug')
})

app.listen(3000)
