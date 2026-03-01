import Application from "../models/Application.js";
import Progress from "../models/Progress.js";
import cloudinary from "../config/cloudinary.js";

export const markOfferReceived = async (req, res) => {
  try {
    const { appId, universityId, status } = req.body;

    const app = await Application.findById(appId);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const uni = app.appliedUniversities.id(universityId);
    if (!uni) return res.status(404).json({ message: "University not found" });

    uni.status = status;

    await app.save();

    await Progress.findOneAndUpdate(
      { applicationId: appId },
      { currentLevel: 3 },
      { upsert: true, new: true }
    );

    res.json({ message: "Status updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadOfferLetter = async (req, res) => {
  const { appId, universityId } = req.body;

  const app = await Application.findById(appId);
  const uni = app.appliedUniversities.id(universityId);

  uni.offerLetter = {
    url: req.file.path,
    public_id: req.file.filename,
  };

  await app.save();

  res.json({
    message: "Offer letter uploaded",
    downloadUrl: cloudinary.url(req.file.filename, {
      resource_type: "raw",
      attachment: true,
      secure: true,
    }),
  });
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
