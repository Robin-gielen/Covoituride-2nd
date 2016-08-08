//Module dependencies
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var logger = require('express-logger');

//Mongodb dependencies
var MongoClient = require('mongodb').MongoClient
, assert = require('assert')
, mongoose = require('mongoose');

//Import mongoose models
var utilisateur = require('./models/users');

//Passport dependencies
var passport = require('passport');
var Strategy = require('passport-local');
var expressSession = require('express-session');
var flash = require('req-flash');

var app = express()

mongoose.connect('mongodb://localhost/db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('CONNECTED');
});

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(logger({path: "event.log"}));

app.use(express.static(__dirname + '/public'))

// Configuring Passport
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// passport/login.js
passport.use('login', new Strategy({
  passReqToCallback : true },
  function(req, username, password, done) {
  // check in mongo if a user with username exists or not
  utilisateur.findOne({ 'username' :  username },
  function(err, user) {
    // In case of any error, return using the done method
    if (err)
    return done(err);
    // Username does not exist, log error & redirect back
    if (!user){
      console.log('User Not Found with username '+username);
      return done(null, false,
        req.flash('message', 'User Not found.'));
      }
      // User exists but wrong password, log the error
      if (!isValidPassword(user, password)){
        console.log('Invalid Password');
        return done(null, false,
          req.flash('message', 'Invalid Password'));
        }
        // User and password both match, return user from
        // done method which will be treated like success
        return done(null, user);
      }
    );
  }));

// passport/signup.js
passport.use('signup', new Strategy({
    passReqToCallback : true },
  function(req, username, password, done) {
    console.log('dedans de la fonction');
    findOrCreateUser = function(){
      // find a user in Mongo with provided username
      utilisateur.find({'username':username},function(err, user) {
        // In case of any error return
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false,
            req.flash('message','User Already Exists'));
          } else {
            // if there is no user with that email
            // create the user
            var newUser = new User();
            // set the user's local credentials
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.firstName = req.param('firstName');
            newUser.lastName = req.param('lastName');
            newUser.cityOfResidence = req.param('cityOfResidence');
            newUser.description = req.param('description');

            // save the user
              newUser.save(function(err) {
                if (err){
                  console.log('Error in Saving user: '+err);
                  throw err;
                }
                console.log('User Registration succesful');
                return done(null, newUser);
              });
          }
        });
      };
      // Delay the execution of findOrCreateUser and execute
      // the method in the next tick of the event loop
      process.nextTick(findOrCreateUser);
    }
  ));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  utilisateur.findById(id, function(err, user) {
    done(err, user);
  });
});




app.post('/signup.html', function (req, res, next) {
  passport.authenticate('signup', {
    successRedirect: '/homeLogged.html',
    failureRedirect: '/homeUnlogged.html'
  }) (req, res, next); // appelle de la fonction retournée par passport.authenticate('signup' (req, res, next))
});

app.get('/aboutCovoituride.html', function (req, res) {
  res.render('aboutCovoituride.pug')
})
app.get('/homeLogged.html', function (req, res) {
  res.render('homeLogged.pug')
})
app.get('/homeUnlogged.html', function (req, res) {
  res.render('homeUnlogged.pug')
})
app.get('/login.html', function (req, res) {
  res.render('login.pug')
})
app.get('/logout.html', function (req, res) {
  res.render('logout.pug')
})
app.get('/myProfile.html', function (req, res) {
  res.render('myProfile.pug')
})
app.get('/proposeARide.html', function (req, res) {
  res.render('proposeARide.pug')
})
app.get('/proposedRides.html', function (req, res) {
  res.render('proposedRides.pug')
})
app.get('/searchRiders.html', function (req, res) {
  res.render('searchRiders.pug')
})
app.get('/searchRides.html', function (req, res) {
  res.render('searchRides.pug')
})
app.get('/signup.html', function (req, res) {
  res.render('signup.pug')
})
app.get('/subscribedRides.html', function (req, res) {
  res.render('subscribedRides.pug')
})


app.listen(3000)
