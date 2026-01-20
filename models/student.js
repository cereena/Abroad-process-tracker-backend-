import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    //BASIC DETAILS
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    branch: { type: String },
    countryPreference: { type: String },

    // AUTH
    password: { type: String },   // only if student can login
    isActive: { type: Boolean, default: true },

    // LINKS
    enquiryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enquiry",
      required: true
    },

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead"
    },

    // UNIQUE STUDENT ENQUIRY CODE
    studentEnquiryCode: {
      type: String,
      unique: true,
      required: true
    },

    // ASSIGNMENT
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocExecutive"   // executive
    },

    // STATUS PIPELINE
    status: {
      type: String,
      default: "New", // New → Docs → Visa → Completed
    }
  },
  { timestamps: true }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
