import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  enquiryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enquiry",
    required: true
  },
  name: String,
  email: String,
  phone: String,
  countryPreference: String,

  status: {
    type: String,
    enum: ["Not Registered", "Registered"],
    default: "Not Registered"
  }
}, { timestamps: true });

export default mongoose.model("Lead", LeadSchema);
