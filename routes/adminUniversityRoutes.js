import express from "express";

import {
  createUniversity,
  getAllUniversities,
  getOneUniversity,
  updateUniversity,
  deleteUniversity,
} from "../controllers/adminUniversityController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protect all admin routes
router.use(protect(["admin"]));

router.get("/", getAllUniversities);

router.get("/:id", getOneUniversity); // 🔥 IMPORTANT

router.post("/", createUniversity);

router.put("/:id", updateUniversity);

router.delete("/:id", deleteUniversity);

export default router;
