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
          enum: ["suggested", "preferred", "interested", "applied", "not_eligible"],
          default: "suggested",
        },
      },
    ],

    suggestionId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    preferenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },


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
          enum: ["suggested", "pending", "eligible", "applied", "rejected", "interested"],
          default: "suggested",
        },

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    applicationStatus: {
      type: String,
      enum: [
        "Pending",
        "Applied",
        "Offer_Received",
        "Acceptance_Received",
        "Fee_Paid",
        "Visa_Submitted",
        "Visa_Approved",
        "Visa_Rejected",
        "Student_Rejected"
      ],
      default: "Pending",
    },

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
          enum: [
            "Applied",
            "Offer_Received",
            "Rejected",
            "Acceptance_Received",
            "Fee_Paid",
            "Visa_Submitted",
            "Visa_Approved",
            "Visa_Rejected"
          ],
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
