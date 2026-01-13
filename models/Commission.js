import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema({
  executiveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DocExecutive",
    required: true,
  },

  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },

  amount: {
    type: Number,
    default: 400,
  },

  status: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
}, { timestamps: true });

export default mongoose.model("Commission", commissionSchema);

