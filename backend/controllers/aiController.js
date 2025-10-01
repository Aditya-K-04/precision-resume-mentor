import { parseResume, getSkillGapAnalysis } from "../services/openaiService.js";

// Parse raw resume text into JSON
export const parseResumeController = async (req, res) => {
  try {
    const { text } = req.body;
    const parsed = await parseResume(text);
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: "❌ Error parsing resume", error: error.message });
  }
};

// Skill gap analysis
export const skillGapController = async (req, res) => {
  try {
    const { skills, job } = req.body;
    const analysis = await getSkillGapAnalysis(skills, job);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: "❌ Error analyzing skills", error: error.message });
  }
};
