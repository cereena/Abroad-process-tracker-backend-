import Enquiry from "../models/Enquiry.js";
import Notification from "../models/Notification.js";

export const createEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.create(req.body);

        await Notification.create({
            title: "New Student Enquiry",
            message: "A new student enquiry has been submitted",
            enquiryId: enquiry._id,
            forRole: "admin",
        });


        res.status(201).json({ message: "Enquiry created", enquiry });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
