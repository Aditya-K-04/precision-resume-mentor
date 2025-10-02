import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// Initialize Gemini client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the supported, lightweight Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// ✅ FIXED: Proper JSON cleaning function
function cleanJsonResponse(text) {
  try {
    console.log("Raw Gemini response:", text); // Debug log
    
    // Extract JSON from ```json ... ``` block if present
    const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i); 
    let candidate = fenced ? fenced[1].trim() : text.trim();
    
    // Remove any remaining backticks
    candidate = candidate.replace(/^```|```$/g, '').trim();
    
    return JSON.parse(candidate);
  } catch (err) {
    console.error("⚠️ Raw Gemini response was not valid JSON:", text);
    throw new Error("Failed to parse Gemini response as JSON");
  }
}

// Resume parsing with better prompt
export async function parseResume(text) {
  const prompt = `
You are a professional resume parser. Extract information from the resume text and return ONLY valid JSON without any markdown formatting.

Resume Text:
${text}

Return exactly this JSON structure with extracted data:
{
  "Name": "extracted name or empty string",
  "Email": "extracted email or empty string", 
  "Phone": "extracted phone or empty string",
  "Skills": ["skill1", "skill2", "skill3"],
  "Experience": [{"company": "company name", "role": "job title", "years": 2}],
  "Education": [{"institution": "school name", "degree": "degree name", "year": "graduation year"}]
}

IMPORTANT: Return ONLY the JSON object, no explanations, no markdown code blocks.
`.trim();

  try {
    const result = await model.generateContent(prompt);
    const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    const parsed = cleanJsonResponse(responseText);
    
    // Normalize field names to match your MongoDB schema
    return {
      name: parsed.Name || parsed.name || "",
      email: parsed.Email || parsed.email || "",
      phone: parsed.Phone || parsed.phone || "",
      skills: parsed.Skills || parsed.skills || [],
      experience: (parsed.Experience || parsed.experience || []).map(exp => ({
        company: exp.company || "",
        role: exp.role || "",
        years: typeof exp.years === 'number' ? exp.years : parseInt(exp.years) || 0
      })),
      education: (parsed.Education || parsed.education || []).map(edu => ({
        institution: edu.institution || "",
        degree: edu.degree || "",
        year: edu.year || ""
      }))
    };
  } catch (error) {
    console.error("❌ Gemini Parse Error:", error.message);
    throw error;
  }
}

// Skill gap analysis
export async function getSkillGapAnalysis(currentSkills, targetJob) {
  const prompt = `
You are an AI career assistant. Analyze the gap between current skills and job requirements.

Current Skills: ${JSON.stringify(currentSkills)}
Target Job: "${targetJob}"

Return ONLY this JSON format without markdown:
{
  "missingSkills": ["skill1", "skill2", "skill3"],
  "recommendations": ["Take course X", "Learn technology Y", "Practice Z"]
}
`.trim();

  try {
    const result = await model.generateContent(prompt);
    const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return cleanJsonResponse(responseText);
  } catch (error) {
    console.error("❌ Gemini Skill Gap Error:", error.message);
    throw error;
  }
}

console.log("🔑 GEMINI_API_KEY loaded:", process.env.GEMINI_API_KEY ? "Yes" : "No");