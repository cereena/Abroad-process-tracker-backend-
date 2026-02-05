import mongoose from "mongoose";
import Document from "../models/Document.js";

/**
 * @desc    Upload a document (Student)
 * @route   POST /api/documents/upload
 * @access  Student
 */
export const uploadDocument = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Document name and type required" });
    }

    const studentId = new mongoose.Types.ObjectId(req.user.id);

    // Delete old version
    await Document.deleteMany({
      student: studentId,
      name,
      type,
    });

    const document = await Document.create({
      student: studentId,
      name,
      type,
      fileUrl: req.file.secure_url,
      publicId: req.file.public_id,
      status: "pending",
    });

    res.status(201).json({ document });
  } catch (error) {
    console.error("Upload document error:", error);
    res.status(500).json({ message: error.message });
  }
};


/**
 * @desc    Get logged-in student's documents
 * @route   GET /api/documents/my
 * @access  Student
 */
export const getMyDocuments = async (req, res) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.user.id);

    const documents = await Document.find({
      student: studentId,
    }).sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    console.error("Fetch documents error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

