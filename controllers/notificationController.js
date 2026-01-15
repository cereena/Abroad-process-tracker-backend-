import Notification from "../models/Notification.js";

export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAdminNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ forRole: "admin" })
      .populate("enquiryId", "name email phone countryPreference message")
      .sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
