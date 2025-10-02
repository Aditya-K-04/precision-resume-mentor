import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ResumeParser from './components/ResumeParser';
import SkillGapAnalysis from './components/SkillGapAnalysis';
import ChannelSuggestions from './components/ChannelSuggestions';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [resumeData, setResumeData] = useState(null);
  const [dashboardRefreshTrigger, setDashboardRefreshTrigger] = useState(0);

  const handleResumeUpload = (data) => {
    setResumeData(data);
    setCurrentView('skillgap');
    // Trigger dashboard refresh
    setDashboardRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 Precision Resume Mentor</h1>
        <nav className="nav-menu">
          <button 
            className={currentView === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={currentView === 'parser' ? 'active' : ''}
            onClick={() => setCurrentView('parser')}
          >
            Parse Resume
          </button>
          <button 
            className={currentView === 'skillgap' ? 'active' : ''}
            onClick={() => setCurrentView('skillgap')}
            disabled={!resumeData}
          >
            Skill Gap Analysis
          </button>
          <button
            className={currentView === 'videos' ? 'active' : ''}
            onClick={() => setCurrentView('videos')}
          >
            YouTube Suggestions
          </button>
        </nav>
      </header>

      <main className="App-main">
        {currentView === 'dashboard' && <Dashboard refreshTrigger={dashboardRefreshTrigger} />}
        {currentView === 'parser' && <ResumeParser onResumeUpload={handleResumeUpload} />}
        {currentView === 'skillgap' && <SkillGapAnalysis resumeData={resumeData} />}
        {currentView === 'videos' && <ChannelSuggestions />}
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 Precision Resume Mentor - AI-Powered Resume Analysis</p>
      </footer>
    </div>
  );
}

export default App;
