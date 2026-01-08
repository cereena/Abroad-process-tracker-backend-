const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    currentLevel: {
      type: Number,
      default: 1
    },
    steps: [
      {
        title: String,
        completed: Boolean
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
