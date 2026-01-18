import express from "express";
import { createDocExecutive, getAllExecutives } from "../controllers/docExecutiveController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", protect(["admin"]), createDocExecutive);
// routes/docExecutiveRoutes.js
router.get("/all", protect(["admin"]), getAllExecutives);


export default router;
