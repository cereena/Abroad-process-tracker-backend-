import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
  },

  universityId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
  },

  amount: Number,

  paymentType: {
    type: String,
    enum: ["Registration", "Service", "Visa"],
  },

  paymentstatus: {
    type: String,
    enum: ["Registration", "Service", "Visa"],
  },


  status: {
    type: String,
    enum: ["Pending", "Success", "Failed"],
    default: "Success",
  },

  transactionId: String,

}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);