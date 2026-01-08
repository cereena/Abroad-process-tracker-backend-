const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    countryInterested: { type: String },
    status: {
      type: String,
      default: "Enquiry Received" 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
