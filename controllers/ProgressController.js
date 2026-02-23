import Application from "../models/Application.js";
import Progress from "../models/Progress.js";


export const markOfferReceived = async (req, res) => {
  try {
    const { appId, universityId } = req.body;

    const app = await Application.findById(appId);

    const uni = app.appliedUniversities.id(universityId);

    uni.status = "Offer_Received";

    await app.save();

    await Progress.findOneAndUpdate(
      { applicationId: appId },
      { currentStage: "Offer_Received" },
      { upsert: true }
    );

    res.json({ message: "Offer received updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const markRejected = async (req, res) => {
  try {
    const { appId } = req.body;

    const app = await Application.findById(appId);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    app.applicationStatus = "Student_Rejected";
    await app.save();

    res.json({ message: "Application rejected" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
