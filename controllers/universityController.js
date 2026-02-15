import University from "../models/University.js";

/*  CREATE (Admin / Seeder) */
export const createUniversity = async (req, res) => {
    try {
        const uni = await University.create(req.body);
        res.status(201).json(uni);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/*GET ALL (Public) */
export const getUniversities = async (req, res) => {
    try {
        const {
            maxBudget,
            minPercentage,
            country,
            degree,
            stream,
            schengen,
            freeEducation,
            ielts,
            intake,
            minRanking,
            partner,
            stayBackYears,
        } = req.query;

        let filter = {};

        /* Budget */
        if (maxBudget) {
            filter.tuitionFee = { $lte: Number(maxBudget) };
        }

        /* Percentage */
        if (minPercentage) {
            filter.minPercentage = { $lte: Number(minPercentage) };
        }

        /* Country */
        if (country) {
            filter.country = country;
        }

        /* Degree */
        if (degree) {
            filter.degree = degree;
        }

        /* Stream */
        if (stream) {
            filter.stream = stream;
        }

        /* IELTS */
        if (ielts) {
            filter.ielts = ielts;
        }

        /* Schengen */
        if (schengen !== undefined) {
            filter.schengen = schengen === "true";
        }

        /* Free Education */
        if (freeEducation !== undefined) {
            filter.freeEducation = freeEducation === "true";
        }

        /* Intake */
        if (intake) {
            filter.intakes = { $in: [intake] };
        }

        /* Ranking */
        if (minRanking) {
            filter.globalRanking = { $lte: Number(minRanking) };
        }

        /* Partner */
        if (partner !== undefined) {
            filter.partner = partner === "true";
        }

        /* Stay Back */
        if (stayBackYears) {
            filter.stayBackYears = { $gte: Number(stayBackYears) };
        }

        const universities = await University.find(filter).sort({
            globalRanking: 1,
        });

        res.json(universities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};


