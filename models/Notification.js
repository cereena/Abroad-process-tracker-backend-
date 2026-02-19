import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  forRole: {
    type: String,
    enum: ["admin", "docexecutive"],
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "docexecutive",
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
  },

  course: String,
  universityName: String,
  country: String,
  enquiryId: String,

  link: {
    type: String,
  },

  suggestionId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  preferenceId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

notificationSchema.index(
  { studentId: 1, forRole: 1, title: 1, suggestionId: 1 },
  { unique: true }
);

export default mongoose.model("Notification", notificationSchema);
