require("dotenv").config();
const cors = require("cors");

const express = require("express");
const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const progressRoutes = require("./routes/progressRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// Middleware FIRST
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173"
}));


// Connect DB
connectDB();

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/progress", progressRoutes);

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/student", studentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Study Abroad API running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});


