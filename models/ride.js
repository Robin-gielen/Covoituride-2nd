var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// user schema
var rideSchema = new Schema({
  departure: {
    type: String,   //url of the video
  },
  pickUpPlace: {
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
  date: {
    type: String
  },
  carModel: {
    type: String
  },
  maxSeats: {
    type: Number, min: 1, max: 6
  },
  seatsAvailable: {
    type: Number
  },
  price: {
    type: Number
  },
  stops: {
    type: String
  },
  participants: {
    type: [String]
  },
  driverUsername: {
    type: String
  },
  created_at: Date,
  updated_at: Date
});

// on every save, add the date and the seats
rideSchema.pre('save', function(next) {

  this.seatsAvailable = this.maxSeats;
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
