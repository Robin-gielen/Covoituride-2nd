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
var utilisateur = require('./models/rider');
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
app.locals.pretty = true; // nice HTML
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
    if(req.user)
    {
      res.redirect('home.html');
    }
    utilisateur.find({ username: req.body.username }, function(err, user) {
      //if there's an error with the reading of the db
      if (err)
        return done(err);
      // if no user with that username is Found
      if(user[0] == undefined) {
        return done(null, false, req.flash('loginMessage','User not found.'));
      }
      //User found but wrong password
      else  if(user[0].toObject().password != req.body.password) {
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      }
      //Everything is ok - return user connected
      req.session.username = user[0].toObject().username;
      return done(null, user);
    });
  }
));

// passport/signup.js
passport.use('signup', new Strategy({
    passReqToCallback : true },
   function(req, email, password, done) {
      if(req.user)
      {
        res.redirect('home.html');
      }
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
                     throw err;
                   }
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
  if(req.user)
  {
    res.redirect('home.html');
  }
  res.render('homeUnlogged.pug')
})

app.get('/signup.html', function (req, res) {
  if(req.user)
  {
    res.redirect('home.html');
  }
  else if (req.flash('signupMessage')) {
    res.render('signup.pug', { message: req.flash('signupMessage')})
  }
  else res.render('signup.pug')
})

app.post('/signup.html', passport.authenticate('signup', {
    successRedirect: '/login.html',
    failureRedirect: '/signup.html',
    failureFlash: true //allow flash message
  }));

app.get('/login.html', function (req, res) {
  if(req.user)
  {
    res.redirect('home.html');
  }
  else if (req.flash('loginMessage')) {
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
  utilisateur.find({ username: req.session.username }, function(err, user) {
    if (err) throw err;
    if (user[0] != undefined) {
      res.render('myProfile.pug', {
        usernameDB: user[0].toObject().username,
        passwordDB: user[0].toObject().password,
        firstNameDB: user[0].toObject().firstName,
        lastNameDB: user[0].toObject().lastName,
        cityOfResidenceDB: user[0].toObject().cityOfResidence,
        descriptionDB: user[0].toObject().description,
      });
    }
  });
})

app.get('/modifyProfile.html', function (req, res) {
  utilisateur.find({ username: req.session.username }, function(err, user) {
    if (err) throw err;
    if (user[0] != undefined) {
      res.render('modifyProfile.pug', {
        usernameDB: user[0].toObject().username,
        passwordDB: user[0].toObject().password,
        firstNameDB: user[0].toObject().firstName,
        lastNameDB: user[0].toObject().lastName,
        cityOfResidenceDB: user[0].toObject().cityOfResidence,
        descriptionDB: user[0].toObject().description,
      });
    }
  });
});

app.post('/modifyProfile.html', function(req, res) {
  var query = {'username': req.session.username};
  utilisateur.findOneAndUpdate(query, {
    password: req.body.passwordDB,
    firstName: req.body.firstNameDB,
    lastName: req.body.lastNameDB,
    cityOfResidence: req.body.cityOfResidenceDB,
    description: req.body.descriptionDB
    }, {upsert:true}, function(err, doc){
    if (err) return res.send(500, { error: err });
    return res.redirect('/myProfile.html');
  });
});

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
  // save the user
  newRide.save(function(err, resp) {
    if (err){
      throw err;
    }
  });
  res.redirect('proposedRides.html')
});

app.get('/proposedRides.html', function (req, res) {
  trajet.find({ driverUsername: req.session.username }, function(err, trajets) {
    if (err)
      res.render('proposedRides.pug');
    if(trajets == undefined) {
      res.render('proposedRides.pug')
    }
    res.render('proposedRides.pug', {drives: trajets})
  });
})

app.get('/subscribedRides.html', function (req, res) {
  trajet.find({ participants: req.session.username }, function(err, trajets) {
    if (err)
      res.render('subscribedRides.pug');
    if(trajets == undefined) {
      res.render('subscribedRides.pug')
    }
    res.render('subscribedRides.pug', {drives: trajets})
  });
})

app.get('/searchRides.html', function (req, res) {
  res.render('searchRides.pug')
})

app.post('/foundRides.html', function (req, res) {
  if (req.body.departureTown && req.body.arrivalTown == '') {
    trajet.find({ departure: new RegExp(req.body.departureTown, "i")}, function(err, foundRides) {
      if (err)
        res.render('searchRides.pug', {error: 'No rides found'});
      else if(foundRides[0] == undefined) {
        res.render('searchRides.pug', {error: 'No rides found'})
      }
      else {
        res.render('foundRides.pug', {drives: foundRides})
      }
    });
  }
  else if (req.body.arrivalTown && req.body.departureTown == '') {
    trajet.find({ arrival: req.body.arrivalTown}, function(err, foundRides) {
      if (err)
        res.render('searchRides.pug', {error: 'No rides found'});
      else if(foundRides[0] == undefined) {
        res.render('searchRides.pug', {error: 'No rides found'})
      }
      else {
        res.render('foundRides.pug', {drives: foundRides})
      }
    });
  }
  else if (req.body.arrivalTown && req.body.departureTown){
    trajet.find({departure: req.body.departureTown, arrival: req.body.arrivalTown}, function(err, foundRides) {
      if (err) {
        res.render('searchRides.pug', {error: 'No rides found'});
      }
      else if(foundRides[0] == undefined) {
        res.render('searchRides.pug', {error: 'No rides found'})
      }
      else {
        res.render('foundRides.pug', {drives: foundRides})
      }
    });
  }
  else {
    res.render('searchRides.pug', {error: 'No rides found for those towns'})
  }
})

