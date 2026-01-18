import mongoose from "mongoose";

const docExecutiveSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  branch: String,

  password: { type: String, required: true },

  executiveCode: {
    type: String,
    unique: true,
    required: true
  },

  
  countriesHandled: [String],

  role: {
    type: String,
    default: "doc"
  }
}, { timestamps: true });

export default mongoose.model("DocExecutive", docExecutiveSchema);
