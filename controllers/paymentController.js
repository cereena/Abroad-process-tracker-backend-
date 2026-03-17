import stripe from "../utils/stripe.js";
import Application from "../models/Application.js";

export const createServiceFeeSession = async (req, res) => {
  try {
    const { appliedId } = req.body;

    if (!appliedId) {
      return res.status(400).json({ message: "Applied ID missing" });
    }

    const application = await Application.findOne({
      "appliedUniversities._id": appliedId
    });

    if (!application) {
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
      success_url: `${process.env.CLIENT_URL}/student/payment-success/${appliedId}`,
      cancel_url: `${process.env.CLIENT_URL}/student/payment/${appliedId}`,
      metadata: {
        appliedId,
        applicationId: application._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ message: "Payment session failed" });
  }
};

export const payTuitionFee = async (req, res) => {
  try {

    const { appId, universityId } = req.body;

    const result = await Application.updateOne(
      {
        _id: appId,
        "appliedUniversities._id": universityId
      },
      {
        $set: {
          "appliedUniversities.$.tuitionFeePaid": true
        }
      }
    );

    if (!result.modifiedCount) {
      return res.status(404).json({
        message: "Application or university not found"
      });
    }

    res.json({
      success: true,
      message: "Tuition fee paid successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Payment failed"
    });

  }
};

export const confirmServicePayment = async (req, res) => {

  try {

    const { appliedId } = req.body;

    const application = await Application.findOne({
      "appliedUniversities._id": appliedId
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await Application.updateOne(
      {
        _id: application._id,
        "appliedUniversities._id": appliedId
      },
      {
        $set: {
          "appliedUniversities.$.serviceFeePaid": true
        }
      }
    );

    res.json({
      success: true,
      message: "Service payment confirmed"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment confirmation failed" });
  }

};

export const uploadTuitionReceipt = async (req,res)=>{

  const { appliedId } = req.params;

  const receiptUrl = req.file.path;

  await Application.updateOne(
    { "appliedUniversities._id": appliedId },
    {
      $set:{
        "appliedUniversities.$.tuitionReceipt": receiptUrl,
        "appliedUniversities.$.tuitionStatus": "Pending_Verification"
      }
    }
  );

  res.json({message:"Receipt uploaded"});
};