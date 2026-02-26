import express from "express";
import { payServiceFee, createServiceFeeOrder,verifyPayment, completePayment  } from "../controllers/paymentController.js";
import {protect} from "../middleware/auth.js";

const router = express.Router();

router.post("/create-order", protect, createServiceFeeOrder);
router.post("/verify", protect, verifyPayment);
router.post("/complete", protect, completePayment);

// Dev mode fallback
router.post("/service-fee", protect, createServiceFeeOrder);

export default router;