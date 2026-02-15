import express from "express";
import { getUniversities } from "../controllers/universityController.js";

const router = express.Router();

router.get("/", getUniversities);

export default router;
