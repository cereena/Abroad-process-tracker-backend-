import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Import Routes (Ensure all have .js extension)
import adminRoutes from "./routes/adminRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import docAuthRoutes from "./routes/docAuthRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import commissionRoutes from "./routes/commissionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import docExecutiveRoutes from "./routes/docExecutiveRoutes.js";


dotenv.config();

const app = express();

// Middleware
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
app.use("/api/doc", docAuthRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/commissions", commissionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/doc-executives", docExecutiveRoutes);




// Test route
app.get("/", (req, res) => {
  res.send("Study Abroad API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
