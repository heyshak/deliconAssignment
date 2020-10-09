const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deliconUser",
  },
  hotelName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  stars: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: [String],
    required: true,
  },

  website: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Hotel = mongoose.model("hotel", HotelSchema);
