import express from "express";
import { markOfferReceived } from "../controllers/progressController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.put("/offer", protect, markOfferReceived);

export default router;