import express from "express";
import {
  createLeadFromEnquiry,
  getAllLeads,
  updateLeadStatus
} from "../controllers/leadController.js";

const router = express.Router();

router.post("/from-enquiry", createLeadFromEnquiry);
router.get("/", getAllLeads);
router.put("/:id/status", updateLeadStatus);

export default router;
