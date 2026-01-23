import mongoose from "mongoose"; // Changed from require

const enquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  countryPreference: String,
  message: String,

  status: {
    type: String,
    default: "New Lead",
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DocExecutive",
  },
   convertedToLead: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;
