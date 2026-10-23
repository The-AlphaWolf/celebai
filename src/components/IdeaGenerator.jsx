import React, { useState } from 'react';
import { Sparkles, Bookmark, BookmarkCheck, Plus, Trash2, Wand2, Lightbulb } from 'lucide-react';

export default function IdeaGenerator({ plan, onUpdateIdeas, onAskAiMoreIdeas, isGenerating }) {
  const [favorites, setFavorites] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIdea, setNewIdea] = useState({ category: 'Experiential', title: '', description: '' });

  const creativeIdeas = plan.creativeIdeas || [];

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteIdea = (id) => {
    const updated = creativeIdeas.filter((item) => item.id !== id);
    onUpdateIdeas(updated);
  };

  const handleAddIdea = (e) => {
    e.preventDefault();
    if (!newIdea.title.trim()) return;

    const newItem = {
      id: `c_${Date.now()}`,
      category: newIdea.category.trim() || 'Custom',
      title: newIdea.title.trim(),
      description: newIdea.description.trim()
    };

    onUpdateIdeas([...creativeIdeas, newItem]);
    setNewIdea({ category: 'Experiential', title: '', description: '' });
    setShowAddModal(false);
  };

  return (
    <div className="ideas-wrapper">
      {/* Control Header */}
      <div className="ideas-control-panel glass-panel">
        <div className="ideas-meta">
          <div className="idea-icon-badge">
            <Lightbulb size={20} />
          </div>
          <div>
            <h3>Signature Experiential Ideas</h3>
            <p>Bespoke creative concepts curated to leave a lasting impression on your guests</p>
          </div>
        </div>

        <div className="ideas-actions">
          <button 
            className="btn-primary btn-sm" 
            onClick={onAskAiMoreIdeas}
            disabled={isGenerating}
            title="Ask Gemini to brainstorm more unique ideas"
          >
            <Wand2 size={14} />
            <span>AI Brainstorm More</span>
          </button>

          <button className="btn-secondary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Concept
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="ideas-grid">
        {creativeIdeas.map((idea) => {
          const isFaved = Boolean(favorites[idea.id]);

          return (
            <div key={idea.id} className="idea-card glass-panel">
              <div className="idea-card-header">
                <span className="badge badge-idea-cat">{idea.category || 'Creative Concept'}</span>
                
                <div className="idea-actions">
                  <button 
                    className={`btn-fav ${isFaved ? 'is-fav' : ''}`}
                    onClick={() => toggleFavorite(idea.id)}
                    title={isFaved ? 'Saved to favorites' : 'Bookmark this idea'}
                  >
                    {isFaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  </button>

                  <button
                    className="btn-icon-danger"
                    onClick={() => handleDeleteIdea(idea.id)}
                    title="Remove concept"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <h4 className="idea-title">{idea.title}</h4>
              <p className="idea-description">{idea.description}</p>
            </div>
          );
        })}
      </div>

      {/* Add Custom Concept Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card glass-panel" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Signature Concept</h3>
            </div>
            <form onSubmit={handleAddIdea} className="modal-body">
              <div className="form-group">
                <label>Concept Title</label>
                <input
                  type="text"
                  placeholder="e.g. Sunset Gelato Cart with Espresso Shots"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="e.g. Culinary, Interactive Décor, Audio/Music"
                  value={newIdea.category}
                  onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description & Experience Details</label>
                <textarea
                  rows="4"
                  placeholder="Describe how guests interact with this feature and why it creates a memorable highlight..."
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .ideas-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ideas-control-panel {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .ideas-meta {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .idea-icon-badge {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .ideas-meta h3 {
          font-size: 1.15rem;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .ideas-meta p {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .ideas-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ideas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 18px;
        }

        .idea-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .idea-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-medium);
        }

        .idea-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .badge-idea-cat {
          background: rgba(139, 92, 246, 0.15);
          color: #DDD6FE;
          font-size: 0.72rem;
        }

        .idea-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-fav {
          color: var(--text-muted);
          padding: 6px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .btn-fav:hover {
          color: #F59E0B;
          background: rgba(245, 158, 11, 0.1);
        }

        .btn-fav.is-fav {
          color: #F59E0B;
        }

        .idea-title {
          font-size: 1.1rem;
          color: var(--text-primary);
          font-weight: 700;
        }

        .idea-description {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
