const mongoose = require("mongoose");

const docExecSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "doc" }
});

module.exports = mongoose.model("DocExecutive", docExecSchema);
