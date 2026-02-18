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

    preferences: [
      {
        university: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "University",
        },

        course: String,

        country: String,

        priority: Number,

        status: {
          type: String,
          enum: ["preferred", "interested", "applied", "not_eligible"],
          default: "preferred",
        },
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
        interested: {
          type: Boolean,
          default: false,
        },
        status: {
          type: String,
          enum: ["pending", "eligible", "applied", "rejected"],
          default: "pending",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    appliedUniversities: [
      {
        university: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "University",
          required: true,
        },

        course: {
          type: String,
          required: true,
        },

        country: String,

        fee: Number,

        status: {
          type: String,
          enum: ["Pending", "Submitted", "Accepted", "Rejected"],
          default: "Pending",
        },

        appliedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "docexecutive",
        },

        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

  },

  { timestamps: true }
);


export default mongoose.model("Application", applicationSchema);
