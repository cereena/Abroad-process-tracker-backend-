const Student = require("../models/student");
const Enquiry = require("../models/Enquiry");
const bcrypt = require("bcryptjs");

exports.registerStudent = async (req, res) => {
  try {
    const { name, email, phone, branch, enquiryId, password } = req.body;

    if (!name || !email || !phone || !enquiryId || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check enquiry exists & interested
    const enquiry = await Enquiry.findById(enquiryId);
    if (enquiry.status.toLowerCase() !== "interested") {
  return res
    .status(403)
    .json({ message: "Student is not eligible for registration" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({ message: "Student already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      email,
      phone,
      branch,
      enquiryId,
      password: hashedPassword
    });

    await student.save();

    res.status(201).json({
      message: "Student registered successfully",
      student
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        enquiryId: student.enquiryId
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getStudentDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const enquiry = await Enquiry.findById(student.enquiryId);

    res.status(200).json({
      student: {
        name: student.name,
        email: student.email,
        branch: student.branch
      },
      enquiryStatus: enquiry?.status || "Pending",
      progressLevel: enquiry?.status === "Interested" ? 1 : 2
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
