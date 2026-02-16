import express from "express";
import {
  getMyApplication,
  savePreference,
  submitApplication,
  suggestUniversity,
  getStudentApplication,
  reorderPreference,
  getMySuggestions,
  getMyStudents
} from "../controllers/applicationController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Student
router.get("/my", protect(["student"]), getMyApplication);
router.post("/save", protect(["student"]), savePreference);
router.put("/submit", protect(["student"]), submitApplication);

// Executive
router.get(
  "/student/:id",
  protect(["docexecutive"]),
  getStudentApplication
);

router.post(
  "/suggest/:id",
  protect(["docexecutive"]),
  suggestUniversity
);

router.put(
  "/reorder",
  protect(["student"]),
  reorderPreference
);

router.get(
  "/suggestions",
  protect(["student"]),
  getMySuggestions
);

router.get(
  "/my-students",
  protect(["docexecutive"]),
  getMyStudents
);


export default router;
