// routes/aiRoutes.js
import express from "express";
import { parseResume, getSkillGapAnalysis } from "../services/aiService.js";

const router = express.Router();

// ✅ Resume Parsing
router.post("/parse", async (req, res) => {
  try {
    const { text } = req.body;
    const result = await parseResume(text);
    res.json(result);
  } catch (error) {
    console.error("❌ Error parsing resume:", error.message);
    res.status(500).json({ message: "Error parsing resume", error: error.message });
  }
});

// ✅ Skill Gap Analysis
router.post("/skillgap", async (req, res) => {
  try {
    const { currentSkills, targetJob } = req.body;

    if (!currentSkills || !Array.isArray(currentSkills) || !targetJob) {
      return res.status(400).json({ message: "Provide currentSkills (array) and targetJob (string)" });
    }

    const result = await getSkillGapAnalysis(currentSkills, targetJob);
    res.json(result);
  } catch (error) {
    console.error("❌ Error in skill gap analysis:", error.message);
    res.status(500).json({ message: "Error in skill gap analysis", error: error.message });
  }
});

export default router;
