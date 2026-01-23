import Lead from "../models/Lead.js";
import Enquiry from "../models/Enquiry.js";

// Create lead from enquiry
export const createLeadFromEnquiry = async (req, res) => {
  try {
    const { enquiryId } = req.body;

    if (!enquiryId) {
      return res.status(400).json({ message: "enquiryId is required" });
    }

    // 1️ Fetch enquiry
    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    // 2️ HARD BLOCK: already converted
    if (enquiry.convertedToLead === true) {
      return res.status(400).json({
        message: "This enquiry is already converted to a lead",
      });
    }

    // 3️ Create lead
    const lead = await Lead.create({
      enquiryRef: enquiry._id,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      countryPreference: enquiry.countryPreference,
      status: "Not Registered",
      isStudentCreated: false
    });

    // 4️ PERMANENTLY MARK ENQUIRY
    await Enquiry.findByIdAndUpdate(enquiryId, {
      convertedToLead: true
    });

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });

  } catch (err) {
    console.error("CREATE LEAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get all leads
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .lean();

    const normalized = leads.map(l => ({
      ...l,
      enquiryId: l.enquiryRef || l.enquiryId
    }));

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update lead status
export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
