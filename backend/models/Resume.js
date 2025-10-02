import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  skills: [String],
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
      year: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Resume", ResumeSchema);
