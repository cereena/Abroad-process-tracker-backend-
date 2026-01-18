import express from "express";
import {
  createStudent,
  getAllStudents,
  getMyStudents,
  registerStudent,
  loginStudent,
  getStudentDashboard, 
  getUnassignedStudents,
} from "../controllers/studentController.js";
import { protect } from "../middleware/auth.js";
import { assignStudentToExecutive } from "../controllers/studentController.js";


const router = express.Router();

// admin creates student
router.post("/", protect(["admin"]), createStudent);

// admin
router.get("/", protect(["admin"]), getAllStudents);
router.get("/unassigned", protect(["admin"]), getUnassignedStudents);
router.post("/assign", protect(["admin"]), assignStudentToExecutive);

// student auth
router.post("/register", registerStudent);
router.post("/login", loginStudent);

// dashboards
router.get("/dashboard/:studentId", getStudentDashboard);
router.get("/my", protect(["doc"]), getMyStudents);



export default router;
