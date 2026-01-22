import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    // BASIC DETAILS 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    branch: { type: String, default: "" },

    //  AUTH 
    password: { type: String }, // only after student registers
    isActive: { type: Boolean, default: true },

    //  LINKS
    enquiryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enquiry",
      required: true,
    },

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },

    //  UNIQUE STUDENT ENQUIRY CODE 
    studentEnquiryCode: {
      type: String,
      unique: true,
      required: true,
    },

    // ASSIGNMENT 
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocExecutive",
    },

    //  PROFILE STATUS 
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    profileCompletionPercent: {
      type: Number,
      default: 0,
    },

    //  STATUS PIPELINE 
    status: {
      type: String,
      default: "New", // New → Docs → Visa → Completed
    },


    // ---------- A. PERSONAL INFORMATION ----------
    personalInfo: {
      photo: { type: String, default: "" },

      firstName: { type: String, default: "" },
      middleName: { type: String, default: "" },
      lastName: { type: String, default: "" },

      gender: { type: String, default: "" },
      maritalStatus: { type: String, default: "" },
      dob: { type: Date },

      nationality: { type: String, default: "" },
      citizenship: { type: String, default: "" },

      countryOfEducation: { type: String, default: "" },
      highestEducationLevel: { type: String, default: "" },
      interestedStudyLevel: { type: String, default: "" },

      countryPreference: {
        type: [String],
        default: [],
      },

      currentAddress: {
        address: { type: String, default: "" },
        country: { type: String, default: "" },
        state: { type: String, default: "" },
        city: { type: String, default: "" },
        postalCode: { type: String, default: "" },
      },

      permanentAddress: {
        sameAsCurrent: { type: Boolean, default: false },
        address: { type: String, default: "" },
        country: { type: String, default: "" },
        state: { type: String, default: "" },
        city: { type: String, default: "" },
        postalCode: { type: String, default: "" },
      },
    },

    // ---------- B. PASSPORT INFORMATION ----------
    passportInfo: {
      nameAsPerPassport: { type: String, default: "" },
      passportNo: { type: String, default: "" },

      issueDate: { type: Date },
      expiryDate: { type: Date },

      issueCountry: { type: String, default: "" },
      cityOfBirth: { type: String, default: "" },
      countryOfBirth: { type: String, default: "" },

      multipleCitizenship: { type: Boolean, default: false },
      livingInOtherCountry: { type: Boolean, default: false },
    },

    // ---------- C. BACKGROUND INFORMATION ----------
    backgroundInfo: {
      immigrationApplied: { type: Boolean, default: false },
      medicalCondition: { type: Boolean, default: false },
      visaRefusal: { type: Boolean, default: false },
      criminalOffence: { type: Boolean, default: false },
    },

    // ---------- D. EMERGENCY CONTACT ----------
    emergencyContact: {
      name: { type: String, default: "" },
      relationship: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },

      address: { type: String, default: "" },
      country: { type: String, default: "" },
      state: { type: String, default: "" },
      city: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
