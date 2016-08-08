var mongoose = require('mongoose');
var Schema = mongoose.Schema;



// user schema
var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  cityOfResidence: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  votes: {
    type: Number
  }
});


module.exports = mongoose.model('User', UserSchema);
