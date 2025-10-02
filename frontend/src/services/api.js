import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Resume Services
export const resumeService = {
  // Parse resume text
  parseResume: async (text) => {
    try {
      const response = await api.post('/ai/parse', { text });
      return response.data;
    } catch (error) {
      console.error('Error parsing resume:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to parse resume' };
    }
  },

  // Get all resumes
  getAllResumes: async () => {
    try {
      const response = await api.get('/resumes');
      return response.data;
    } catch (error) {
      console.error('Error fetching resumes:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch resumes' };
    }
  },

  // Save parsed resume to database
  saveResume: async (resumeData) => {
    try {
      const response = await api.post('/resumes/parse', { text: resumeData.text });
      return response.data;
    } catch (error) {
      console.error('Error saving resume:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to save resume' };
    }
  }
};

// AI Services
export const aiService = {
  // Skill gap analysis
  getSkillGapAnalysis: async (currentSkills, targetJob) => {
    try {
      const response = await api.post('/ai/skillgap', {
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
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('API connection test failed:', error);
    throw error;
  }
};

export default api;