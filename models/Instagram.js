const mongoose = require("mongoose");

const igSchema = new mongoose.Schema({
  user: {
    type: String,
    trim: true,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Instagram", igSchema);
