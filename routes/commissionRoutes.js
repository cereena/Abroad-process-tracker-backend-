import express from "express";
import { getMyCommissions } from "../controllers/commissionController.js";

const router = express.Router();

// get commissions for executive
router.get("/my", getMyCommissions);

export default router;
