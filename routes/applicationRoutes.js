import express from "express";
import {
  getMyApplication,
  savePreference,
  submitApplication,
  suggestUniversity,
  getStudentApplication,
  reorderPreference,
  getMySuggestions,
  getMyStudents,
  markInterested,
  updateSuggestionStatus,
  getInterestedStudents,
  getAssignedApplications,
  applyUniversity,
  updatePreferenceStatus,
  updateApplicationProgress
} from "../controllers/applicationController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Student
router.get("/my", protect(["student"]), getMyApplication);
router.post("/save", protect(["student"]), savePreference);
router.put("/submit", protect(["student"]), submitApplication);

router.get(
  "/assigned",
  protect(["docexecutive"]),
  getAssignedApplications
);
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

router.put(
  "/interested/:id",
  protect(["student"]),
  markInterested
);

router.put(
  "/suggestion/status",
  protect(["docexecutive"]),
  updateSuggestionStatus
);

router.get(
  "/interested",
  protect(["docexecutive"]),
  getInterestedStudents
);

router.post(
  "/apply",
  protect(["docexecutive"]),
  applyUniversity
);

router.put(
  "/preference/status",
  protect(["docexecutive"]),
  updatePreferenceStatus
);

router.put("/progress", protect, updateApplicationProgress);


export default router;
