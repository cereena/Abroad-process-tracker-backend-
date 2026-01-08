const express = require("express");
const router = express.Router();

const {
  updateProgress,
  getProgress
} = require("../controllers/ProgressController");

router.post("/update", updateProgress);
router.get("/:studentId", getProgress);

module.exports = router;


