import University from "../models/University.js";

/* GET ALL (Public with Filters) */
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

    if (maxBudget) filter.tuitionFee = { $lte: Number(maxBudget) };
    if (minPercentage) filter.minPercentage = { $lte: Number(minPercentage) };
    if (country) filter.country = country;
    if (degree) filter.degree = degree;
    if (stream) filter.stream = stream;
    if (ielts) filter.ielts = ielts;

    if (schengen !== undefined)
      filter.schengen = schengen === "true";

    if (freeEducation !== undefined)
      filter.freeEducation = freeEducation === "true";

    if (intake) filter.intakes = { $in: [intake] };

    if (minRanking)
      filter.globalRanking = { $lte: Number(minRanking) };

    if (partner !== undefined)
      filter.partner = partner === "true";

    if (stayBackYears)
      filter.stayBackYears = { $gte: Number(stayBackYears) };

    const universities = await University.find(filter).sort({
      globalRanking: 1,
    });

    res.json(universities);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
