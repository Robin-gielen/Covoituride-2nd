var mongoose = require('mongoose');
var Schema = mongoose.Schema;



// user schema
var userSchema = new Schema({
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
    type: String
  },
  description: {
    type: String
  },
  votes: {
    type: Number
  },
  created_at: Date,
  updated_at: Date
});

//Custom methods to upvote/downvote a user by one
userSchema.methods.upVote = function() {
  // add one to the votes
  this.votes = this.votes + 1;
  return this.votes;
};
userSchema.methods.downVote = function() {
  // sub one from the votes
  this.votes = this.votes - 1;
  return this.votes;
};

// on every save, add the date
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

module.exports = mongoose.model('Rider', userSchema);
