import stripe from "../utils/stripe.js";
import Application from "../models/Application.js";

export const createServiceFeeSession = async (req, res) => {
  try {
    const { applicationId } = req.body;

    const app = await Application.findById(applicationId);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Service Fee",
              description: "Study Abroad Processing Fee",
            },
            unit_amount: process.env.SERVICE_FEE * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/student/payment-success/${applicationId}`,
      cancel_url: `${process.env.CLIENT_URL}/student/payment/${applicationId}`,
      metadata: {
        applicationId,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ message: "Payment session failed" });
  }
};