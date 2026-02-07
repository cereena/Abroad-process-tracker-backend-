import express from "express";
import {
  createNotification,
  getAllNotifications,
  getAdminNotifications,
  getDocExecutiveNotifications,
  markAsRead
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
 protect("DocExecutive", "admin"),
  getDocExecutiveNotifications
);

router.put("/notifications/:id/read", protect(["DocExecutive"]), markAsRead);


export default router;
