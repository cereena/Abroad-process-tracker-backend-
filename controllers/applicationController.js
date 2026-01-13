import Application from "../models/Application.js";
import Commission from "../models/Commission.js";

export const createApplication = async (req, res) => {
  try {
    const app = await Application.create(req.body);
    res.status(201).json(app);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const executiveId = req.user?.id || req.query.executiveId;

    const apps = await Application.find({ executiveId })
      .populate("studentId", "name email");

    res.json(apps);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateVisaStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    app.visaStatus = status;
    await app.save();

    // 🎯 auto commission logic
    if (status === "Success") {
      const exists = await Commission.findOne({
        applicationId: app._id,
      });

      if (!exists) {
        await Commission.create({
          executiveId: app.executiveId,
          applicationId: app._id,
          amount: 400,
        });
      }
    }

    res.json({ message: "Visa updated", app });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const assignExecutive = async (req, res) => {
  const { appId, execId } = req.body;

  const app = await Application.findByIdAndUpdate(
    appId,
    { executiveId: execId },
    { new: true }
  );

  res.json({ message: "Executive assigned", app });
};