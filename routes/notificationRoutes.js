import express from "express";
import {
  createNotification,
  getAllNotifications,
  getAdminNotifications,
  getDocExecutiveNotifications
} from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// student / system
router.post("/", createNotification);
router.get("/", getAllNotifications);

// admin notifications (WITH POPULATE)
router.get("/admin", getAdminNotifications);

router.get(
  "/doc-executive",
 protect("docExecutive", "admin"),
  getDocExecutiveNotifications
);

export default router;
