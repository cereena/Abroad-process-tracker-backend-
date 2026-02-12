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
            intake,
            schengen,
            freeEducation,
            minRanking,
            minPartTime,
            maxApplicationFee,
            prChance,
            stayBack,
            showMoney,
        } = req.query;

        let filter = {};

        /* Budget */
        if (maxBudget) {
            filter.tuitionFee = { $lte: Number(maxBudget) };
        }

        /* Min Percentage */
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

        /* Intake */
        if (intake) {
            filter.intakes = { $in: [intake] };
        }

        /* Schengen */
        if (schengen !== undefined) {
            filter.schengen = schengen === "true";
        }

        /* Free Education */
        if (freeEducation !== undefined) {
            filter.freeEducation = freeEducation === "true";
        }

        /* Global Ranking */
        if (minRanking) {
            filter.globalRanking = { $lte: Number(minRanking) };
        }

        /* Part Time Hours */
        if (minPartTime) {
            filter.partTimeHours = { $gte: Number(minPartTime) };
        }

        /* Application Fee */
        if (maxApplicationFee) {
            filter.applicationFee = { $lte: Number(maxApplicationFee) };
        }

        /* PR Chance */
        if (prChance) {
            filter.prChance = prChance;
        }

        /* Stay Back */
        if (stayBack !== undefined) {
            filter.stayBack = stayBack === "true";
        }

        /* Show Money */
        if (showMoney) {
            filter.showMoney = { $lte: Number(showMoney) };
        }

        const universities = await University.find(filter).sort({
            createdAt: -1,
        });

        res.status(200).json(universities);
    } catch (err) {
        console.error("Get Universities Error:", err);
        res.status(500).json({ message: err.message });
    }
};

