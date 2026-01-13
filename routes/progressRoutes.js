import express from "express";
import Progress from "../models/Progress.js"; // Note the .js extension

const router = express.Router();
// Add 'export' before each function
export const updateProgress = async (req, res) => {
  try {
    const { studentId, currentLevel, steps } = req.body;
    
    let progress = await Progress.findOneAndUpdate(
      { studentId },
      { currentLevel, steps },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Progress updated", progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    const progress = await Progress.findOne({ studentId });

    if (!progress) {
      return res.status(404).json({ message: "No progress found for this student" });
    }

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default router; 