import express from "express";
import { completePayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Development payment simulation
router.post("/complete", protect, completePayment);

export default router;