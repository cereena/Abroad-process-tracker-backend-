import DocExecutive from "../models/DocExecutive.js";
import bcrypt from "bcryptjs";
import { generateExecCode } from "../utils/generateExecCode.js";

export const createDocExecutive = async (req, res) => {
  try {
    const { name, email, password, phone, branch, countriesHandled } = req.body;

    const exists = await DocExecutive.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Executive already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const exec = await DocExecutive.create({
      name,
      email,
      phone,
      branch,
      password: hashed,
      countriesHandled,
      executiveCode: generateExecCode()
    });

    res.status(201).json(exec);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controller
export const getAllExecutives = async (req, res) => {
  try {
    const executives = await DocExecutive.find().select("-password");
    res.json(executives);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
