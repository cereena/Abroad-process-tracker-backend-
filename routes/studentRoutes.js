import express from "express";
import { createStudent, getAllStudents } from "../controllers/studentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect(["admin"]), createStudent);


router.get("/all", protect(["admin"]), getAllStudents);

export default router;
