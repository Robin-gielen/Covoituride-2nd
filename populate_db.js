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
var crypto = require('crypto');

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

//CURRENTLY NOT WORKING
app.use(function (req, res, next) {
  //User 1
  crypto.pbkdf2(robin, 'RGFYaWL/rDfkbfRoN/ZUog==', 1000, 512, 'sha512', function (err, key) {
    // create the user
    var newUser = new utilisateur({
      // set the user's local credentials
      username : 'robin',
      password_hash : key.toString('base64'),
      firstName : 'Robin',
      lastName : 'Gielen',
      cityOfResidence : 'Louvain la Neuve',
      description : 'Etudiant Louvain',
      email: 'robin@email.com',
    });
    console.log('newUser Saved')
    // save the user
    newUser.save(function(err) {
      if (err){
        throw err;
      }
      return done(null, newUser);
    });
  });
})

app.use(function (req, res, next) {
  //User 2
  crypto.pbkdf2('julien', 'RGFYaWL/rDfkbfRoN/ZUog==', 1000, 512, 'sha512', function (err, key) {
    // create the user
    var newUser = new utilisateur({
      // set the user's local credentials
      username : 'julien',
      password_hash : key.toString('base64'),
      firstName : 'Julien',
      lastName : 'Gielen',
      cityOfResidence : 'Namur',
      email: 'julien@email.com',
      description : 'Etudiant Namur',
    });
    // save the user
    newUser.save(function(err) {
      if (err){
        throw err;
      }
      return done(null, newUser);
    });
  });
})

app.use(function (req, res, next) {
  //User 3
  crypto.pbkdf2(arnaud, 'RGFYaWL/rDfkbfRoN/ZUog==', 1000, 512, 'sha512', function (err, key) {
    // create the user
    var newUser = new utilisateur({
      // set the user's local credentials
      username : arnaud,
      password_hash : key.toString('base64'),
      firstName : Arnaud,
      lastName : Gielen,
      cityOfResidence : Sart-Bernard,
      email: 'arnaud@email.com',
      description : 'Etudiant Sart-Bernard',
    });
    // save the user
    newUser.save(function(err) {
      if (err){
        throw err;
      }
      return done(null, newUser);
    });
  });
})

app.use(function (req, res, next) {
  //User 4
  crypto.pbkdf2(louis, 'RGFYaWL/rDfkbfRoN/ZUog==', 1000, 512, 'sha512', function (err, key) {
    // create the user
    var newUser = new utilisateur({
      // set the user's local credentials
      username : louis,
      password_hash : key.toString('base64'),
      firstName : Louis,
      lastName : Dassy,
      cityOfResidence : 'Louvain la Neuve',
      email: 'louis@email.com',
      description : 'Etudiant Louvain',
    });
    // save the user
    newUser.save(function(err) {
      if (err){
        throw err;
      }
      return done(null, newUser);
    });
  });
})

app.use(function (req, res, next) {
  //User 5
  crypto.pbkdf2(Ben, 'RGFYaWL/rDfkbfRoN/ZUog==', 1000, 512, 'sha512', function (err, key) {
    // create the user
    var newUser = new utilisateur({
      // set the user's local credentials
      username : ben,
      password_hash : key.toString('base64'),
      firstName : Benjamin,
      lastName : Joiret,
      cityOfResidence : 'Villers-la-Ville',
      email: 'ben@email.com',
      description : 'Etudiant Villers-la-Ville',
    });
    // save the user
    newUser.save(function(err) {
      if (err){
        throw err;
      }
      return done(null, newUser);
    });
  });
})

app.use(function (req, res, next) {
  //User 6
  crypto.pbkdf2(axel, 'RGFYaWL/rDfkbfRoN/ZUog==', 1000, 512, 'sha512', function (err, key) {
    // create the user
    var newUser = new utilisateur({
      // set the user's local credentials
      username : axel,
      password_hash : key.toString('base64'),
      firstName : Axel,
      lastName : Czervic,
      cityOfResidence : Mons,
      email: 'axel@email.com',
      description : 'Etudiant Mons',
    });
    // save the user
    newUser.save(function(err) {
      if (err){
        throw err;
      }
      return done(null, newUser);
    });
  });
})

