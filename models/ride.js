var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user schema
var rideSchema = new Schema({
  departure: {
    type: String,   //url of the video
  },
  takeOff: {
    type: String,
    required: true,
  },
  midRideTakeOff: {
    type: Boolean,
    required: true,
  },
  arrival: {
    type: String
  },
  carModel: {
    type: String
  },
  seatsAvailable: {
    type: { type: Number, min: 1, max: 6 }
  },
  price: {
    type: Number
  },
  stops: {
    type: String
  },
  driverUsername: {
    type: String
  },
  created_at: Date,
  updated_at: Date
});

// on every save, add the date
rideSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

module.exports = mongoose.model('Ride', rideSchema);
