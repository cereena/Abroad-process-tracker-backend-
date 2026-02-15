import express from "express";
import {
  createUniversity,
  getAllUniversities,
  updateUniversity,
  deleteUniversity,
} from "../controllers/adminUniversityController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes protected for Admin only
router.use(protect(["admin"]));

// GET all universities
router.get("/", getAllUniversities);

// CREATE university
router.post("/", createUniversity);

// UPDATE university
router.put("/:id", updateUniversity);

// DELETE university
router.delete("/:id", deleteUniversity);

export default router;
