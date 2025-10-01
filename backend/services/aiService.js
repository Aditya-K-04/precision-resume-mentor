// services/aiService.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); // ✅ make sure env variables are loaded

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Choose a lightweight + free-tier friendly model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Helper: clean AI response to safe JSON
function safeJSONParse(output) {
  try {
    // Remove markdown code blocks if present
    const cleaned = output.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("❌ Failed to parse JSON from AI response: " + err.message);
  }
}

/**
 * Parse resume text into structured JSON
 */
export async function parseResume(text) {
  const prompt = `
  You are an expert resume parser.
  Extract the following details from the text and return in JSON format:
  - Name
  - Email
  - Phone
  - Skills (list)
  - Experience (list with company, role, years)
  - Education (list with institution, degree, year)

  Resume Text:
  ${text}
  `;

  const result = await model.generateContent(prompt);
  const output =
    result.response.candidates[0].content.parts[0].text || "{}";

  return safeJSONParse(output);
}

/**
 * Suggest skill gap improvements
 */
export async function getSkillGapAnalysis(currentSkills, targetJob) {
  const prompt = `
  You are a career coach.
  The candidate has skills: ${currentSkills.join(", ")}.
  The target job is: ${targetJob}.
  Suggest:
  1. Missing skills
  2. Short description of why each is important
  Return in JSON format.
  `;

  const result = await model.generateContent(prompt);
  const output =
    result.response.candidates[0].content.parts[0].text || "{}";

  return safeJSONParse(output);
}
