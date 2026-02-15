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

        partner: true,
        globalRanking: 45,
        globallyRecognized: true,

        courseName: "MSc Computer Science",
        degree: "Masters",
        stream: "Computer Science",

        minPercentage: 70,
        ielts: "Waiver",

        tuitionFee: 0,
        applicationFee: 75,
        showMoney: 11208,
        freeEducation: true,

        schengen: true,
        prChance: "High",
        stayBackYears: 2,

        partTimeHours: 20,

        intakes: ["October", "April"],

        commissionPercent: 10,
    },

    {
        universityName: "University of Toronto",
        country: "Canada",
        city: "Toronto",

        partner: true,
        globalRanking: 18,
        globallyRecognized: true,

        courseName: "MSc Data Science",
        degree: "Masters",
        stream: "Computer Science",

        minPercentage: 75,
        ielts: "Required",

        tuitionFee: 28000,
        applicationFee: 120,
        showMoney: 10000,
        freeEducation: false,

        schengen: false,
        prChance: "High",
        stayBackYears: 3,

        partTimeHours: 20,

        intakes: ["January", "September"],

        commissionPercent: 15,
    },

    {
        universityName: "University of Edinburgh",
        country: "UK",
        city: "Edinburgh",

        partner: false,
        globalRanking: 33,
        globallyRecognized: true,

        courseName: "BSc Information Technology",
        degree: "Bachelors",
        stream: "Engineering",

        minPercentage: 65,
        ielts: "Required",

        tuitionFee: 24000,
        applicationFee: 100,
        showMoney: 21000,
        freeEducation: false,

        schengen: false,
        prChance: "Medium",
        stayBackYears: 2,

        partTimeHours: 24,

        intakes: ["February", "July"],

        commissionPercent: 12,
    },

    {
        universityName: "Sorbonne University",
        country: "France",
        city: "Paris",

        partner: false,
        globalRanking: 72,
        globallyRecognized: true,

        courseName: "MA International Relations",
        degree: "Masters",
        stream: "Arts",

        minPercentage: 60,
        ielts: "Waiver",

        tuitionFee: 3500,
        applicationFee: 50,
        showMoney: 7500,
        freeEducation: false,

        schengen: true,
        prChance: "Medium",
        stayBackYears: 1,

        partTimeHours: 20,

        intakes: ["September"],

        commissionPercent: 8,
    },

    {
        universityName: "University of Warsaw",
        country: "Poland",
        city: "Warsaw",

        partner: true,
        globalRanking: 11,
        globallyRecognized: true,

        courseName: "MSc Artificial Intelligence",
        degree: "Masters",
        stream: "Computer Science",

        minPercentage: 80,
        ielts: "Required",

        tuitionFee: 22000,
        applicationFee: 90,
        showMoney: 18000,
        freeEducation: false,

        schengen: false,
        prChance: "High",
        stayBackYears: 2,

        partTimeHours: 16,

        intakes: ["August"],

        commissionPercent: 18,
    },
    {
        universityName: "RWTH Aachen University",
        country: "Germany",
        city: "Aachen",

        partner: true,
        globalRanking: 99,
        globallyRecognized: true,

        courseName: "MSc Mechanical Engineering",
        degree: "Masters",
        stream: "Engineering",

        minPercentage: 70,
        ielts: "Waiver",

        tuitionFee: 0,
        applicationFee: 75,
        showMoney: 11208,
        freeEducation: true,

        schengen: true,
        prChance: "High",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["October", "April"],

        commissionPercent: 10,
    },

    {
        universityName: "University of Hamburg",
        country: "Germany",
        city: "Hamburg",

        partner: false,
        globalRanking: 135,
        globallyRecognized: true,

        courseName: "MSc Data Science",
        degree: "Masters",
        stream: "Computer Science",

        minPercentage: 65,
        ielts: "Required",

        tuitionFee: 0,
        applicationFee: 80,
        showMoney: 11208,
        freeEducation: true,

        schengen: true,
        prChance: "High",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["October"],

        commissionPercent: 9,
    },

    {
        universityName: "University of Toronto",
        country: "Canada",
        city: "Toronto",

        partner: true,
        globalRanking: 18,
        globallyRecognized: true,

        courseName: "MSc Computer Science",
        degree: "Masters",
        stream: "Computer Science",

        minPercentage: 75,
        ielts: "Required",

        tuitionFee: 28000,
        applicationFee: 120,
        showMoney: 10000,
        freeEducation: false,

        schengen: false,
        prChance: "High",
        stayBackYears: 3,

        partTimeHours: 20,
        intakes: ["January", "September"],

        commissionPercent: 15,
    },

    {
        universityName: "York University",
        country: "Canada",
        city: "Toronto",

        partner: true,
        globalRanking: 456,
        globallyRecognized: true,

        courseName: "MBA",
        degree: "Masters",
        stream: "Business",

        minPercentage: 65,
        ielts: "Required",

        tuitionFee: 24000,
        applicationFee: 150,
        showMoney: 10000,
        freeEducation: false,

        schengen: false,
        prChance: "High",
        stayBackYears: 3,

        partTimeHours: 20,
        intakes: ["January", "September"],

        commissionPercent: 18,
    },

    {
        universityName: "University of Edinburgh",
        country: "UK",
        city: "Edinburgh",

        partner: false,
        globalRanking: 33,
        globallyRecognized: true,

        courseName: "MSc Artificial Intelligence",
        degree: "Masters",
        stream: "Computer Science",

        minPercentage: 70,
        ielts: "Required",

        tuitionFee: 26000,
        applicationFee: 100,
        showMoney: 21000,
        freeEducation: false,

        schengen: false,
        prChance: "Medium",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["September"],

        commissionPercent: 12,
    },

    {
        universityName: "University of Birmingham",
        country: "UK",
        city: "Birmingham",

        partner: true,
        globalRanking: 84,
        globallyRecognized: true,

        courseName: "MSc Cyber Security",
        degree: "Masters",
        stream: "Computer Science",

        minPercentage: 65,
        ielts: "Required",

        tuitionFee: 25000,
        applicationFee: 75,
        showMoney: 21000,
        freeEducation: false,

        schengen: false,
        prChance: "Medium",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["January", "September"],

        commissionPercent: 14,
    },

    {
        universityName: "Trinity College Dublin",
        country: "Ireland",
        city: "Dublin",

        partner: true,
        globalRanking: 81,
        globallyRecognized: true,

        courseName: "MSc Business Analytics",
        degree: "Masters",
        stream: "Business",

        minPercentage: 70,
        ielts: "Required",

        tuitionFee: 23000,
        applicationFee: 55,
        showMoney: 10000,
        freeEducation: false,

        schengen: false,
        prChance: "High",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["September"],

        commissionPercent: 15,
    },

    {
        universityName: "Dublin City University",
        country: "Ireland",
        city: "Dublin",

        partner: false,
        globalRanking: 471,
        globallyRecognized: true,

        courseName: "MSc Computing",
        degree: "Masters",
        stream: "Computer Science",

        minPercentage: 60,
        ielts: "Required",

        tuitionFee: 17000,
        applicationFee: 50,
        showMoney: 10000,
        freeEducation: false,

        schengen: false,
        prChance: "High",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["January", "September"],

        commissionPercent: 12,
    },

    {
        universityName: "Sorbonne University",
        country: "France",
        city: "Paris",

        partner: false,
        globalRanking: 72,
        globallyRecognized: true,

        courseName: "MSc International Business",
        degree: "Masters",
        stream: "Business",

        minPercentage: 60,
        ielts: "Waiver",

        tuitionFee: 3500,
        applicationFee: 50,
        showMoney: 7500,
        freeEducation: false,

        schengen: true,
        prChance: "Medium",
        stayBackYears: 1,

        partTimeHours: 20,
        intakes: ["September"],

        commissionPercent: 8,
    },

    {
        universityName: "University of Lyon",
        country: "France",
        city: "Lyon",

        partner: true,
        globalRanking: 194,
        globallyRecognized: true,

        courseName: "MSc Biotechnology",
        degree: "Masters",
        stream: "Science",

        minPercentage: 65,
        ielts: "Waiver",

        tuitionFee: 4500,
        applicationFee: 70,
        showMoney: 7500,
        freeEducation: false,

        schengen: true,
        prChance: "Medium",
        stayBackYears: 1,

        partTimeHours: 20,
        intakes: ["September"],

        commissionPercent: 9,
    },
    {
        universityName: "HEC Paris",
        country: "France",
        city: "Paris",

        partner: true,
        globalRanking: 30,
        globallyRecognized: true,

        courseName: "MSc Strategic Management",
        degree: "Masters",
        stream: "Business",

        minPercentage: 65,
        ielts: "Waiver",

        tuitionFee: 18000,
        applicationFee: 120,
        showMoney: 7500,
        freeEducation: false,

        schengen: true,
        prChance: "Medium",
        stayBackYears: 1,

        partTimeHours: 20,
        intakes: ["September"],

        commissionPercent: 12,
    },

    {
        universityName: "University College Dublin",
        country: "Ireland",
        city: "Dublin",

        partner: true,
        globalRanking: 171,
        globallyRecognized: true,

        courseName: "MSc Management",
        degree: "Masters",
        stream: "Business",

        minPercentage: 65,
        ielts: "Required",

        tuitionFee: 22000,
        applicationFee: 55,
        showMoney: 10000,
        freeEducation: false,

        schengen: false,
        prChance: "High",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["September", "January"],

        commissionPercent: 15,
    },

    {
        universityName: "University of Mannheim",
        country: "Germany",
        city: "Mannheim",

        partner: true,
        globalRanking: 140,
        globallyRecognized: true,

        courseName: "MSc Business Administration",
        degree: "Masters",
        stream: "Business",

        minPercentage: 70,
        ielts: "Waiver",

        tuitionFee: 0,
        applicationFee: 80,
        showMoney: 11208,
        freeEducation: true,

        schengen: true,
        prChance: "High",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["October"],

        commissionPercent: 10,
    },

    {
        universityName: "University of Leeds",
        country: "UK",
        city: "Leeds",

        partner: false,
        globalRanking: 75,
        globallyRecognized: true,

        courseName: "MSc International Business",
        degree: "Masters",
        stream: "Business",

        minPercentage: 65,
        ielts: "Required",

        tuitionFee: 24500,
        applicationFee: 100,
        showMoney: 21000,
        freeEducation: false,

        schengen: false,
        prChance: "Medium",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["September"],

        commissionPercent: 13,
    },

    {
        universityName: "Wilfrid Laurier University",
        country: "Canada",
        city: "Waterloo",

        partner: true,
        globalRanking: 641,
        globallyRecognized: true,

        courseName: "Master of Management Analytics",
        degree: "Masters",
        stream: "Business",

        minPercentage: 60,
        ielts: "Required",

        tuitionFee: 26000,
        applicationFee: 120,
        showMoney: 10000,
        freeEducation: false,

        schengen: false,
        prChance: "High",
        stayBackYears: 3,

        partTimeHours: 20,
        intakes: ["January", "September"],

        commissionPercent: 16,
    },

    {
        universityName: "ESCP Business School",
        country: "France",
        city: "Paris",

        partner: true,
        globalRanking: 25,
        globallyRecognized: true,

        courseName: "MSc Marketing & Creativity",
        degree: "Masters",
        stream: "Business",

        minPercentage: 65,
        ielts: "Waiver",

        tuitionFee: 21000,
        applicationFee: 130,
        showMoney: 7500,
        freeEducation: false,

        schengen: true,
        prChance: "Medium",
        stayBackYears: 1,

        partTimeHours: 20,
        intakes: ["September"],

        commissionPercent: 14,
    },

    {
        universityName: "NEOMA Business School",
        country: "France",
        city: "Reims",

        partner: false,
        globalRanking: 47,
        globallyRecognized: true,

        courseName: "MSc Finance",
        degree: "Masters",
        stream: "Business",

        minPercentage: 60,
        ielts: "Waiver",

        tuitionFee: 16000,
        applicationFee: 100,
        showMoney: 7500,
        freeEducation: false,

        schengen: true,
        prChance: "Medium",
        stayBackYears: 1,

        partTimeHours: 20,
        intakes: ["September"],

        commissionPercent: 11,
    },

    {
        universityName: "University of Cologne",
        country: "Germany",
        city: "Cologne",

        partner: true,
        globalRanking: 145,
        globallyRecognized: true,

        courseName: "MSc Management",
        degree: "Masters",
        stream: "Business",

        minPercentage: 70,
        ielts: "Waiver",

        tuitionFee: 0,
        applicationFee: 75,
        showMoney: 11208,
        freeEducation: true,

        schengen: true,
        prChance: "High",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["October"],

        commissionPercent: 10,
    },

    {
        universityName: "University of Strathclyde",
        country: "UK",
        city: "Glasgow",

        partner: false,
        globalRanking: 276,
        globallyRecognized: true,

        courseName: "MSc Business Analysis",
        degree: "Masters",
        stream: "Business",

        minPercentage: 60,
        ielts: "Required",

        tuitionFee: 21500,
        applicationFee: 80,
        showMoney: 21000,
        freeEducation: false,

        schengen: false,
        prChance: "Medium",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["September", "January"],

        commissionPercent: 13,
    },

    {
        universityName: "Maynooth University",
        country: "Ireland",
        city: "Maynooth",

        partner: true,
        globalRanking: 801,
        globallyRecognized: true,

        courseName: "MSc Strategy & Innovation",
        degree: "Masters",
        stream: "Business",

        minPercentage: 60,
        ielts: "Required",

        tuitionFee: 16000,
        applicationFee: 50,
        showMoney: 10000,
        freeEducation: false,

        schengen: false,
        prChance: "High",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["September"],

        commissionPercent: 14,
    },

    {
        universityName: "Brock University",
        country: "Canada",
        city: "St. Catharines",

        partner: true,
        globalRanking: 1001,
        globallyRecognized: true,

        courseName: "Master of Business Economics",
        degree: "Masters",
        stream: "Business",

        minPercentage: 60,
        ielts: "Required",

        tuitionFee: 21000,
        applicationFee: 120,
        showMoney: 10000,
        freeEducation: false,

        schengen: false,
        prChance: "High",
        stayBackYears: 3,

        partTimeHours: 20,
        intakes: ["January", "September"],

        commissionPercent: 17,
    },
    {
        universityName: "KEDGE Business School",
        country: "France",
        city: "Bordeaux",

        partner: true,
        globalRanking: 51,
        globallyRecognized: true,

        courseName: "MSc International Trade & Logistics",
        degree: "Masters",
        stream: "Business",

        minPercentage: 60,
        ielts: "Waiver",

        tuitionFee: 18500,
        applicationFee: 100,
        showMoney: 7500,
        freeEducation: false,

        schengen: true,
        prChance: "Medium",
        stayBackYears: 1,

        partTimeHours: 20,
        intakes: ["September"],

        commissionPercent: 12,
    },

    {
        universityName: "University of Manitoba",
        country: "Canada",
        city: "Winnipeg",

        partner: false,
        globalRanking: 351,
        globallyRecognized: true,

        courseName: "Master of Management",
        degree: "Masters",
        stream: "Business",

        minPercentage: 65,
        ielts: "Required",

        tuitionFee: 17000,
        applicationFee: 100,
        showMoney: 10000,
        freeEducation: false,

        schengen: false,
        prChance: "High",
        stayBackYears: 3,

        partTimeHours: 20,
        intakes: ["September", "January"],

        commissionPercent: 15,
    },

    {
        universityName: "University of Warsaw",
        country: "Poland",
        city: "Warsaw",

        partner: true,
        globalRanking: 308,
        globallyRecognized: true,

        courseName: "MSc Artificial Intelligence",
        degree: "Masters",
        stream: "Computer Science",

        minPercentage: 70,
        ielts: "Required",

        tuitionFee: 22000,
        applicationFee: 90,
        showMoney: 18000,
        freeEducation: false,

        schengen: true,
        prChance: "High",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["October"],

        commissionPercent: 18,
    },

    {
        universityName: "AGH University of Science and Technology",
        country: "Poland",
        city: "Krakow",

        partner: false,
        globalRanking: 490,
        globallyRecognized: true,

        courseName: "MSc Computer Engineering",
        degree: "Masters",
        stream: "Engineering",

        minPercentage: 65,
        ielts: "Required",

        tuitionFee: 20000,
        applicationFee: 80,
        showMoney: 18000,
        freeEducation: false,

        schengen: true,
        prChance: "Medium",
        stayBackYears: 2,

        partTimeHours: 20,
        intakes: ["October"],

        commissionPercent: 14,
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
