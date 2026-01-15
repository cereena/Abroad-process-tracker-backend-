import DocExecutive from "../models/DocExecutive.js";
import bcrypt from "bcryptjs";

export const registerDoc = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { name, email, phone, branch, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const exists = await DocExecutive.findOne({ email });
    if (exists) return res.status(400).json({ message: "Already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const doc = await DocExecutive.create({
      name,
      email,
      phone,
      branch,
      password: hashed,
    });

    res.status(201).json({ message: "Doc registered", doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginDoc = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doc = await DocExecutive.findOne({ email });
    if (!doc) {
      return res.status(404).json({ message: "Doc not found" });
    }

    const isMatch = await bcrypt.compare(password, doc.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      doc: {
        id: doc._id,
        email: doc.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createDocExecutive = async (req, res) => {
  try {
    const { name, email, phone, branch, countries, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const exec = await User.create({
      name,
      email,
      phone,
      branch,
      password: hashed,
      role: "doc-executive",
      countries
    });

    res.status(201).json(exec);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

