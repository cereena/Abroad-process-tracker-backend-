import express from "express";
import {
  createNotification,
  getAllNotifications
} from "../controllers/notificationController.js";
import Notification from "../models/Notification.js";
import { getAdminNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/admin", async (req, res) => {
  const notes = await Notification.find({ forRole: "admin" })
    .sort({ createdAt: -1 });
  res.json(notes);
});
router.post("/", createNotification);          // student side
router.get("/", getAllNotifications); 
router.get("/admin", getAdminNotifications);    // admin side

export default router;
