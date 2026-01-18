import Admin from "../models/admin.js"; // Added .js extension
import bcrypt from "bcryptjs";
import Student from "../models/student.js";
import Enquiry from "../models/Enquiry.js";
import DocExecutive from "../models/DocExecutive.js";
import jwt from "jsonwebtoken";

// CREATE ADMIN
export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      email,
      password: hashedPassword
    });

    await admin.save();

    res.status(201).json({ message: "Admin created", admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔥 JWT CREATED HERE
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: "admin"
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// adding the student
export const convertEnquiryToStudent = async (req, res) => {
  try {
    const { enquiryId, name, email, phone } = req.body;

    const student = await Student.create({
      name,
      email,
      phone,
      enquiryId
    });

    await Enquiry.findByIdAndUpdate(enquiryId, {
      status: "Converted to Student"
    });

    res.json({ message: "Student created", student });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createDocExecutive = async (req, res) => {
  const { name, email, password } = req.body;

  const exec = await DocExecutive.create({ name, email, password });
  res.json({ message: "Executive created", exec });
};
