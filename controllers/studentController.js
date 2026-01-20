
import Student from "../models/student.js";
import Lead from "../models/Lead.js";
import Enquiry from "../models/Enquiry.js";
import { generateEnquiryId } from "../utils/generateEnquiryId.js";

export const createStudent = async (req, res) => {
  try {
    const { leadId, assignedTo } = req.body;

    if (!leadId || !assignedTo) {
      return res.status(400).json({
        message: "leadId and assignedTo are required"
      });
    }

    // 1️⃣ Fetch lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // 2️⃣ Block duplicate student creation from same lead
    if (lead.isStudentCreated) {
      return res.status(409).json({
        message: "Student already created from this lead"
      });
    }

    // 3️⃣ Fetch enquiry (must exist)
    const enquiry = await Enquiry.findById(lead.enquiryRef);
    if (!enquiry) {
      return res.status(500).json({
        message: "Data integrity error: enquiry missing for lead"
      });
    }

    // 4️⃣ Prevent duplicate student by email
    const existingStudent = await Student.findOne({ email: lead.email });
    if (existingStudent) {
      return res.status(409).json({
        message: "Student already exists"
      });
    }

    // 5️⃣ Generate student enquiry code
    const studentEnquiryCode = generateEnquiryId();

    // 6️⃣ Create student
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

    // 7️⃣ Update enquiry & lead
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


