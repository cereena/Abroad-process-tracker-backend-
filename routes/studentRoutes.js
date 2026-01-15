import express from "express";

import {
    createStudent,
    getAllStudents,
    getMyStudents, registerStudent, loginStudent, getStudentDashboard
} from "../controllers/studentController.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();

// Define your routes
router.post("/", createStudent);

// admin
router.get("/all", getAllStudents);

// executive
router.get("/my", protect, getMyStudents);

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/dashboard/:studentId", getStudentDashboard);

export default router;

