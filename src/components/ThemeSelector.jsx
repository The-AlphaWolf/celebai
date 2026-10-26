import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown, Sparkles, Moon, Sun, Leaf, Zap, Crown } from 'lucide-react';

export const THEMES = [
  {
    id: 'cosmic',
    name: 'Cosmic Twilight',
    icon: Moon,
    previewColor: '#8B5CF6',
    accentColor: '#EC4899',
    badge: 'Default',
    mood: 'Obsidian, violet & magenta starlight'
  },
  {
    id: 'royal-gold',
    name: 'Champagne Royal',
    icon: Crown,
    previewColor: '#F59E0B',
    accentColor: '#D97706',
    badge: 'Luxury',
    mood: 'Velvet black & molten amber gold'
  },
  {
    id: 'emerald',
    name: 'Emerald Sanctuary',
    icon: Leaf,
    previewColor: '#10B981',
    accentColor: '#059669',
    badge: 'Organic',
    mood: 'Forest noir & luminous mint sage'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Synthwave',
    icon: Zap,
    previewColor: '#FF007F',
    accentColor: '#00F0FF',
    badge: 'Retro Neon',
    mood: 'Laser magenta, electric cyan & synthwave grid'
  },
  {
    id: 'aurora-light',
    name: 'Pearl Aurora',
    icon: Sun,
    previewColor: '#7C3AED',
    accentColor: '#D946EF',
    badge: 'High Contrast',
    mood: 'High-contrast ivory & royal amethyst'
  }
];

export default function ThemeSelector({ currentTheme, onSelectTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div className="theme-selector-dropdown" ref={dropdownRef}>
      <button 
        className="theme-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Visual Theme & Color Palette"
        aria-label="Change Theme"
      >
        <span 
          className="theme-dot" 
          style={{ 
            background: `linear-gradient(135deg, ${activeThemeObj.previewColor}, ${activeThemeObj.accentColor})` 
          }} 
        />
        <Palette size={14} className="theme-icon" />
        <span className="theme-active-name">{activeThemeObj.name}</span>
        <ChevronDown size={13} className={`theme-chevron ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div className="theme-menu glass-panel">
          <div className="theme-menu-header">
            <Sparkles size={13} className="header-sparkle" />
            <span>Select Design Theme</span>
          </div>

          <div className="theme-list">
            {THEMES.map((theme) => {
              const isSelected = theme.id === currentTheme;

              return (
                <button
                  key={theme.id}
                  className={`theme-option-row ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelectTheme(theme.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="theme-option-left">
                    <span 
                      className="option-swatch"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.previewColor}, ${theme.accentColor})` 
                      }} 
                    />
                    <div className="theme-text-block">
                      <div className="theme-name-row">
                        <span className="theme-name">{theme.name}</span>
                        {theme.badge && (
                          <span className="theme-badge-pill">{theme.badge}</span>
                        )}
                      </div>
                      <span className="theme-mood">{theme.mood}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="check-indicator">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .theme-selector-dropdown {
          position: relative;
        }

        .theme-trigger-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: var(--radius-pill);
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid var(--border-subtle);
          background: var(--bg-glass);
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }

        .theme-trigger-btn:hover {
          border-color: var(--border-medium);
          background: var(--bg-glass-hover);
          transform: translateY(-1px);
        }

        .theme-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
          flex-shrink: 0;
        }

        .theme-icon {
          color: var(--text-muted);
        }

        .theme-active-name {
          font-size: 0.78rem;
        }

        .theme-chevron {
          color: var(--text-muted);
          transition: transform var(--transition-fast);
        }

        .theme-chevron.rotate {
          transform: rotate(180deg);
        }

        .theme-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 310px;
          padding: 8px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
          z-index: 100;
          animation: popIn 150ms ease-out;
        }

        .theme-menu-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px 10px 12px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 4px;
        }

        .header-sparkle {
          color: var(--primary);
        }

        .theme-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .theme-option-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          border-radius: var(--radius-md);
          background: transparent;
          border: 1px solid transparent;
          text-align: left;
          transition: all var(--transition-fast);
          width: 100%;
        }

        .theme-option-row:hover {
          background: var(--bg-glass-hover);
          border-color: var(--border-subtle);
        }

        .theme-option-row.selected {
          background: rgba(255, 255, 255, 0.07);
          border-color: var(--border-medium);
        }

        .theme-option-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .option-swatch {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .theme-text-block {
          display: flex;
          flex-direction: column;
        }

        .theme-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .theme-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .theme-badge-pill {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: var(--radius-pill);
          background: var(--bg-glass);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .theme-mood {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 1px;
        }

        .check-indicator {
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes popIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .theme-active-name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
