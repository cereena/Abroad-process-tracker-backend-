import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },

    DocExecutive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "docexecutive",
      required: true,
    },

    name: String,          // "10th Certificate"
    type: String,          // "before" | "after"
    fileUrl: String,       // Cloud URL
    publicId: String,      // Cloudinary ID
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    rejectionReason: String,
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

export default Document; 
