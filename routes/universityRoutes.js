import express from "express";
import {
  createUniversity,
  getUniversities,
} from "../controllers/universityController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

/* Public */
router.get("/", getUniversities);

/* Admin / Seeder */
router.post("/", protect(["admin"]), createUniversity);

export default router;
