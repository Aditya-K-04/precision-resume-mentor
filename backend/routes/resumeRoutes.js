// routes/resumeRoutes.js
import express from "express";
import { parseResume } from "../services/aiService.js";
import Resume from "../models/Resume.js";

const router = express.Router();

// ✅ POST - Parse Resume
router.post("/parse", async (req, res) => {
  try {
    const { text } = req.body;
    const parsedData = await parseResume(text);

    // Save to DB
    const resume = new Resume(parsedData);
    await resume.save();

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: "❌ Error parsing resume", error: error.message });
  }
});

// ✅ GET - Fetch All Resumes
router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching resumes", error: error.message });
  }
});

export default router;
