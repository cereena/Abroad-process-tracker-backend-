import Application from "../models/Application.js";
import Commission from "../models/Commission.js";

/* =====================================================
   EXECUTIVE: Get Assigned Applications
===================================================== */
export const getMyAssignedApplications = async (req, res) => {
  try {
    const executiveId = req.user.id;

    const apps = await Application.find({ executiveId })
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =====================================================
   UPDATE VISA STATUS (EXECUTIVE / ADMIN)
===================================================== */
export const updateVisaStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    app.visaStatus = status;
    await app.save();

    // Auto commission on success
    if (status === "Success") {
      const exists = await Commission.findOne({
        applicationId: app._id,
      });

      if (!exists) {
        await Commission.create({
          executiveId: app.executiveId,
          applicationId: app._id,
          amount: 400,
        });
      }
    }

    res.json({ message: "Visa status updated", app });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =====================================================
   ASSIGN EXECUTIVE (ADMIN)
===================================================== */
export const assignExecutive = async (req, res) => {
  try {
    const { appId, execId } = req.body;

    const app = await Application.findByIdAndUpdate(
      appId,
      { executiveId: execId },
      { new: true }
    );

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Executive assigned", app });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =====================================================
   SAVE PREFERENCE (STUDENT)
===================================================== */
export const savePreference = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { universityId, course } = req.body;

    let app = await Application.findOne({ studentId });

    // Create if not exists
    if (!app) {
      app = await Application.create({
        studentId,
        preferences: [],
      });
    }

    // Lock after submit
    if (app.applicationStatus === "Submitted") {
      return res.status(403).json({
        message: "Application already submitted",
      });
    }

    // Limit preferences
    if (app.preferences.length >= 5) {
      return res.status(400).json({
        message: "Maximum 5 preferences allowed",
      });
    }

    // Prevent duplicate
    const exists = app.preferences.find(
      (p) => p.university.toString() === universityId
    );

    if (exists) {
      return res.status(400).json({
        message: "University already added",
      });
    }

    app.preferences.push({
      university: universityId,
      course,
      priority: app.preferences.length + 1,
    });

    await app.save();

    res.json({ message: "Preference added", app });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =====================================================
   GET MY APPLICATION (STUDENT)
===================================================== */
export const getMyApplication = async (req, res) => {
  try {
    const studentId = req.user.id;

    const app = await Application.findOne({ studentId })
      .populate({
        path: "preferences.university",
        model: "University",
      })
      .populate({
        path: "executiveSuggestions.university",
        model: "University",
      });

    if (!app) {
      return res.json({ preferences: [] });
    }

    res.json(app);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};


/* =====================================================
   SUBMIT APPLICATION (STUDENT)
===================================================== */
export const submitApplication = async (req, res) => {
  try {
    const studentId = req.user.id;

    const app = await Application.findOne({ studentId });

    if (!app) {
      return res.status(404).json({
        message: "No application found",
      });
    }

    if (app.preferences.length === 0) {
      return res.status(400).json({
        message: "Add at least one preference",
      });
    }

    app.applicationStatus = "Submitted";

    await app.save();

    res.json({ message: "Application submitted", app });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =====================================================
   GET STUDENT APPLICATION (EXECUTIVE)
===================================================== */
export const getStudentApplication = async (req, res) => {
  try {
    const studentId = req.params.id;

    const app = await Application.findOne({ studentId })
      .populate("studentId", "name email phone")
      .populate("preferences.university")
      .populate("executiveSuggestions.university");

    if (!app) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json(app);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Update preference priority
export const reorderPreference = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const studentId = req.user.id;
    const { fromIndex, toIndex } = req.body;

    const app = await Application.findOne({ studentId });

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const prefs = app.preferences;

    if (!Array.isArray(prefs)) {
      return res.status(400).json({ message: "Invalid preferences" });
    }

    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= prefs.length ||
      toIndex >= prefs.length
    ) {
      return res.status(400).json({ message: "Invalid index" });
    }

    // move item
    const [moved] = prefs.splice(fromIndex, 1);
    prefs.splice(toIndex, 0, moved);

    // reassign priorities
    prefs.forEach((p, i) => {
      p.priority = i + 1;
    });

    await app.save();

    res.status(200).json(prefs);

  } catch (e) {
    console.error("Reorder error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

export const suggestUniversity = async (req, res) => {
  try {
    const { studentId, universityId, course } = req.body;
    const execId = req.user.id;

    const app = await Application.findOne({ studentId });

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const exists = app.executiveSuggestions.find(
      (s) => s.university.toString() === universityId
    );

    if (exists) {
      return res.status(400).json({ message: "Already suggested" });
    }

    app.executiveSuggestions.push({
      university: universityId,
      course,
      suggestedBy: execId,
    });

    await app.save();

    const updated = await Application.findOne({ studentId })
      .populate("executiveSuggestions.university")
      .populate("executiveSuggestions.suggestedBy");

    res.json(updated.executiveSuggestions);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getMySuggestions = async (req, res) => {
  try {
    const studentId = req.user.id;

    const app = await Application.findOne({ studentId })
      .populate("suggestions.university")
      .populate("suggestions.suggestedBy");

    res.json(app?.suggestions || []);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getMyStudents = async (req, res) => {
  try {
    const execId = req.user.id;

    const apps = await Application.find({ executiveId: execId })
      .populate("studentId", "name email");

    res.json(apps.map(a => a.studentId));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
