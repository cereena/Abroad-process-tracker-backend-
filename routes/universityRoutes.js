import express from "express";
import {
  createUniversity,
  getUniversities,
  updateUniversity,
  deleteUniversity,
  getOneUniversity,
} from "../controllers/universityController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

/* Public */
// Get all
router.get( "/universities", protect(["admin"]), getUniversities);

// Get ONE (THIS IS MISSING IN YOUR PROJECT)
router.get(
  "/universities/:id",
  protect(["admin"]),
  getOneUniversity
);

// Create
router.post(
  "/universities",
  protect(["admin"]),
  createUniversity
);

// Update
router.put(
  "/universities/:id",
  protect(["admin"]),
  updateUniversity
);

// Delete
router.delete(
  "/universities/:id",
  protect(["admin"]),
  deleteUniversity);

export default router;
