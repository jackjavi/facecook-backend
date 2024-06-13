const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      trim: true,
      required: true,
    },
    pass: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
