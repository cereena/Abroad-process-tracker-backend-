import express from "express";
import {
  createNotification,
  getAllNotifications,
  getAdminNotifications
} from "../controllers/notificationController.js";

const router = express.Router();

// student / system
router.post("/", createNotification);
router.get("/", getAllNotifications);

// admin notifications (WITH POPULATE)
router.get("/admin", getAdminNotifications);

export default router;
