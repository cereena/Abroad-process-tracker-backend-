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
          enum: [
            "suggested",
            "preferred",
            "interested",
            "approved",
            "applied",
            "not_eligible"
          ],
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
          enum: [
            "pending",
            "interested",
            "eligible",
            "rejected",
            "applied"
          ],
          default: "pending",
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
        "Offer Received",
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

        documentsVerified: {
          type: Boolean,
          default: false
        },

        offerLetter: {
          url: String,
          uploadedAt: Date
        },

        acceptanceLetter: {
          url: String,
          uploadedAt: Date
        },

        feeReceipt: {
          url: String,
          uploadedAt: Date
        },

        fee: Number,

        paymentStatus: {
          type: String,
          enum: [
            "Registration Paid",
            "Service Paid",
            "Visa Paid"
          ],
          default: "Registration Paid",
        },

        status: {
          type: String,
          enum: [
            "Applied",
            "Offer Received",
            "Rejected",
            "Acceptance_Received",
            "Fee_Paid",
            "Visa_Submitted",
            "Visa_Approved",
            "Visa_Rejected"
          ],
          default: "Applied",
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
