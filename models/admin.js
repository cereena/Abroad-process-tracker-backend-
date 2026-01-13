import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Use export default instead of module.exports
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
