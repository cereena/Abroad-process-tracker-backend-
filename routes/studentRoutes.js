import express from "express";
import {
  createStudent,
  getAllStudents,
  getMyStudents,
  registerStudent,
  loginStudent,
  getProfileStatus,
} from "../controllers/studentController.js";

import { protect, protectStudent  } from "../middleware/auth.js";

const router = express.Router();

// Admin creates student
router.post("/", protect(["admin"]), createStudent);

// Admin fetches all students
router.get("/all", protect(["admin"]), getAllStudents);

// Documentation Executive fetches ONLY their students
router.get("/my", protect(["docExecutive"]), getMyStudents);

// registration for new students with enquiryid
router.post("/register", registerStudent);

// student logins
router.post("/login", loginStudent);

router.get("/profile-status", protectStudent, getProfileStatus);


export default router;
