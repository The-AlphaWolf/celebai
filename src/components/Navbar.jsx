import React from 'react';
import { Sparkles, Key, Download, Award, Heart, Cake, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import ThemeSelector from './ThemeSelector';

export default function Navbar({ 
  currentEventType, 
  onSelectEventType, 
  hasApiKey, 
  onOpenApiKeyModal, 
  onExportPdf,
  isGenerating,
  currentTheme,
  onSelectTheme
}) {
  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.1 }
    });
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand" onClick={triggerCelebration} title="CelebAI: Celebration & Event Planner">
          <div className="brand-icon-box">
            <Sparkles className="brand-sparkle" size={20} />
          </div>
          <div className="brand-text-group">
            <div className="brand-title">
              Celeb<span className="brand-highlight">AI</span>
            </div>
            <span className="brand-badge">PromptWars Edition</span>
          </div>
        </div>

        {/* Event Quick Mode Switcher */}
        <nav className="event-nav-pills" aria-label="Event Type">
          <button
            className={`event-pill-btn ${currentEventType === 'wedding' ? 'active wedding' : ''}`}
            onClick={() => onSelectEventType('wedding')}
          >
            <Heart size={15} />
            <span>Wedding</span>
          </button>

          <button
            className={`event-pill-btn ${currentEventType === 'birthday' ? 'active birthday' : ''}`}
            onClick={() => onSelectEventType('birthday')}
          >
            <Cake size={15} />
            <span>Birthday</span>
          </button>

          <button
            className={`event-pill-btn ${currentEventType === 'community' ? 'active community' : ''}`}
            onClick={() => onSelectEventType('community')}
          >
            <Users size={15} />
            <span>Community</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Theme Selector */}
          <ThemeSelector 
            currentTheme={currentTheme} 
            onSelectTheme={onSelectTheme} 
          />

          {/* Hackathon Credits Indicator */}
          <div className="credits-badge" title="Prompt Credits & Leaderboard Ready">
            <Award size={14} className="credits-icon" />
            <span>Gemini 2.5 Flash</span>
          </div>

          {/* API Key Status */}
          <button 
            className={`api-key-btn ${hasApiKey ? 'connected' : 'unconfigured'}`}
            onClick={onOpenApiKeyModal}
            title={hasApiKey ? 'Gemini API Key active' : 'Click to configure Google Gemini API Key'}
          >
            <Key size={14} />
            <span>{hasApiKey ? 'API Connected' : 'Demo / Add Key'}</span>
            <span className={`status-dot ${hasApiKey ? 'dot-active' : 'dot-demo'}`}></span>
          </button>

          {/* Export PDF Button */}
          <button 
            className="btn-export" 
            onClick={onExportPdf}
            disabled={isGenerating}
            title="Download complete event dossier as PDF"
          >
            <Download size={15} />
            <span className="export-text">Export Dossier</span>
          </button>
        </div>
      </div>

      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(9, 10, 18, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-subtle);
        }

        .navbar-container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }

        .brand-icon-box {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFF;
          box-shadow: 0 0 16px var(--primary-glow);
          transition: transform var(--transition-bounce);
        }

        .navbar-brand:hover .brand-icon-box {
          transform: rotate(12deg) scale(1.05);
        }

        .brand-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          display: flex;
          align-items: center;
        }

        .brand-highlight {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-badge {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          font-weight: 600;
          display: block;
          margin-top: -2px;
        }

        .event-nav-pills {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.04);
          padding: 4px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-subtle);
          gap: 4px;
        }

        .event-pill-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-pill);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .event-pill-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .event-pill-btn.active.wedding {
          background: rgba(245, 158, 11, 0.18);
          color: #FDE68A;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .event-pill-btn.active.birthday {
          background: rgba(244, 63, 94, 0.18);
          color: #FECDD3;
          border: 1px solid rgba(244, 63, 94, 0.4);
        }

        .event-pill-btn.active.community {
          background: rgba(99, 102, 241, 0.18);
          color: #C7D2FE;
          border: 1px solid rgba(99, 102, 241, 0.4);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .credits-badge {
          display: none;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: var(--radius-pill);
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.25);
          color: #DDD6FE;
          font-size: 0.75rem;
          font-weight: 600;
        }

        @media (min-width: 900px) {
          .credits-badge {
            display: flex;
          }
        }

        .api-key-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: var(--radius-pill);
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .api-key-btn:hover {
          border-color: var(--border-medium);
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-primary);
        }

        .api-key-btn.connected {
          border-color: rgba(16, 185, 129, 0.35);
          background: rgba(16, 185, 129, 0.08);
          color: #A7F3D0;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .dot-active {
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
        }

        .dot-demo {
          background: #F59E0B;
          box-shadow: 0 0 6px #F59E0B;
        }

        .btn-export {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-medium);
          color: var(--text-primary);
          font-size: 0.82rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .btn-export:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        .btn-export:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .event-nav-pills span {
            display: none;
          }
          .export-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