app.use(function (req, res, next) {
  //User 7
  crypto.pbkdf2(emilio, 'RGFYaWL/rDfkbfRoN/ZUog==', 1000, 512, 'sha512', function (err, key) {
    // create the user
    var newUser = new utilisateur({
      // set the user's local credentials
      username : emilio,
      password_hash : key.toString('base64'),
      firstName : Emilio,
      lastName : Gamba,
      cityOfResidence : Bruxelles,
      email: 'emilio@email.com',
      description : 'Etudiant Bruxelles',
    });
    // save the user
    newUser.save(function(err) {
      if (err){
        throw err;
      }
      return done(null, newUser);
    });
  });
})

app.use(function (req, res, next) {
  //User 8
  crypto.pbkdf2(felix, 'RGFYaWL/rDfkbfRoN/ZUog==', 1000, 512, 'sha512', function (err, key) {
    // create the user
    var newUser = new utilisateur({
      // set the user's local credentials
      username : felix,
      password_hash : key.toString('base64'),
      firstName : Felix,
      lastName : Pierson,
      cityOfResidence : 'Louvain-la-Neuve',
      email: 'felix@email.com',
      description : 'Etudiant Louvain-la-Neuve',
    });
    // save the user
    newUser.save(function(err) {
      if (err){
        throw err;
      }
      return done(null, newUser);
    });
  });
})

app.use(function (req, res, next) {
  //User 9
  crypto.pbkdf2(mathieu, 'RGFYaWL/rDfkbfRoN/ZUog==', 1000, 512, 'sha512', function (err, key) {
    // create the user
    var newUser = new utilisateur({
      // set the user's local credentials
      username : mathieu,
      password_hash : key.toString('base64'),
      firstName : Mathieu,
      lastName : Monnart,
      cityOfResidence : Liege,
      email: 'mathieu@email.com',
      description : 'Etudiant Liege',
    });
    // save the user
    newUser.save(function(err) {
      if (err){
        throw err;
      }
      return done(null, newUser);
    });
  });
})

app.use(function (req, res, next) {
  //User 10
  crypto.pbkdf2(simon, 'RGFYaWL/rDfkbfRoN/ZUog==', 1000, 512, 'sha512', function (err, key) {
    // create the user
    var newUser = new utilisateur({
      // set the user's local credentials
      username : simon,
      password_hash : key.toString('base64'),
      firstName : Simon,
      lastName : Monteyne,
      cityOfResidence : Charlerois,
      email: 'simon@email.com',
      description : 'Etudiant Charlerois',
    });
    // save the user
    newUser.save(function(err) {
      if (err){
        throw err;
      }
      return done(null, newUser);
    });
  });
  console.log('mid');
})



app.use(function (req, res, next) {
  // create the ride 1
  var newRide = new trajet({
  // set the user's local credentials
    departure : Louvain,
    pickUpPlace : 'Gare des Bus',
    midRideTakeOff : No,
    arrival : Namur,
    date : '28.08.16',
    carModel : 'Ford Fiesta',
    maxSeats : 4,
    price : 12,
    stops : No,
    driverUsername : robin,
  });
  // save the user
  newRide.save(function(err) {
    if (err){
      throw err;
    }
    return done(null, newUser);
  });
})

app.use(function (req, res, next) {
  // create the ride 2
  var newRide = new trajet({
  // set the user's local credentials
    departure : Namur,
    pickUpPlace : 'Gare des Trains',
    midRideTakeOff : Yes,
    arrival : Bruxelles,
    date : '25.08.16',
    carModel : Volkswagen,
    maxSeats : 2,
    price : 6,
    stops : Yes,
    driverUsername : emilio,
  });
  // save the user
  newRide.save(function(err) {
    if (err){
      throw err;
    }
    return done(null, newUser);
  });
})

