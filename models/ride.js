var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user schema
var Ride = new Schema({
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
  }
});

module.exports = mongoose.model('Video', VideoSchema);
