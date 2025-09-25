import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    skills: [{ type: String }],
    experience: [
      {
        company: String,
        role: String,
        years: Number,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        year: Number,
      },
    ],
    parsedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
