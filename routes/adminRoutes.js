import express from "express";
const router = express.Router();

// Use curly braces for named imports from your controller
import { createAdmin, loginAdmin } from "../controllers/adminController.js"; 

router.post("/create", createAdmin);
router.post("/login", loginAdmin);


export default router; // This fixes the "does not provide an export named default" error


