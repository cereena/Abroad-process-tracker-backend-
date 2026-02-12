import mongoose from "mongoose";
import dotenv from "dotenv";
import University from "../models/University.js";
import connectDB from "../config/db.js";

dotenv.config();

await connectDB();

const universities = [
    {
        universityName: "Technical University of Munich",
        country: "Germany",
        city: "Munich",
        ranking: 45,
        partner: true,

        courseName: "MSc Computer Science",
        degree: "Masters",

        tuitionFee: 0,
        applicationFee: 75,
        showMoney: 11208,
        freeEducation: true,

        schengen: true,
        prChance: "High",
        stayBack: "18 Months",

        partTimeHours: 20,

        globallyRecognized: true,

        intakes: ["October", "April"],

        commissionPercent: 10,
    },

    {
        universityName: "University of Toronto",
        country: "Canada",
        city: "Toronto",
        ranking: 18,
        partner: true,

        courseName: "MSc Data Science",
        degree: "Masters",

        tuitionFee: 28000,
        applicationFee: 120,
        showMoney: 10000,
        freeEducation: false,

        schengen: false,
        prChance: "High",
        stayBack: "3 Years",

        partTimeHours: 20,

        globallyRecognized: true,

        intakes: ["January", "September"],

        commissionPercent: 15,
    },

    {
        universityName: "University of Melbourne",
        country: "Australia",
        city: "Melbourne",
        ranking: 33,
        partner: false,

        courseName: "BSc Information Technology",
        degree: "Bachelors",

        tuitionFee: 24000,
        applicationFee: 100,
        showMoney: 21000,
        freeEducation: false,

        schengen: false,
        prChance: "Medium",
        stayBack: "2 Years",

        partTimeHours: 24,

        globallyRecognized: true,

        intakes: ["February", "July"],

        commissionPercent: 12,
    },

    {
        universityName: "Sorbonne University",
        country: "France",
        city: "Paris",
        ranking: 72,
        partner: false,

        courseName: "MA International Relations",
        degree: "Masters",

        tuitionFee: 3500,
        applicationFee: 50,
        showMoney: 7500,
        freeEducation: false,

        schengen: true,
        prChance: "Medium",
        stayBack: "1 Year",

        partTimeHours: 20,

        globallyRecognized: true,

        intakes: ["September"],

        commissionPercent: 8,
    },
    {
        universityName: "Technical University of Munich",

        stream: "Computer Science",

        globalRanking: 45,

        intakes: ["October", "April"],

        stayBackYears: 2,

        partTimeHours: 20,
    }

];

const seedData = async () => {
    try {
        await University.deleteMany();
        await University.insertMany(universities);

        console.log(" Universities Seeded Successfully!");
        process.exit();
    } catch (err) {
        console.error(" Seeding Failed:", err);
        process.exit(1);
    }
};

seedData();
