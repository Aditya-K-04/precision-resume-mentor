import React, { useState } from 'react';
import { resumeService } from '../services/api';

const ResumeParser = ({ onResumeUpload }) => {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);

  const sampleResume = `John Doe
Email: john.doe@example.com
Phone: (555) 123-4567

SKILLS:
JavaScript, React, Node.js, Python, MongoDB, Git, Docker

EXPERIENCE:
Software Engineer at Tech Corp (2022-2024)
- Developed full-stack web applications using MERN stack
- Collaborated with cross-functional teams on product development
- Implemented CI/CD pipelines for automated deployments

Junior Developer at StartupXYZ (2021-2022)
- Built responsive web interfaces using React and CSS
- Worked on RESTful API development with Node.js

EDUCATION:
Bachelor of Science in Computer Science
University of Technology, 2021`;

  const handleParseResume = async () => {
    if (!resumeText.trim()) {
      setError('Please enter resume text');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await resumeService.parseResume(resumeText);
      setParsedData(result);
      
      // Notify parent component
      if (onResumeUpload) {
        onResumeUpload(result);
      }
    } catch (error) {
      setError(error.message || 'Failed to parse resume');
      console.error('Resume parsing error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseSample = () => {
    setResumeText(sampleResume);
    setError(null);
    setParsedData(null);
  };

  const handleClear = () => {
    setResumeText('');
    setParsedData(null);
    setError(null);
  };

  return (
    <div className="resume-parser">
      <div className="parser-header">
        <h2>📄 Resume Parser</h2>
        <p>Paste your resume text below and let AI extract structured information</p>
      </div>

      <div className="parser-controls">
        <button onClick={handleUseSample} className="sample-btn">
          📋 Use Sample Resume
        </button>
        <button onClick={handleClear} className="clear-btn">
          🗑️ Clear
        </button>
      </div>

      <div className="parser-input">
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume text here..."
          rows={15}
          className="resume-input"
        />
        
        <div className="input-actions">
          <button 
            onClick={handleParseResume}
            disabled={loading || !resumeText.trim()}
            className="parse-btn"
          >
            {loading ? '🔄 Parsing...' : '🚀 Parse Resume'}
          </button>
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
          <p>AI is analyzing your resume...</p>
        </div>
      )}

      {parsedData && (
        <div className="parsed-results">
          <h3>✅ Parsed Results</h3>
          
          <div className="result-grid">
            <div className="result-section">
              <h4>👤 Personal Info</h4>
              <div className="info-item">
                <strong>Name:</strong> {parsedData.name || 'Not found'}
              </div>
              <div className="info-item">
                <strong>Email:</strong> {parsedData.email || 'Not found'}
              </div>
              <div className="info-item">
                <strong>Phone:</strong> {parsedData.phone || 'Not found'}
              </div>
            </div>

            <div className="result-section">
              <h4>🛠️ Skills ({parsedData.skills?.length || 0})</h4>
              <div className="skills-list">
                {parsedData.skills?.length > 0 ? (
                  parsedData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))
                ) : (
                  <p className="empty">No skills found</p>
                )}
              </div>
            </div>

            <div className="result-section">
              <h4>💼 Experience ({parsedData.experience?.length || 0})</h4>
              {parsedData.experience?.length > 0 ? (
                parsedData.experience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <strong>{exp.role || 'Unknown Role'}</strong>
                    <p>{exp.company || 'Unknown Company'}</p>
                    <small>{exp.years ? `${exp.years} years` : 'Duration not specified'}</small>
                  </div>
                ))
              ) : (
                <p className="empty">No experience found</p>
              )}
            </div>

            <div className="result-section">
              <h4>🎓 Education ({parsedData.education?.length || 0})</h4>
              {parsedData.education?.length > 0 ? (
                parsedData.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <strong>{edu.degree || 'Unknown Degree'}</strong>
                    <p>{edu.institution || 'Unknown Institution'}</p>
                    <small>{edu.year || 'Year not specified'}</small>
                  </div>
                ))
              ) : (
                <p className="empty">No education found</p>
              )}
            </div>
          </div>

          <div className="result-actions">
            <button 
              onClick={() => onResumeUpload && onResumeUpload(parsedData)}
              className="analyze-btn"
            >
              🎯 Analyze Skills Gap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeParser;