// routes/resumeRoutes.js
import express from "express";
import { parseResume } from "../services/aiService.js";
import Resume from "../models/Resume.js";

const router = express.Router();

// ✅ POST - Parse Resume and Save to DB
router.post("/parse", async (req, res) => {
  try {
    const { text } = req.body;
    
    // Parse resume with AI
    const parsedData = await parseResume(text);
    
    // Add original text to parsed data
    const resumeToSave = {
      ...parsedData,
      originalText: text,
      createdAt: new Date()
    };

    // Save to MongoDB
    const resume = new Resume(resumeToSave);
    const savedResume = await resume.save();

    console.log("✅ Resume saved to MongoDB:", savedResume._id);
    res.json(savedResume);
  } catch (error) {
    console.error("❌ Error parsing/saving resume:", error);
    res.status(500).json({ 
      message: "❌ Error parsing resume", 
      error: error.message 
    });
  }
});

// ✅ GET - Fetch All Resumes
router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Error fetching resumes", 
      error: error.message 
    });
  }
});

export default router;