app.post('/quickSearchRides.html', function (req, res) {
  if (req.body.search) {
    trajet.find({ departure: new RegExp(req.body.search, "i")}, function(err, foundRides) {
      if (err)
        res.render('searchRides.pug', {error: 'No rides found'});
      else if(foundRides[0] == undefined) {
        res.render('searchRides.pug', {error: 'No rides found'})
      }
      else {
        res.render('quickFoundRides.pug', {drives: foundRides})
      }
    });
  }
})

app.get('/searchRiders.html', function (req, res) {
  res.render('searchRiders.pug')
})

app.post('/foundRiders.html', function (req, res) {
  console.log(req.body.searchMethod);
  var temp = req.body.searchMethod;
  if (temp == 'username') {
    utilisateur.find({ username: new RegExp(req.body.searchTerm, "i")}, function(err, foundRiders) {
      console.log('USERNAME')
      if (err) {
        res.render('searchRiders.pug', {error: 'No riders found - Please try again a bit later'});
      }
      else if(foundRiders[0] == undefined) {
        res.render('searchRiders.pug', {error: 'No riders found with this information'})
      }
      else {
        console.log(foundRiders)
        res.render('foundRiders.pug', {riders: foundRiders})
      }
    });
  }
  else if (temp == 'firstName') {
    utilisateur.find({ firstName: new RegExp(req.body.searchTerm, "i")}, function(err, foundRiders) {
      console.log('FIRSTNAME')
      if (err) {
        res.render('searchRiders.pug', {error: 'No riders found - Please try again a bit later'});
      }
      else if(foundRiders[0] == undefined) {
        res.render('searchRiders.pug', {error: 'No riders found with this information'})
      }
      else {
        console.log(foundRiders)
        res.render('foundRiders.pug', {riders: foundRiders})
      }
    });
  }
  else if (temp == 'lastName') {
    utilisateur.find({ lastName: new RegExp(req.body.searchTerm, "i")}, function(err, foundRiders) {
      console.log('LASTNAME')
      if (err) {
        res.render('searchRiders.pug', {error: 'No riders found - Please try again a bit later'});
      }
      else if(foundRiders[0] == undefined) {
        res.render('searchRiders.pug', {error: 'No riders found with this information'})
      }
      else {
        console.log(foundRiders)
        res.render('foundRiders.pug', {riders: foundRiders})
      }
    });
  }
  else {
    res.render('searchRiders.pug', {error: 'No riders found for those infos'})
  }
});

app.use('/subscribeToRide.html/', function(req, res, next) {
  console.log(req.url)
  var rideID = req.url.substring(1);
  trajet.findById(rideID, function(err, foundRide) {
    console.log('COUCOUCOUCOU' + foundRide)
    if (err) {
      res.redirect('back');
    }
    else if(foundRide == undefined) {
      res.redirect('back');
    }
    else if(foundRide.participants == undefined) {
      res.redirect('back');
    }
    else {
      var booleen = false;
      for(var i = 0; i < foundRide.participants.length;i++){
        if (foundRide.participants[i] == req.session.username)
        {
          booleen = true;
        }
      }
      if (booleen) {
        res.redirect('/home.html', {error: 'You are already subscribed to this ride'});
      }
      else {
        var tempRiders = foundRide.participants + req.session.username;
        console.log('TRYING TO UPDATE' + 'UPDATE VALUE: TEMPRIDERS=' + tempRiders)
        trajet.findByIdAndUpdate(rideID, tempRiders, function(err, foundRide) {
          if (err) {
            res.redirect('back');
          }
        });
        res.render('subscribedRides.pug');
      }
    }
  });
});

app.use('/rideInfos.html/', function(req, res, next) {
  console.log('RIDEINFOS.HTML')
  console.log(req.url)
  var rideID = req.url.substring(1);
  trajet.findById(rideID, function(err, foundRide) {
    console.log('COUCOU' + foundRide)
    if (err) {
      res.redirect('/home.html');
    }
    else if(foundRide == undefined) {
      res.redirect('/home.html');
    }
    else {
      req.url = null;
      res.render('rideInfos.pug', {drives: foundRide})
    }
  });
});

app.use('/', function(req, res, next) {
  res.redirect('/home.html');
});

app.listen(3000)
