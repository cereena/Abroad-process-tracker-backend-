import Application from "../models/Application.js";
import crypto from "crypto";

export const payServiceFee = async (req, res) => {
    try {
        const { appId, universityId } = req.body;

        const app = await Application.findById(appId);

        if (!app) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        const uni = app.appliedUniversities.id(universityId);

        if (!uni) {
            return res.status(404).json({
                message: "University not found",
            });
        }

        uni.paymentStatus = "Service Paid";
        uni.paymentDate = new Date();

        await app.save();

        res.json({
            success: true,
            message: "Service fee paid successfully",
        });

    } catch (err) {
        console.error("PAYMENT ERROR:", err);
        res.status(500).json({
            message: err.message,
        });
    }
};


export const createServiceFeeOrder = async (req, res) => {
    try {
        const { appId, universityId } = req.body;

        const app = await Application.findById(appId);

        if (!app) {
            return res.status(404).json({ message: "Application not found" });
        }

        const uni = app.appliedUniversities.id(universityId);

        if (!uni) {
            return res.status(404).json({ message: "University not found" });
        }

        const options = {
            amount: 15000 * 100, // paise
            currency: "INR",
            receipt: `service_${appId}`,
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Payment order failed" });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            appId,
            universityId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expected = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expected !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        const app = await Application.findById(appId);
        const uni = app.appliedUniversities.id(universityId);

        uni.paymentStatus = "Service Paid";

        await app.save();

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const completePayment = async (req, res) => {
    try {
        console.log("PAYMENT HIT");
        const { appId, universityId } = req.body;

        if (!appId || !universityId) {
            return res.status(400).json({
                success: false,
                message: "Missing payment details",
            });
        }

        const app = await Application.findById(appId);

        if (!app) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        const uni = app.appliedUniversities.id(universityId);

        if (!uni) {
            return res.status(404).json({
                success: false,
                message: "University not found",
            });
        }

        // simulate payment
        uni.paymentStatus = "Service Paid";
        uni.paymentDate = new Date();

        await app.save();

        res.json({
            success: true,
            message: "Payment successful (Development Mode)",
        });

    } catch (error) {
        console.error("Payment error:", error);
        res.status(500).json({
            success: false,
            message: "Payment failed",
        });
    }
};