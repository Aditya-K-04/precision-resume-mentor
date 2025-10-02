import axios from 'axios';

// Base URL from environment variable or fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Resume Services
export const resumeService = {
  // Parse resume text (automatically saves to DB)
  parseResume: async (text) => {
    try {
      const response = await api.post('/api/resumes/parse', { text });
      return response.data;
    } catch (error) {
      console.error('Error parsing resume:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to parse resume' };
    }
  },

  // Get all resumes
  getAllResumes: async () => {
    try {
      const response = await api.get('/api/resumes');
      return response.data;
    } catch (error) {
      console.error('Error fetching resumes:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch resumes' };
    }
  }
};

// AI Services
export const aiService = {
  // Skill gap analysis
  getSkillGapAnalysis: async (currentSkills, targetJob) => {
    try {
      const response = await api.post('/api/ai/skillgap', {
        currentSkills,
        targetJob
      });
      return response.data;
    } catch (error) {
      console.error('Error getting skill gap analysis:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to analyze skill gap' };
    }
  }
};

// Test API connection
export const testConnection = async () => {
  try {
    const response = await api.get('/api/test');
    return response.data;
  } catch (error) {
    console.error('API connection test failed:', error);
    throw error;
  }
};

export default api;
