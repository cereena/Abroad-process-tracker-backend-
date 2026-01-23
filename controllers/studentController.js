
import Student from "../models/student.js";
import Lead from "../models/Lead.js";
import Enquiry from "../models/Enquiry.js";
import { generateEnquiryId } from "../utils/generateEnquiryId.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Notification from "../models/Notification.js";



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
      .select(
        "studentEnquiryCode name email phone countryPreference profileCompleted profileCompletionPercent status createdAt"
      )

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
      success: true,
      token,
      user: {
        id: student._id,
        role: "student",
        name: student.name,
        email: student.email
      }
    });
  } catch (err) {
    console.error("STUDENT LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE STUDENT PROFILE (PHASE 1)
export const updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const {
      personalInfo,
      passportInfo,
      backgroundInfo,
      emergencyContact,
    } = req.body;

    // 1️⃣ SAVE PROFILE DATA
    student.personalInfo = personalInfo;
    student.passportInfo = passportInfo;
    student.backgroundInfo = backgroundInfo;
    student.emergencyContact = emergencyContact;

    // 2️⃣ PROFILE COMPLETION CHECK
    const isProfileComplete =
      personalInfo?.firstName &&
      personalInfo?.lastName &&
      personalInfo?.gender &&
      personalInfo?.dob &&
      passportInfo?.passportNo &&
      passportInfo?.expiryDate &&
      emergencyContact?.name &&
      emergencyContact?.phone;

    student.profileCompleted = Boolean(isProfileComplete);
    student.profileCompletionPercent = isProfileComplete ? 40 : 20;

    // ✅ SAVE FIRST
    await student.save();

    // 3️⃣ SEND NOTIFICATION ONLY ON FIRST COMPLETION
    if (student.profileCompleted && !student.profileNotified) {

      // 🔔 Executive notification
      if (student.assignedTo) {
        await Notification.create({
          title: "Student Profile Completed",
          message: `Student ${student.name} has completed their profile`,
          forRole: "doc-executive",
          userId: student.assignedTo,
          studentId: student._id,
        });
      }

      // 🔔 Admin notification
      await Notification.create({
        title: "Student Profile Completed",
        message: `Student ${student.name} has completed their profile`,
        forRole: "admin",
        studentId: student._id,
      });

      student.profileNotified = true;
      await student.save(); // save flag
    }

    // ✅ ALWAYS RESPOND
    return res.json({
      message: "Profile updated successfully",
      profileCompleted: student.profileCompleted,
      profileCompletionPercent: student.profileCompletionPercent,
    });

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Student profile status
export const getProfileStatus = async (req, res) => {
  const student = await Student.findById(req.user.id).select("profileCompleted");

  res.json({
    profileCompleted: student.profileCompleted,
  });
};

export const getStudentProfile = async (req, res) => {
  const student = await Student.findById(req.user.id).select(
    "personalInfo passportInfo backgroundInfo emergencyContact profileCompleted"
  );

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
};

// GET student profile by ID (EXEC + ADMIN)
export const getStudentProfileById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getStudentById = async (req, res) => {
  const student = await Student.findById(req.params.id).select("-password");

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
};