app.use(function (req, res, next) {
  // create the ride 3
  var newRide = new trajet({
  // set the user's local credentials
    departure : Bruxelles,
    pickUpPlace : 'Rue de l etoile',
    midRideTakeOff : No,
    arrival : Sart-Bernard,
    date : '30.08.16',
    carModel : BMW,
    maxSeats : 5,
    price : 16,
    stops : No,
    driverUsername : arnaud,
  });
  // save the user
  newRide.save(function(err) {
    if (err){
      throw err;
    }
    return done(null, newUser);
  });
})

app.use(function (req, res, next) {
  // create the ride 4
  var newRide = new trajet({
  // set the user's local credentials
    departure : Sart-Bernard,
    pickUpPlace : 'Ecole communale',
    midRideTakeOff : Yes,
    arrival : Louvain,
    date : '27.08.16',
    carModel : 'Toyota corola',
    maxSeats : 3,
    price : 9,
    stops : Yes,
    driverUsername : julien,
  });
  // save the user
  newRide.save(function(err) {
    if (err){
      throw err;
    }
    return done(null, newUser);
  });
})

app.use(function (req, res, next) {
  // create the ride 5
  var newRide = new trajet({
  // set the user's local credentials
    departure : Mons,
    pickUpPlace : 'Gare des Bus, place du centre',
    midRideTakeOff : No,
    arrival : Liege,
    date : '28.08.16',
    carModel : 'Renaud Megan',
    maxSeats : 4,
    price : 12,
    stops : No,
    driverUsername : robin,
  });
  // save the user
  newRide.save(function(err) {
    if (err){
      throw err;
    }
    return done(null, newUser);
  });
})

app.use(function (req, res, next) {
  // create the ride 6
  var newRide = new trajet({
  // set the user's local credentials
    departure : Mons,
    pickUpPlace : 'Rue du general',
    midRideTakeOff : No,
    arrival : Sart-Bernard,
    date : '28.08.16',
    carModel : Porsche,
    maxSeats : 1,
    price : 18,
    stops : No,
    driverUsername : ben,
  });
  // save the user
  newRide.save(function(err) {
    if (err){
      throw err;
    }
    return done(null, newUser);
  });
})

app.use(function (req, res, next) {
  // create the ride 7
  var newRide = new trajet({
  // set the user's local credentials
    departure : Charlerois,
    pickUpPlace : 'Rue de la paix',
    midRideTakeOff : No,
    arrival : Namur,
    date : '02.09.16',
    carModel : 'Renaud Clio',
    maxSeats : 6,
    price : 23,
    stops : No,
    driverUsername : axel,
  });
  // save the user
  newRide.save(function(err) {
    if (err){
      throw err;
    }
    return done(null, newUser);
  });
})

app.use(function (req, res, next) {
  // create the ride 8
  var newRide = new trajet({
  // set the user's local credentials
    departure : Namur,
    pickUpPlace : 'Gare des Bus',
    midRideTakeOff : No,
    arrival : Charlerois,
    date : '06.09.16',
    carModel : 'Audi A4',
    maxSeats : 4,
    price : 0,
    stops : No,
    driverUsername : ben,
  });
  // save the user
  newRide.save(function(err) {
    if (err){
      throw err;
    }
    return done(null, newUser);
  });
})

app.use(function (req, res, next) {
  // create the ride 9
  var newRide = new trajet({
  // set the user's local credentials
    departure : Louvain,
    pickUpPlace : 'Parking Charlemagne',
    midRideTakeOff : Yes,
    arrival : Mons,
    date : '20.08.16',
    carModel : 'Ford Fiesta',
    maxSeats : 3,
    price : 12,
    stops : No,
    driverUsername : robin,
  });
  // save the user
  newRide.save(function(err) {
    if (err){
      throw err;
    }
    return done(null, newUser);
  });
  console.log('over');
})

db.close();
