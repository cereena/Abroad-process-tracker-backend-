import express from "express";
import { uploadDocument, getMyDocuments } from "../controllers/documentController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";


const router = express.Router();

// Student uploads document
router.post(
  "/upload",
  (req, res, next) => {
    console.log("Content-Type:", req.headers["content-type"]);
    next();
  },
  protect(["student"]),
  upload.single("file"),
  uploadDocument
);

// Student fetches own documents
router.get(
  "/my",
  protect(["student"]),
  getMyDocuments
);

export default router;
