// OLD SIGNUP STRATEGY BEFORE STRATEGY WORKED
app.post('/signup.html', function (req, res, next) {
  console.log('In signup function');
  utilisateur.find({ username: req.body.username }, function(err, user) {
    if (err) throw err;
    if (user[0] != undefined) {
      if (user[0].toObject().username == req.body.username) {
        console.log('Username already exists in database')
        res.render('signup.pug', {error: 'Username already exists'})
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

// OLD LOGIN STRATEGY BEFORE STRATEGY WORKED
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
        res.render('login.pug', {error: 'Incorect password'})

      }
    }
    else {
      console.log('User not foud, try again with your correct username or subscribe !');
      res.render('login.pug', {error: 'Username not existing'})
    }
  })
})


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
