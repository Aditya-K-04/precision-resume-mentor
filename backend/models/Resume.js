// models/Resume.js
import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  skills: [{ type: String }],
  experience: [{
    role: { type: String },
    company: { type: String },
    years: { type: String },
    description: { type: String }
  }],
  education: [{
    degree: { type: String },
    institution: { type: String },
    year: { type: String }
  }],
  originalText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Resume', ResumeSchema);
