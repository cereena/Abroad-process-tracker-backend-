import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,

  enquiryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enquiry",
  },

  forRole: {
    type: String,
    enum: ["admin", "executive"],
    default: "admin",
  },

  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
