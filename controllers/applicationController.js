import Application from "../models/Application.js";
import Commission from "../models/Commission.js";
import Notification from "../models/Notification.js";
import University from "../models/University.js";
import mongoose from "mongoose";

/*
   EXECUTIVE: Get Assigned Applications
*/
export const getAssignedApplications = async (req, res) => {
  try {

    const applications = await Application.find({
      executiveId: req.user.id,   //  keep this
    })

      // STUDENT INFO (for name + enquiryId)
      .populate({
        path: "studentId",
        select: "studentEnquiryCode personalInfo"
      })


      // PREFERENCES → UNIVERSITY (name + country)
      .populate("preferences.university")
      // SUGGESTIONS → UNIVERSITY
      .populate(
        "executiveSuggestions.university"
      )

      // APPLIED → UNIVERSITY
      .populate("appliedUniversities.university");

    res.status(200).json(applications);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to fetch applications",
    });

  }
};


/* 
   UPDATE VISA STATUS (EXECUTIVE / ADMIN)
*/
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
      status: "preferred",
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
      })

      .populate("appliedUniversities.university");

    if (!app) {
      return res.json({ preferences: [], appliedUniversities: [] });
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

    let app = await Application.findOne({ studentId });

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const prefs = app.preferences;

    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= prefs.length ||
      toIndex >= prefs.length
    ) {
      return res.status(400).json({ message: "Invalid index" });
    }

    const [moved] = prefs.splice(fromIndex, 1);
    prefs.splice(toIndex, 0, moved);

    prefs.forEach((p, i) => {
      p.priority = i + 1;
    });

    await app.save();

    // 🔥 REFETCH WITH POPULATE
    app = await Application.findOne({ studentId })
      .populate("preferences.university");

    res.status(200).json(app.preferences);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const suggestUniversity = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { universityId, course, note } = req.body;

    let app = await Application.findOne({ studentId });

    if (!app) {
      app = await Application.create({
        studentId,
        preferences: [],
        executiveSuggestions: [],
      });
    }

    const exists = app.executiveSuggestions.find(
      (s) => s.university.toString() === universityId
    );

    if (exists) {
      return res.status(400).json({ message: "Already suggested" });
    }

    app.executiveSuggestions.push({
      university: universityId,
      course: course,  // ✅ now correctly saved
      note,
      suggestedBy: req.user.id,
    });

    await app.save();

    res.json({
      message: "Suggested successfully",
      suggestions: app.executiveSuggestions,
    });
  } catch (e) {
    console.error("Suggest error:", e);
    res.status(500).json({ message: e.message });
  }
};


export const getMySuggestions = async (req, res) => {
  try {
    const studentId = req.user.id;

    const app = await Application.findOne({ studentId })
      .populate("executiveSuggestions.university")
      .populate("executiveSuggestions.suggestedBy");

    res.json(app?.executiveSuggestions || []);
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

export const markInterested = async (req, res) => {
  try {
    const studentId = req.user.id;
    const suggestionId = req.params.id;

    const app = await Application.findOne({
      studentId,
      "executiveSuggestions._id": suggestionId,
    }).populate("studentId");

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const suggestion = app.executiveSuggestions.id(suggestionId);

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    if (suggestion.status === "interested") {
      return res.json({ message: "Already interested" });
    }

    suggestion.status = "interested";
    suggestion.interested = true;

    app.executiveId = suggestion.suggestedBy;

    await app.save();

    const uni = await University.findById(suggestion.university);

    await Notification.create({
      title: "Student Interested",
      message: `${app.studentId.personalInfo?.firstName || "Student"} is interested`,
      studentId,
      userId: suggestion.suggestedBy,
      forRole: "docexecutive",
      suggestionId: suggestion._id,
      course: suggestion.course,
      universityName: uni?.universityName,
      country: uni?.country,
      enquiryId: app.studentId.studentEnquiryCode,
      link: "/docExecutive/preferences",
    });

    res.json({ message: "Interest saved successfully" });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

export const updateSuggestionStatus = async (req, res) => {
  try {
    const { suggestionId, status } = req.body;

    const app = await Application.findOne({
      "executiveSuggestions._id": suggestionId
    });

    if (!app) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    const suggestion = app.executiveSuggestions.id(suggestionId);

    suggestion.status = status;

    await app.save();

    res.json({ message: "Updated successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getInterestedStudents = async (req, res) => {
  try {
    const apps = await Application.find({
      "executiveSuggestions.interested": true,
      "executiveSuggestions.suggestedBy": req.user.id,
    })
      .populate("studentId")
      .populate("executiveSuggestions.university");

    res.json(apps);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const applyUniversity = async (req, res) => {
  try {
    const { suggestionId } = req.body;

    const app = await Application.findOne({
      executiveId: req.user.id,
      $or: [
        { "executiveSuggestions._id": suggestionId },
        { "preferences._id": suggestionId }
      ]
    })
      .populate("executiveSuggestions.university")
      .populate("preferences.university")
      .populate("appliedUniversities.university");

    if (!app) {
      return res.status(404).json({ message: "Not found" });
    }

    let suggestion = app.executiveSuggestions.id(suggestionId);
    let pref = app.preferences.id(suggestionId);

    const item = suggestion || pref;

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const uni = item.university;

    const alreadyApplied = app.appliedUniversities.find(
      (a) =>
        a.university.toString() === uni._id.toString() &&
        a.course === item.course
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied" });
    }

    app.appliedUniversities.push({
      university: uni._id,
      course: item.course || uni.courseName || "Course Not Specified",
      country: uni.country,
      appliedBy: req.user.id,
      status: "Applied"
    });

    item.status = "applied";

    app.applicationStatus = "Applied";

    await app.save();

    res.json({ message: "Applied successfully" });

  } catch (e) {
    console.error("APPLY ERROR:", e);
    res.status(500).json({ message: e.message });
  }
};

export const updatePreferenceStatus = async (req, res) => {
  try {

    const { prefId, status } = req.body;

    const app = await Application.findOne({
      $or: [
        { "preferences._id": prefId },
        { "executiveSuggestions._id": prefId }
      ]
    });

    if (!app) {
      return res.status(404).json({ message: "Not found" });
    }

    const pref = app.preferences.id(prefId);
    const suggestion = app.executiveSuggestions.id(prefId);

    if (pref) {
      pref.status = status;
    }

    if (suggestion) {
      suggestion.status = status;
    }

    await app.save();
    res.json({ message: "Updated" });
  } catch (e) {
    console.error("ERROR:", e);
    res.status(500).json({ message: e.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { appId, status } = req.body;

    const app = await Application.findById(appId);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    app.applicationStatus = status;

    await app.save();

    res.json({ message: "Status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};