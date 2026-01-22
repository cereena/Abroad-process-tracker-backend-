
import Student from "../models/student.js";
import Lead from "../models/Lead.js";
import Enquiry from "../models/Enquiry.js";
import { generateEnquiryId } from "../utils/generateEnquiryId.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// admin doing this student creation
export const createStudent = async (req, res) => {
  try {
    const { leadId, assignedTo } = req.body;

    if (!leadId || !assignedTo) {
      return res.status(400).json({
        message: "leadId and assignedTo are required"
      });
    }

    // 1️ Fetch lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // 2️ Block duplicate student creation from same lead
    if (lead.isStudentCreated) {
      return res.status(409).json({
        message: "Student already created from this lead"
      });
    }

    // 3️ Fetch enquiry (must exist)
    let enquiry = null;

    if (lead.enquiryRef) {
      enquiry = await Enquiry.findById(lead.enquiryRef);
    }

    if (!enquiry) {
      enquiry = await Enquiry.create({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        countryPreference: lead.countryPreference,
        status: "Converted to Student"
      });

      lead.enquiryRef = enquiry._id;
      await lead.save();
    }


    // 4️ Prevent duplicate student by email
    const existingStudent = await Student.findOne({ email: lead.email });
    if (existingStudent) {
      return res.status(409).json({
        message: "Student already exists"
      });
    }

    // 5️ Generate student enquiry code
    const studentEnquiryCode = generateEnquiryId();

    // 6️ Create student
    const student = await Student.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      countryPreference: lead.countryPreference,
      leadId: lead._id,
      enquiryRef: enquiry._id,
      studentEnquiryCode,
      assignedTo
    });

    // 7️ Update enquiry & lead
    enquiry.status = "Converted to Student";
    lead.status = "Student Created";
    lead.isStudentCreated = true;

    await Promise.all([
      enquiry.save(),
      lead.save()
    ]);

    return res.status(201).json({
      message: "Student created successfully",
      student
    });

  } catch (err) {
    console.error("CREATE STUDENT ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

// admin listing the student details in admin's student panel
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("enquiryRef")
      .populate({
        path: "assignedTo",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (err) {
    console.error("GET STUDENTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// documentation executive viewing their assigned student in their panel
export const getMyStudents = async (req, res) => {
  try {
    const docId = req.user.id;

    const students = await Student.find({ assignedTo: docId })
      .populate("enquiryRef", "enquiryCode")
      .populate("leadId", "name email phone")
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (err) {
    console.error("GET MY STUDENTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// student registers with their enquiryid
export const registerStudent = async (req, res) => {
  try {
    const { enquiryId, email, password } = req.body;

    if (!enquiryId || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = await Student.findOne({
      studentEnquiryCode: enquiryId,
      email
    });

    if (!student) {
      return res.status(404).json({ message: "Invalid enquiry ID or email" });
    }

    if (student.password) {
      return res.status(409).json({ message: "Student already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    student.password = hashedPassword;

    await student.save();

    res.status(200).json({
      message: "Registration successful. Please login."
    });
  } catch (err) {
    console.error("STUDENT REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// student logins
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.password) {
      return res.status(403).json({
        message: "Student not registered yet. Please register first."
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: student._id,
        role: "student",
        email: student.email
      }
    });
  } catch (err) {
    console.error("STUDENT LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// updating student profile
export const updateStudentProfile = async (req, res) => {
  const student = await Student.findById(req.user.id);

  student.fullName = req.body.fullName;
  student.dob = req.body.dob;
  student.passportNumber = req.body.passportNumber;
  student.education = req.body.education;
  student.phone = req.body.phone;

  // PROFILE COMPLETION CHECK (HERE)
  const isProfileComplete =
    student.fullName &&
    student.dob &&
    student.passportNumber &&
    student.education?.degree &&
    student.phone;

  student.profileCompleted = Boolean(isProfileComplete);

  await student.save();

  // NOTIFICATION (HERE)
  await Notification.create({
    role: "docExecutive",
    user: student.assignedTo,
    message: `Student ${student.name} updated Personal Information`,
    student: student._id,
    section: "Personal Info",
  });


  res.json({
    message: "Profile updated",
    profileCompleted: student.profileCompleted,
  });
};

export const getProfileStatus = async (req, res) => {
  const student = await Student.findById(req.user.id).select("profileCompleted");

  res.json({
    profileCompleted: student.profileCompleted,
  });
};

