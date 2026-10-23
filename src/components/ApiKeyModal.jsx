import React, { useState } from 'react';
import { X, Key, ExternalLink, Check, Sparkles, AlertCircle } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey } from '../config/gemini';

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const [keyInput, setKeyInput] = useState(getStoredApiKey() || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const cleanKey = keyInput.trim();
    if (cleanKey && cleanKey.length < 10) {
      setError('Key appears too short. Please verify your Google AI Studio API key.');
      return;
    }

    saveStoredApiKey(cleanKey);
    setSavedSuccess(true);
    setError('');
    setTimeout(() => {
      setSavedSuccess(false);
      onKeySaved();
      onClose();
    }, 700);
  };

  const handleClear = () => {
    saveStoredApiKey('');
    setKeyInput('');
    onKeySaved();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="key-icon-badge">
              <Key size={18} />
            </div>
            <div>
              <h3>Google Gemini API Key</h3>
              <p>Power live planning with Gemini 2.5 Flash</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body">
          <div className="info-box">
            <Sparkles size={16} className="info-sparkle" />
            <div className="info-text">
              <strong>Free Tier Supported!</strong> Obtain a free Gemini API key in 30 seconds from Google AI Studio. Your key is kept exclusively inside your browser storage.
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="apiKey">Enter Gemini API Key (AIza...)</label>
            <input
              id="apiKey"
              type="password"
              placeholder="Paste your Gemini API key here..."
              value={keyInput}
              onChange={(e) => {
                setKeyInput(e.target.value);
                setError('');
              }}
              autoFocus
            />
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <div className="key-helper-links">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="studio-link"
            >
              <span>Get a free API key at Google AI Studio</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div className="modal-footer">
            {keyInput && (
              <button type="button" className="btn-secondary" onClick={handleClear}>
                Clear
              </button>
            )}
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {savedSuccess ? (
                <>
                  <Check size={16} />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 100;
          animation: fadeIn 150ms ease-out;
        }

        .modal-card {
          width: 100%;
          max-width: 500px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .key-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: rgba(139, 92, 246, 0.15);
          color: #C4B5FD;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .modal-title-group h3 {
          font-size: 1.15rem;
          color: #FFF;
          margin-bottom: 2px;
        }

        .modal-title-group p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .btn-close {
          color: var(--text-muted);
          padding: 6px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .btn-close:hover {
          color: #FFF;
          background: rgba(255, 255, 255, 0.08);
        }

        .modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .info-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.25);
          border-radius: var(--radius-md);
        }

        .info-sparkle {
          color: #A78BFA;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-text {
          font-size: 0.82rem;
          color: #DDD6FE;
          line-height: 1.5;
        }

        .input-group label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .input-group input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          color: #FFF;
          font-size: 0.9rem;
          font-family: var(--font-mono);
          transition: border-color var(--transition-fast);
        }

        .input-group input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #F87171;
          font-size: 0.8rem;
        }

        .key-helper-links {
          display: flex;
          justify-content: flex-end;
        }

        .studio-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: #A78BFA;
          transition: color var(--transition-fast);
        }

        .studio-link:hover {
          color: #DDD6FE;
          text-decoration: underline;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
