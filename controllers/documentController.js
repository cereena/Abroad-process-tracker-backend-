import mongoose from "mongoose";
import Document from "../models/Document.js";
import Student from "../models/student.js";
import Notification from "../models/Notification.js";

/**
 * Upload document (Student)
 */
export const uploadDocument = async (req, res) => {

  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({
        message: "No file received",
      });
    }
    const studentId = req.user.id;

    // 1. Find student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2. Get assigned executive
    const docExecId = student.assignedTo;

    if (!docExecId) {
      return res.status(400).json({
        message: "No documentation executive assigned",
      });
    }

    // 3. Create document
    const document = await Document.create({
      student: studentId,
      docExecutive: docExecId,
      name: req.body.name,
      type: req.body.type,
      fileUrl: req.file.path,
      publicId: req.file.filename,
      status: "pending",
    });

    // 4. Notify executive
    await Notification.create({
      title: "New Document Uploaded",
      message: `${student.name} uploaded ${req.body.name}`,
      forRole: "DocExecutive",
      userId: docExecId,
      studentId: studentId,
      documentId: document._id,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });

  } catch (err) {
    console.error("UPLOAD DOC ERROR:", err);
    res.status(500).json({ message: "Server error" });
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
    const docs = await Document.find({
      student: req.params.studentId,
    });

    res.json(docs);
  } catch (err) {
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

    if (status === "rejected") {
      doc.rejectionReason = reason;
    }

    await doc.save();

    // Notify student
    await Notification.create({
      title: "Document Status Updated",
      message: `Your document ${doc.name} is ${status}`,
      forRole: "student",
      userId: doc.student,
      studentId: doc.student,
      documentId: doc._id,
    });

    res.json({ message: "Status updated" });

  } catch (err) {
    console.error("STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

