import express from "express";
import { createServiceFeeSession, payTuitionFee, confirmServicePayment, uploadTuitionReceipt } from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/service-fee", protect(["student"]), createServiceFeeSession);
router.post("/tuition", protect(["student"]), payTuitionFee);
router.post("/service-success", protect(["student"]), confirmServicePayment);
router.post(
    "/upload-tuition-receipt/:appliedId",
    protect(["student"]),
    upload.single("receipt"),
    uploadTuitionReceipt
);

export default router;