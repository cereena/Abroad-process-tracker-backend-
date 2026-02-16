import express from "express";
import { createDocExecutive, getAllExecutives } from "../controllers/docExecutiveController.js";
import { protect } from "../middleware/auth.js";
import { getMyStudents } from "../controllers/studentController.js";

const router = express.Router();

router.post("/create", protect(["admin"]), createDocExecutive);
// routes/docExecutiveRoutes.js
router.get("/all", protect(["admin"]), getAllExecutives);

router.get(
  "/students",
  protect(["docexecutive"]),
  getMyStudents
);

export default router;
