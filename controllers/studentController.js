import Student from "../models/student.js"; // Match capitalization
import Enquiry from "../models/Enquiry.js";
import bcrypt from "bcryptjs";
import { generateEnquiryId } from "../utils/generateEnquiryId.js";

// CREATE STUDENT FROM LEAD
export const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      countryPreference,
      leadId,
      assignedTo
    } = req.body;

    const enquiryId = generateEnquiryId();

    const student = await Student.create({
      enquiryId,
      name,
      email,
      phone,
      countryPreference,
      leadId,
      assignedTo
    });

    res.status(201).json(student);
    const generateStudentCode = () => {
      return "STU-" + Date.now().toString().slice(-6);
    };

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN → get all students
export const getAllStudents = async (req, res) => {
  const students = await Student.find().populate("assignedTo", "name email");
  res.json(students);
};

// EXECUTIVE → get only assigned students
export const getMyStudents = async (req, res) => {
  const executiveId = req.user.id;   // from auth middleware
  const students = await Student.find({ assignedTo: executiveId });
  res.json(students);
};

// Use 'export const' for every function
export const registerStudent = async (req, res) => {
  try {
    const { name, email, phone, branch, enquiryId, password } = req.body;

    if (!name || !email || !phone || !enquiryId || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const enquiry = await Enquiry.findById(req.body.enquiryId);
    if (!enquiry || enquiry.status !== "Converted to Student") {
      return res.status(400).json({ message: "Invalid Enquiry ID" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({ message: "Student already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name, email, phone, branch, enquiryId,
      password: hashedPassword
    });

    await student.save();
    res.status(201).json({ message: "Student registered successfully", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    res.status(200).json({
      message: "Login successful",
      student: { id: student._id, name: student.name, email: student.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const enquiry = await Enquiry.findById(student.enquiryId);

    res.status(200).json({
      student: { name: student.name, email: student.email, branch: student.branch },
      enquiryStatus: enquiry?.status || "Pending"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
