const Progress = require("../models/Progress");

exports.updateProgress = async (req, res) => {
  try {
    const { studentId, currentLevel } = req.body;

    let progress = await Progress.findOne({ studentId });

    if (!progress) {
      progress = new Progress({
        studentId,
        currentLevel
      });
    } else {
      progress.currentLevel = currentLevel;
    }

    await progress.save();

    res.status(200).json({
      message: "Progress updated",
      progress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const { studentId } = req.params;

    const progress = await Progress.findOne({ studentId });

    res.status(200).json(progress || { currentLevel: 1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
