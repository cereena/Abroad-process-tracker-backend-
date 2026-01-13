import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    executiveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocExecutive",
      required: true,
    },

    university: String,
    course: String,
    country: String,
    intake: String,

    docStatus: {
      type: String,
      enum: ["Pending", "Ready"],
      default: "Pending",
    },

    applicationStatus: {
      type: String,
      enum: ["Pending", "Submitted"],
      default: "Pending",
    },

    offerStatus: {
      type: String,
      enum: ["Pending", "Received"],
      default: "Pending",
    },

    visaStatus: {
      type: String,
      enum: ["Pending", "Submitted", "Success", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
