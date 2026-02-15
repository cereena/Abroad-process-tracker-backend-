import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
    {
        /* University Info */
        universityName: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            required: true,
        },

        city: String,

        partner: {
            type: Boolean,
            default: false,
        },

        globalRanking: {
            type: Number,
        },

        globallyRecognized: {
            type: Boolean,
            default: true,
        },

        /* Course Info */
        courseName: {
            type: String,
            required: true,
        },

        degree: {
            type: String,
            enum: ["Bachelors", "Masters", "PhD", "Diploma"],
            required: true,
        },

        stream: {
            type: String,
            enum: [
                "Computer Science",
                "Engineering",
                "Business",
                "Health",
                "Arts",
                "Science",
            ],
            required: true,
        },

        /* Academic Eligibility */
        minPercentage: {
            type: Number,
            default: 60,
        },

        ielts: {
            type: String,
            enum: ["Required", "Waiver", "Not Required"],
            default: "Required",
        },

        /* Money */
        tuitionFee: {
            type: Number,
            default: 0,
        },

        applicationFee: {
            type: Number,
            default: 0,
        },

        showMoney: {
            type: Number,
            default: 0,
        },

        freeEducation: {
            type: Boolean,
            default: false,
        },

        /* Visa / PR */
        schengen: {
            type: Boolean,
            default: false,
        },

        prChance: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },

        stayBackYears: {
            type: Number,
            default: 0,
        },

        /* Work */
        partTimeHours: {
            type: Number,
            default: 20,
        },

        /* Intake */
        intakes: {
            type: [String],
            default: [],
        },

        /* Admin */
        commissionPercent: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const University = mongoose.model("University", universitySchema);

export default University;
