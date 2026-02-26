import Application from "../models/Application.js";

export const payServiceFee = async (req, res) => {
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

    uni.paymentStatus = "Service Paid";

    await app.save();

    res.json({
      message: "Service fee paid successfully",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};