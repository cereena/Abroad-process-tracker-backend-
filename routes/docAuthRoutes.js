import express from "express";
import { loginDoc } from "../controllers/docAuthController.js";

const router = express.Router();

router.post("/login", loginDoc);

export default router;
