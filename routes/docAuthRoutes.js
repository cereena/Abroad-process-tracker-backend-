import express from "express";
import { registerDoc, loginDoc  } from "../controllers/docAuthController.js";

const router = express.Router();

router.post("/register", registerDoc);
router.post("/login", loginDoc); 

export default router;
