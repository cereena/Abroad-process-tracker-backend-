const express = require("express");
const router = express.Router();
const { registerStudent, loginStudent, getStudentDashboard } = require("../controllers/studentController");


router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/dashboard/:studentId", getStudentDashboard);

module.exports = router;
