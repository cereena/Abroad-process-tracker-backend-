import mongoose from "mongoose";
import Document from "../models/Document.js";
import Student from "../models/student.js";
import Notification from "../models/Notification.js";

/**
 * Upload document (Student)
 */
export const uploadDocument = async (req, res) => {
  try {

    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can upload documents",
      });
    }

    if (!req.file?.path) {
      return res.status(400).json({
        message: "File upload failed",
      });
    }

    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Missing document info",
      });
    }

    // ✅ Find student
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.assignedTo) {
      return res.status(400).json({
        message: "No executive assigned",
      });
    }

    if (!req.file.path.startsWith("http")) {
      return res.status(400).json({
        message: "Invalid file URL",
      });
    }

    // ✅ Create document
    const document = await Document.create({
      student: student._id,
      DocExecutive: student.assignedTo,
      name,
      type,
      fileUrl: req.file.path,
      status: "pending",
    });

    // ✅ Notify executive
    await Notification.create({
      title: "New Document Uploaded",
      message: `${student.name} uploaded ${name} for verification`,
      forRole: "docexecutive",
      userId: student.assignedTo,
      type: "document_upload",
      studentId: student._id,
      documentId: document._id,
    });

    // ✅ Send response
    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });

  } catch (err) {

    console.error("UPLOAD ERROR FULL:", err.message);
    console.error(err.stack);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * Get my documents (Student)
 */
export const getMyDocuments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const documents = await Document.find({
      student: studentId,
    })
    res.json(documents);

  } catch (err) {
    console.error("GET DOCS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * Get student docs (Doc Executive)
 */
export const getStudentDocuments = async (req, res) => {
  try {
    const studentId = req.params.id;

    const docs = await Document.find({
      student: studentId,
    })
      .populate("student", "name email");

    res.json(docs);
  } catch (err) {
    console.error("GET STUDENT DOCS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update document status (Doc Executive)
 */
export const updateDocumentStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;

    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    doc.status = status;

    doc.rejectReason = status === "rejected" ? reason : "";

    await doc.save();

    // Notify student
    let message = "";

    if (status === "verified") {
      message = "Your document has been verified ✅";
    } else {
      message = `Your document was rejected ❌ : ${reason}`;
    }

    await Notification.create({
      title: "Document Status Updated",
      message,
      forRole: "student",
      userId: doc.student,
      studentId: doc.student,
      documentId: doc._id,
    });

    res.json({
      success: true,
      message: "Status updated",
      document: doc,
    });

  } catch (err) {
    console.error("STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get assigned documents (DocExecutive)
 */
export const getAssignedDocuments = async (req, res) => {
  try {
    const students = await Student.find({
      assignedTo: req.user.id, // IMPORTANT: matches your schema
    }).select("_id");

    const studentIds = students.map((s) => s._id);

    const documents = await Document.find({
      student: { $in: studentIds },
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(documents);

  } catch (err) {
    console.error("ASSIGNED DOC ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
