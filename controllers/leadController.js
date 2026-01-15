import Lead from "../models/Lead.js";
import Enquiry from "../models/Enquiry.js";

// Create lead from enquiry
export const createLeadFromEnquiry = async (req, res) => {
  try {
    const { enquiryId } = req.body;
    const existingLead = await Lead.findOne({ enquiryId });

    if (existingLead) {
      return res.status(400).json({
        message: "This enquiry is already added as a lead"
      });
    }


    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    const lead = await Lead.create({
      enquiryId: enquiry._id,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      countryPreference: enquiry.countryPreference
    });

    res.status(201).json({ message: "Lead created", lead });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all leads
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
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
