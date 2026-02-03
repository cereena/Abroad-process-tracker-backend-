import Document from "../models/Document.js";

/**
 * @desc    Upload a document (Student)
 * @route   POST /api/documents/upload
 * @access  Student
 */

export const uploadDocument = async (req, res) => {
    try {
        console.log("REQ.USER:", req.user);
        console.log("REQ.FILE:", req.file);
        console.log("REQ.BODY:", req.body);
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({ message: "Document name and type required" });
        }

        // Remove old document with same name + type (versioning-lite)
        await Document.deleteMany({
            student: req.user.id,
            name,
            type,
        });

        const document = await Document.create({
            student: req.user.id,
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
        const documents = await Document.find({ student: req.user._id })
            .sort({ createdAt: -1 });

        res.json(documents);
    } catch (error) {
        console.error("Fetch documents error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
