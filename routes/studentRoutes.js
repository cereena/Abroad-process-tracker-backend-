import express from "express";
import {
  createStudent,
  getAllStudents,
  getMyStudents
} from "../controllers/studentController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Admin creates student
router.post("/", protect(["admin"]), createStudent);

// Admin fetches all students
router.get("/all", protect(["admin"]), getAllStudents);

// Documentation Executive fetches ONLY their students
router.get("/my", protect(["docExecutive"]), getMyStudents);

export default router;
