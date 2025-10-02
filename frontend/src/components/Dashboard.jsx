import React, { useState, useEffect } from 'react';
import { resumeService, testConnection } from '../services/api';

const Dashboard = ({ refreshTrigger }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkApiAndLoadData = async () => {
      setLoading(true);
      try {
        // Test API connection
        await testConnection();
        setApiStatus('connected');
        
        // Load resumes
        const resumeData = await resumeService.getAllResumes();
        setResumes(resumeData);
        console.log('📊 Dashboard loaded with', resumeData.length, 'resumes');
      } catch (error) {
        setApiStatus('disconnected');
        setError('Failed to connect to backend API');
        console.error('API connection failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkApiAndLoadData();
  }, [refreshTrigger]); // Refresh when trigger changes

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Dashboard</h2>
        <div className={`api-status ${apiStatus}`}>
          API Status: {apiStatus === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
          <small>Make sure your backend server is running on {process.env.REACT_APP_API_URL || 'http://localhost:5000'}</small>
        </div>
      )}

      <div className="stats-cards">
        <div className="stat-card">
          <h3>📄 Total Resumes</h3>
          <p className="stat-number">{resumes.length}</p>
        </div>
        
        <div className="stat-card">
          <h3>🎯 Recent Activity</h3>
          <p className="stat-number">{resumes.filter(r => {
            const created = new Date(r.createdAt);
            const today = new Date();
            return (today - created) < 24 * 60 * 60 * 1000;
          }).length}</p>
          <small>resumes today</small>
        </div>
        
        <div className="stat-card">
          <h3>🚀 Features</h3>
          <ul className="feature-list">
            <li>✅ Resume Parsing</li>
            <li>✅ Skill Gap Analysis</li>
            <li>✅ AI-Powered Insights</li>
          </ul>
        </div>
      </div>

      <div className="recent-resumes">
        <h3>📋 Recent Resumes</h3>
        {resumes.length === 0 ? (
          <div className="empty-state">
            <p>No resumes found. Upload your first resume to get started!</p>
          </div>
        ) : (
          <div className="resume-list">
            {resumes.slice(0, 5).map((resume) => (
              <div key={resume._id} className="resume-item">
                <div className="resume-info">
                  <h4>{resume.name || 'Unknown Name'}</h4>
                  <p>{resume.email || 'No email'}</p>
                  <small>Skills: {resume.skills?.join(', ') || 'None listed'}</small>
                </div>
                <div className="resume-meta">
                  <span className="date">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
