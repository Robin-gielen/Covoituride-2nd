//Module dependencies
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var logger = require('express-logger');

//Mongodb dependencies
var MongoClient = require('mongodb')
, assert = require('assert')
, mongoose = require('mongoose')
, url = 'mongodb://localhost:27017/db'
, bodyParser = require('body-parser');
mongoose.Promise = require('bluebird');
//Import mongoose models
var utilisateur = require('./models/users');

//Passport dependencies
var passport = require('passport');
var Strategy = require('passport-local');
var session = require('express-session');
var flash = require('req-flash');

var app = express()

//Lauching mongodb connection
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('CONNECTED');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser());

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(logger({path: "event.log"}));

app.use(express.static(__dirname + '/public'))

// Configuring Passport
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
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
/*passport.authenticate('signup', {
  successRedirect: '/homeLogged.html',
  failureRedirect: '/homeUnlogged.html'
  }) (req, res, next); // appelle de la fonction retournée par passport.authenticate('signup' (req, res, next))*/
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
            var newUser = new utilisateur();
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


app.get('/aboutCovoituride.html', function (req, res) {
  res.render('aboutCovoituride.pug')
})

app.get('/homeUnlogged.html', function (req, res) {
  res.render('home.pug', { logged_in: false})
})

app.get('/signup.html', function (req, res) {
  res.render('signup.pug')
})


app.post('/signup.html', function (req, res, next) {
  console.log('In signup function');
  utilisateur.find({ username: req.body.username }, function(err, user) {
    if (err) throw err;
    if (user[0] != undefined) {
      if (user[0].toObject().username == req.body.username) {
        console.log('Username already exists in database')
        res.render('signup.pug')
      }
      else {}
    }
    else {
      var newUser = new utilisateur({
      // set the user's local credentials
      username : req.body.username,
      password : req.body.password,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      cityOfResidence : req.body.cityOfResidence,
      description : req.body.description,
      });
      console.log(newUser.username);
      // save the user
      newUser.save(function(err, resp) {
        if (err){
          console.log('Error in Saving user: '+err);
          throw err;
        }
        console.log('User Registration succesful');
      });
      res.render('home.pug', { logged_in: false})
    }
  })
});

app.get('/login.html', function (req, res) {
  res.render('login.pug')
})

app.post('/login.html', function (req, res, next) {
  utilisateur.find({ username: req.body.username }, function(err, user) {
    if (err) throw err;
    console.log('from db' + user);
    if (user[0] != undefined) {
      if (user[0].toObject().password == req.body.password) {
        console.log('Credentials ok - Welcome')
        res.render('home.pug', { logged_in: true})
      }
      else {
        console.log('password inccorect, try again !')
        res.render('login.pug', { logged_in: false})
      }
    }
    else {
      console.log('User not foud, try again with your correct username or subscribe !');
    }
  })
})

app.get('/logout.html', function (req, res) {
  res.render('home.pug', { logged_in: false})
})

/*app.use('connected', function (req, res) {
  passport.connected=true
})*/

app.get('/homeLogged.html', function (req, res) {
  res.render('home.pug', { logged_in: true})
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

app.get('/subscribedRides.html', function (req, res) {
  res.render('subscribedRides.pug')
})

app.get('/searchRides.html', function (req, res) {
  res.render('searchRides.pug')
})

app.get('/searchRiders.html', function (req, res) {
  res.render('searchRiders.pug')
})

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  utilisateur.findById(id, function(err, user) {
    done(err, user);
  });
});


app.listen(3000)
