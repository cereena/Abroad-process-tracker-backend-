const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");

// Student submits enquiry
router.post("/", async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json({ message: "Enquiry submitted", enquiry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin views all enquiries
router.get("/", async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json(enquiries);
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json({ message: "Status updated", enquiry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
