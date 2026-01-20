import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  enquiryRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enquiry",
    required: true
  },

  name: String,
  email: String,
  phone: String,
  countryPreference: String,

  isStudentCreated: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ["Not Registered", "Registered", "Student Created"],
    default: "Not Registered"
  }
}, { timestamps: true });

export default mongoose.model("Lead", LeadSchema);
