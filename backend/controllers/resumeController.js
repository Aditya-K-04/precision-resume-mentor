import Resume from "../models/Resume.js";

// Save resume data to MongoDB
export const addResume = async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();
    res.status(201).json({ message: "✅ Resume saved successfully", resume });
  } catch (error) {
    res.status(400).json({ message: "❌ Error saving resume", error: error.message });
  }
};

// Get all resumes
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching resumes", error: error.message });
  }
};
