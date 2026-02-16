import express from "express";
import {
  getMyApplication,
  savePreference,
  submitApplication,
  suggestUniversity,
  getStudentApplication,
} from "../controllers/applicationController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Student
router.get("/my", protect(["Student"]), getMyApplication);
router.post("/save", protect(["Student"]), savePreference);
router.put("/submit", protect(["Student"]), submitApplication);

// Executive
router.get(
  "/student/:id",
  protect(["DocExecutive"]),
  getStudentApplication
);

router.post(
  "/suggest/:id",
  protect(["DocExecutive"]),
  suggestUniversity
);

export default router;
