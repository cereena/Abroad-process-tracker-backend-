import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },

    currentLevel: {
      type: Number,
      default: 1,
    },

    steps: [
      {
        title: String,
        completed: Boolean,
      },
    ],
  },
  { timestamps: true }
);

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;