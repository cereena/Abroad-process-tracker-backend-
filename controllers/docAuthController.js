import DocExecutive from "../models/DocExecutive.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign(
      { id: doc._id, role: "docexecutive" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      token,
      user: {
        id: doc._id,
        role: "docexecutive",
        email: doc.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
