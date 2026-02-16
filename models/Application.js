import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },

    executiveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "docexecutive",
      default: null,
    },

    // OLD system (keep)
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

    // NEW system
    preferences: [
      {
        university: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "University",
        },
        course: String,
        priority: Number,
      },
    ],

    executiveSuggestions: [
      {
        university: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "University",
        },
        course: String,
        note: String,
        suggestedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "docexecutive",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  { timestamps: true }
);


export default mongoose.model("Application", applicationSchema);
