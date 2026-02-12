import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
    {
        // University Info
        universityName: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            required: true,
        },

        city: String,

        ranking: Number,

        partner: {
            type: Boolean,
            default: false,
        },

        // Course Info
        courseName: {
            type: String,
            required: true,
        },

        degree: {
            type: String,
            enum: ["Bachelors", "Masters", "PhD", "Diploma"],
            required: true,
        },

        // Money
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

        // Visa / PR
        schengen: {
            type: Boolean,
            default: false,
        },

        prChance: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },

        stayBack: String,

        // Work
        partTimeHours: {
            type: Number,
            default: 20,
        },

        // Recognition
        globallyRecognized: {
            type: Boolean,
            default: true,
        },

        // Intake
        intakes: [String],

        // Admin
        commissionPercent: {
            type: Number,
            default: 0,
        },
        // Stream
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

        // Intake
        intakes: [String],

        // Stay Back
        stayBackYears: Number,

        // Work
        partTimeHours: Number,

        // Ranking
        globalRanking: Number,

    },
    {
        timestamps: true,
    }
);

const University = mongoose.model("University", universitySchema);

export default University;
