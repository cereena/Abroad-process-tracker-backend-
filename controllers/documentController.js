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

    const existing = await Notification.findOne({
      userId: docExecId,
      studentId: studentId,
      type: "document_upload",
      isRead: false,
    });

    if (!existing) {
      await Notification.findOneAndUpdate(
        {
          studentId: student._id,
          forRole: "DocExecutive",
          title: "New Document Uploaded",
        },
        {
          title: "New Document Uploaded",
          message: `${student.name} uploaded new documents`,
          studentId: student._id,
          forRole: "DocExecutive",
          isRead: false,
        },
        { upsert: true, new: true }
      );

    }

    // 4. Notify executive
    await Notification.create({
      title: "Documents Uploaded",
      message: `${student.name} uploaded documents for verification`,
      forRole: "DocExecutive",
      userId: docExecId,

      type: "document_upload",
      studentId: studentId,
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
