import React, { useState } from 'react';
import { aiService } from '../services/api';

const SkillGapAnalysis = ({ resumeData }) => {
  const [targetJob, setTargetJob] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const popularJobs = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Machine Learning Engineer',
    'DevOps Engineer',
    'Product Manager',
    'UI/UX Designer',
    'Software Architect',
    'Cloud Engineer'
  ];

  const handleAnalyze = async () => {
    if (!targetJob.trim()) {
      setError('Please enter a target job title');
      return;
    }

    if (!resumeData?.skills || resumeData.skills.length === 0) {
      setError('No skills found in resume data. Please parse a resume first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await aiService.getSkillGapAnalysis(
        resumeData.skills,
        targetJob
      );
      setAnalysis(result);
    } catch (error) {
      setError(error.message || 'Failed to analyze skill gap');
      console.error('Skill gap analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (job) => {
    setTargetJob(job);
    setAnalysis(null);
    setError(null);
  };

  if (!resumeData) {
    return (
      <div className="skill-gap-analysis">
        <div className="empty-state">
          <h2>🎯 Skill Gap Analysis</h2>
          <p>Please parse a resume first to analyze skill gaps.</p>
          <div className="illustration">📄➡️🤖➡️📊</div>
        </div>
      </div>
    );
  }

  return (
    <div className="skill-gap-analysis">
      <div className="analysis-header">
        <h2>🎯 Skill Gap Analysis</h2>
        <p>Compare your skills with industry requirements for your target role</p>
      </div>

      <div className="current-profile">
        <h3>👤 Your Profile</h3>
        <div className="profile-info">
          <div className="profile-item">
            <strong>Name:</strong> {resumeData.name || 'Unknown'}
          </div>
          <div className="profile-item">
            <strong>Current Skills ({resumeData.skills?.length || 0}):</strong>
            <div className="current-skills">
              {resumeData.skills?.map((skill, index) => (
                <span key={index} className="skill-tag current">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="job-input-section">
        <h3>💼 Target Job</h3>
        
        <div className="popular-jobs">
          <p>Popular roles:</p>
          <div className="job-buttons">
            {popularJobs.map((job, index) => (
              <button
                key={index}
                onClick={() => handleJobSelect(job)}
                className={`job-btn ${targetJob === job ? 'selected' : ''}`}
              >
                {job}
              </button>
            ))}
          </div>
        </div>

        <div className="custom-job-input">
          <p>Or enter a custom job title:</p>
          <div className="input-group">
            <input
              type="text"
              value={targetJob}
              onChange={(e) => setTargetJob(e.target.value)}
              placeholder="e.g., Senior React Developer"
              className="job-input"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !targetJob.trim()}
              className="analyze-btn"
            >
              {loading ? '🔄 Analyzing...' : '🚀 Analyze Gap'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>AI is analyzing skill requirements for {targetJob}...</p>
        </div>
      )}

      {analysis && (
        <div className="analysis-results">
          <h3>📊 Analysis Results for "{targetJob}"</h3>
          
          <div className="results-grid">
            <div className="result-card missing-skills">
              <h4>🔍 Missing Skills ({analysis.missingSkills?.length || 0})</h4>
              {analysis.missingSkills?.length > 0 ? (
                <div className="skills-list">
                  {analysis.missingSkills.map((skill, index) => (
                    <span key={index} className="skill-tag missing">{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="no-gaps">🎉 Great! No significant skill gaps found.</p>
              )}
            </div>

            <div className="result-card recommendations">
              <h4>💡 Recommendations ({analysis.recommendations?.length || 0})</h4>
              {analysis.recommendations?.length > 0 ? (
                <ul className="recommendation-list">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="recommendation-item">
                      {rec}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-recommendations">No specific recommendations at this time.</p>
              )}
            </div>
          </div>

          <div className="skill-comparison">
            <h4>📈 Skill Match Analysis</h4>
            <div className="match-stats">
              <div className="stat-item">
                <span className="stat-label">Current Skills:</span>
                <span className="stat-value">{resumeData.skills?.length || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Missing Skills:</span>
                <span className="stat-value missing">{analysis.missingSkills?.length || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Match Rate:</span>
                <span className="stat-value">
                  {resumeData.skills?.length > 0 
                    ? Math.round((resumeData.skills.length / (resumeData.skills.length + (analysis.missingSkills?.length || 0))) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={() => setAnalysis(null)} className="new-analysis-btn">
              🔄 New Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapAnalysis;