import express from "express";
import {
  createApplication,
  getMyApplications,
  updateVisaStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

// create new application
router.post("/", createApplication);

// get applications for executive
router.get("/my", getMyApplications);

// update visa status
router.patch("/:id/visa-status", updateVisaStatus);

export default router;
