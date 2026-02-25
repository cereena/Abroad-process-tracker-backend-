import express from "express";
import { markOfferReceived, uploadOfferLetter } from "../controllers/ProgressController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.put("/offer", protect(["docexecutive"]), markOfferReceived);

router.post(
  "/upload-offer",
  protect(["docexecutive"]),
  upload.single("document"),
  uploadOfferLetter
);

export default router;