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


  countriesHandled: {
    type: [String],
    default: []
  },


  role: {
    type: String,
    default: "DocExecutive"
  }
}, { timestamps: true });

export default mongoose.model("DocExecutive", docExecutiveSchema);
