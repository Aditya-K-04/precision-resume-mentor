import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import aiRoutes from "./routes/aiRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://precision-resume-mentor-6py3.vercel.app', // replace with actual deployed frontend URL
  credentials: true,
}));


app.get("/", (req, res) => {
  res.send("Go to /api/test");
});

// Routes
app.use("/api/test", testRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes); // ✅ FIXED: only aiRoutes here

console.log("🔑 AI Key:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Not Found ❌");

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
