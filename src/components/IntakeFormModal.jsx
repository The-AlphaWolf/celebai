import React, { useState } from 'react';
import { X, Sparkles, Wand2, Calendar, Users, DollarSign, MapPin, Heart, Cake } from 'lucide-react';

export default function IntakeFormModal({ isOpen, onClose, onGenerate, isGenerating }) {
  const [formData, setFormData] = useState({
    eventType: 'wedding',
    title: 'Emerald Garden Estate Wedding',
    date: '2026-11-20',
    guestCount: 120,
    budget: 22000,
    location: 'Coastal botanical sanctuary or glasshouse',
    theme: 'Earthy luxury, cascading foliage, warm amber lanterns',
    notes: 'Prioritize farm-to-table culinary stations, acoustic strings during vows, and an energetic late-night DJ.'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const applyPreset = (type) => {
    if (type === 'wedding') {
      setFormData({
        eventType: 'wedding',
        title: 'Sunset Vineyard & Tuscan Villa Wedding',
        date: '2026-10-18',
        guestCount: 135,
        budget: 32000,
        location: 'Rolling vineyard hills with al-fresco stone courtyard',
        theme: 'Tuscan rustic chic, olive branch garlands, terracotta & gold',
        notes: 'Includes woodfired pizza after-party and private wine tasting.'
      });
    } else if (type === 'birthday') {
      setFormData({
        eventType: 'birthday',
        title: 'Cyberpunk Neon Nights 25th Birthday',
        date: '2026-12-05',
        guestCount: 75,
        budget: 7000,
        location: 'Industrial warehouse loft with exposed brick and high ceilings',
        theme: 'Neon cyberpunk, vaporwave aesthetics, LED infinity tunnels',
        notes: 'Interactive retro arcade cabinets, custom craft cocktail bar, and bass-heavy DJ.'
      });
    } else {
      setFormData({
        eventType: 'community',
        title: 'Riverside Community Harvest & Maker Gala',
        date: '2026-09-26',
        guestCount: 350,
        budget: 16000,
        location: 'Historic Riverfront Park & Open-Air Amphitheater',
        theme: 'Zero-waste eco-festival, local artisan craft, indie acoustic stages',
        notes: 'Family-friendly interactive workshops, solar-powered sound stage, and food truck alley.'
      });
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="intake-icon-badge">
              <Sparkles size={18} />
            </div>
            <div>
              <h3>AI Event Architecture Studio</h3>
              <p>Configure parameters for Gemini 2.5 Flash to synthesize your master plan</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="preset-bar">
          <span className="preset-label">Quick Presets:</span>
          <button type="button" className="preset-btn" onClick={() => applyPreset('wedding')}>
            <Heart size={12} /> Tuscan Vineyard
          </button>
          <button type="button" className="preset-btn" onClick={() => applyPreset('birthday')}>
            <Cake size={12} /> Cyberpunk 25th
          </button>
          <button type="button" className="preset-btn" onClick={() => applyPreset('community')}>
            <Users size={12} /> Eco Harvest Fair
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Event Type Grid */}
          <div className="form-group">
            <label>Event Category</label>
            <div className="event-type-grid">
              <button
                type="button"
                className={`type-card ${formData.eventType === 'wedding' ? 'selected wedding' : ''}`}
                onClick={() => setFormData({ ...formData, eventType: 'wedding' })}
              >
                <div className="type-icon">💍</div>
                <div className="type-title">Wedding</div>
                <div className="type-desc">Ceremonies, banquets & receptions</div>
              </button>

              <button
                type="button"
                className={`type-card ${formData.eventType === 'birthday' ? 'selected birthday' : ''}`}
                onClick={() => setFormData({ ...formData, eventType: 'birthday' })}
              >
                <div className="type-icon">🎂</div>
                <div className="type-title">Birthday</div>
                <div className="type-desc">Milestones, surprise bashes & parties</div>
              </button>

              <button
                type="button"
                className={`type-card ${formData.eventType === 'community' ? 'selected community' : ''}`}
                onClick={() => setFormData({ ...formData, eventType: 'community' })}
              >
                <div className="type-icon">🎪</div>
                <div className="type-title">Community</div>
                <div className="type-desc">Festivals, fundraisers & block events</div>
              </button>
            </div>
          </div>

          {/* Title & Date */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="title">Event Name / Occasion</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Sofia & Liam's Sunset Vows"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Target Date</label>
              <div className="input-with-icon">
                <Calendar size={16} className="field-icon" />
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Guests & Budget */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="guestCount">
                <span>Guest Count</span>
                <span className="field-value-badge">{formData.guestCount} guests</span>
              </label>
              <div className="input-with-icon">
                <Users size={16} className="field-icon" />
                <input
                  id="guestCount"
                  type="number"
                  min="5"
                  max="5000"
                  step="5"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="budget">
                <span>Target Budget (USD)</span>
                <span className="field-value-badge">${formData.budget.toLocaleString()}</span>
              </label>
              <div className="input-with-icon">
                <DollarSign size={16} className="field-icon" />
                <input
                  id="budget"
                  type="number"
                  min="500"
                  max="500000"
                  step="500"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Location & Theme */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="location">Target Venue / Atmosphere</label>
              <div className="input-with-icon">
                <MapPin size={16} className="field-icon" />
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Botanical glasshouse or loft warehouse"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="theme">Aesthetic / Design Vibe</label>
              <input
                id="theme"
                type="text"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                placeholder="e.g. Modern bohemian with candlelight"
              />
            </div>
          </div>

          {/* Notes & Special Requests */}
          <div className="form-group">
            <label htmlFor="notes">Special Requirements, Culinary Preferences, & Moments</label>
            <textarea
              id="notes"
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Signature cocktails, gluten-free catering, live jazz trio, kid-friendly craft booth..."
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary btn-generate" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <div className="btn-spinner" />
                  <span>Synthesizing Plan with Gemini...</span>
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  <span>Generate Master Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-card {
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
        }

        .intake-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--primary-gradient);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preset-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
        }

        .preset-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        .preset-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .preset-btn:hover {
          color: #FFF;
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--border-medium);
        }

        .event-type-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 6px;
        }

        .type-card {
          padding: 14px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          text-align: left;
          transition: all var(--transition-fast);
        }

        .type-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--border-medium);
        }

        .type-card.selected.wedding {
          background: rgba(245, 158, 11, 0.12);
          border-color: var(--wedding-gold);
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.2);
        }

        .type-card.selected.birthday {
          background: rgba(244, 63, 94, 0.12);
          border-color: var(--birthday-coral);
          box-shadow: 0 0 16px rgba(244, 63, 94, 0.2);
        }

        .type-card.selected.community {
          background: rgba(99, 102, 241, 0.12);
          border-color: var(--community-violet);
          box-shadow: 0 0 16px rgba(99, 102, 241, 0.2);
        }

        .type-icon {
          font-size: 1.4rem;
          margin-bottom: 4px;
        }

        .type-title {
          font-weight: 700;
          color: #FFF;
          font-size: 0.95rem;
        }

        .type-desc {
          font-size: 0.72rem;
          color: var(--text-muted);
          line-height: 1.3;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .field-value-badge {
          color: #A78BFA;
          font-family: var(--font-mono);
          font-size: 0.8rem;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon input {
          padding-left: 38px;
        }

        .form-group input, .form-group textarea {
          width: 100%;
          padding: 10px 14px;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          color: #FFF;
          font-size: 0.88rem;
          transition: border-color var(--transition-fast);
        }

        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .btn-generate {
          padding: 12px 28px;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #FFF;
          border-radius: 50%;
          animation: spinSlow 0.8s linear infinite;
        }

        @media (max-width: 640px) {
          .event-type-grid {
            grid-template-columns: 1fr;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
