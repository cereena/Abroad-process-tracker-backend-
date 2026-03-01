import express from "express";
import { createServiceFeeSession } from "../controllers/paymentController.js";
import {protect} from "../middleware/auth.js";

const router = express.Router();

router.post("/service-fee", protect(["student"]), createServiceFeeSession);

export default router;