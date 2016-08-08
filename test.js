/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib');
/*
 * Mongodb dependencies
 */
 var MongoClient = require('mongodb').MongoClient
   , assert = require('assert')
   , mongoose = require('mongoose');

// Connection URL
 var url = 'mongodb://localhost:27017/covoituride';



var app = express()

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

/*// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected succesfully to server - First time");


  db.close();
});
});
*/

mongoose.connect('mongodb://localhost/test');


// EXEMPLE DE CONNECTION ET DAJOUT !!!!!!!!!!!!!!!!!!!!!!
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var kittySchema = mongoose.Schema({
    name: String
});

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}

var Kitten = mongoose.model('Kitten', kittySchema);

var silence = new Kitten({ name: 'Silence' });
console.log(silence.name); // 'Silence'

var fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak(); // "Meow name is fluffy"

fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak();
});

Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
})

Kitten.find({ name: /^Fluff/ });

db.close();
//FIN DE LEXEMPLE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


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
app.get('/subscribe.html', function (req, res) {
  res.render('subscribe.pug')
})
app.get('/subscribedRides.html', function (req, res) {
  res.render('subscribedRides.pug')
})
app.listen(3000)
