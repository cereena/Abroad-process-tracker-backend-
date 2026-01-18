import Student from "../models/student.js";
import Enquiry from "../models/Enquiry.js";
import bcrypt from "bcryptjs";
import { generateEnquiryId } from "../utils/generateEnquiryId.js";

// ADMIN → CREATE STUDENT FROM LEAD
export const createStudent = async (req, res) => {
  try {
    const { name, email, phone, countryPreference, leadId, assignedTo, enquiryRef } = req.body;

    const studentEnquiryCode = generateEnquiryId();

    const student = await Student.create({
      name,
      email,
      phone,
      countryPreference,
      leadId,
      assignedTo,
      enquiryRef,                 // ObjectId of enquiry
      studentEnquiryCode          // UNIQUE CODE
    });

    res.status(201).json(student);
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
  const executiveId = req.user.id;
  const students = await Student.find({ assignedTo: executiveId });
  res.json(students);
};

// STUDENT → REGISTER (WITH ENQUIRY CODE)
export const registerStudent = async (req, res) => {
  try {
    const { name, email, phone, branch, enquiryId, password } = req.body;

    if (!name || !email || !phone || !enquiryId || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // 🔎 validate enquiry by CODE
    const enquiry = await Enquiry.findOne({ enquiryCode: enquiryId });
    if (!enquiry || enquiry.status !== "Converted to Student") {
      return res.status(400).json({ message: "Invalid Enquiry ID" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({ message: "Student already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      phone,
      branch,
      password: hashedPassword,
      enquiryRef: enquiry._id,
      studentEnquiryCode: enquiry.enquiryCode   // SAME CODE
    });

    res.status(201).json({ message: "Student registered successfully", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// STUDENT LOGIN
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

// STUDENT DASHBOARD
export const getStudentDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const enquiry = await Enquiry.findById(student.enquiryRef);

    res.status(200).json({
      student: { name: student.name, email: student.email, branch: student.branch },
      enquiryStatus: enquiry?.status || "Pending"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// studentController.js
export const getUnassignedStudents = async (req, res) => {
  try {
    const students = await Student.find({ assignedTo: null });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const assignStudentToExecutive = async (req, res) => {
  try {
    const { studentId, executiveId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.assignedTo = executiveId;
    student.status = "Docs";

    await student.save();

    res.json({ message: "Student assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

