import mongoose from "mongoose";

const docSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }, 
  branch: { type: String },               
  password: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("DocExecutive", docSchema);
