import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config({ path: "./.env" });
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
import documentRoutes from "./routes/documentRoutes.js";
import cloudinary from "./config/cloudinary.js"; 
import universityRoutes from "./routes/universityRoutes.js";
import adminUniversityRoutes from "./routes/adminUniversityRoutes.js";


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
app.use("/api/universities", universityRoutes);
console.log("Student routes loaded");
app.use("/api/doc", docAuthRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/commissions", commissionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/doc-executives", docExecutiveRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/admin/universities", adminUniversityRoutes);



// Test route
app.get("/", (req, res) => {
  res.send("Study Abroad API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
