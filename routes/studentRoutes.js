import express from "express";
const router = express.Router();
import { registerStudent, loginStudent,getStudentDashboard } from "../controllers/studentController.js";

// Define your routes
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/dashboard/:studentId", getStudentDashboard);

export default router;

