import express from "express";
import { payServiceFee } from "../controllers/paymentController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/service-fee", protect, payServiceFee);

export default router;