import University from "../models/University.js";

/* CREATE */
export const createUniversity = async (req, res) => {
  try {
    const uni = await University.create(req.body);
    res.status(201).json(uni);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* GET ALL */
export const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find().sort({ createdAt: -1 });
    res.json(universities);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

/* GET ONE (IMPORTANT FOR EDIT) */
export const getOneUniversity = async (req, res) => {
  try {
    const uni = await University.findById(req.params.id);

    if (!uni) {
      return res.status(404).json({ message: "University not found" });
    }

    res.json(uni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
export const updateUniversity = async (req, res) => {
  try {
    const uni = await University.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!uni) {
      return res.status(404).json({ message: "University not found" });
    }

    res.json(uni);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
};

/* DELETE */
export const deleteUniversity = async (req, res) => {
  try {
    const uni = await University.findByIdAndDelete(req.params.id);

    if (!uni) {
      return res.status(404).json({ message: "University not found" });
    }

    res.json({ message: "University deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
