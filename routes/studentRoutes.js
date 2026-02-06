import express from "express";
import {
  createStudent,
  getAllStudents,
  getMyStudents,
  registerStudent,
  loginStudent,
  getProfileStatus,
  updateStudentProfile,
  getStudentProfile,
  getStudentProfileById,
  getStudentById,
  updateProfilePhase2,
  getMyProfilePhase2
} from "../controllers/studentController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Admin creates student
router.post("/", protect(["admin"]), createStudent);

// Admin fetches all students
router.get("/all", protect(["admin"]), getAllStudents);

// Documentation Executive fetches their students
router.get("/my", protect(["DocExecutive"]), getMyStudents);

// Student registration
router.post("/register", registerStudent);

// Student login
router.post("/login", loginStudent);

// Student profile status
router.get("/profile-status", protect(["student"]), getProfileStatus);

// Student updates profile ✅ FIXED
router.put("/profile", protect(["student"]), updateStudentProfile);

router.get("/profile", protect(["student"]), getStudentProfile);

router.get("/students/:id/profile", protect(["DocExecutive", "admin"]),getStudentProfileById);

router.get("/:id", protect(["DocExecutive", "admin"]),getStudentById);

// student.routes.js
router.put("/profile/phase2", protect(["student"]),updateProfilePhase2);

router.get("/profile/phase2",protect(["student"]),getMyProfilePhase2);

export default router;
