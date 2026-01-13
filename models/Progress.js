import mongoose from "mongoose"; // Changed from require

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

// Changed from module.exports to export default
const Progress = mongoose.model("Progress", progressSchema);
export default Progress;
