import Commission from "../models/Commission.js";

export const getMyCommissions = async (req, res) => {
  try {
    const executiveId = req.user?.id || req.query.executiveId;

    const commissions = await Commission.find({ executiveId })
      .populate("applicationId", "university course visaStatus");

    res.json(commissions);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
