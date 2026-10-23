import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

export default function TimelinePlanner({ plan, onUpdateTimeline }) {
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    phase: '1 Month Prior',
    title: '',
    time: 'Week -4',
    description: '',
    status: 'upcoming'
  });

  const timelineItems = plan.timeline || [];
  const completedCount = timelineItems.filter((t) => t.status === 'completed').length;
  const progressPct = timelineItems.length > 0 ? Math.round((completedCount / timelineItems.length) * 100) : 0;

  const handleToggleStatus = (id) => {
    const updated = timelineItems.map((item) => {
      if (item.id === id) {
        let nextStatus = 'upcoming';
        if (item.status === 'upcoming') nextStatus = 'in-progress';
        else if (item.status === 'in-progress') nextStatus = 'completed';
        else nextStatus = 'upcoming';
        return { ...item, status: nextStatus };
      }
      return item;
    });
    onUpdateTimeline(updated);
  };

  const handleDeleteItem = (id) => {
    const updated = timelineItems.filter((item) => item.id !== id);
    onUpdateTimeline(updated);
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestone.title.trim()) return;

    const newItem = {
      id: `t_${Date.now()}`,
      phase: newMilestone.phase.trim(),
      title: newMilestone.title.trim(),
      time: newMilestone.time.trim() || newMilestone.phase,
      description: newMilestone.description.trim(),
      status: newMilestone.status
    };

    onUpdateTimeline([...timelineItems, newItem]);
    setNewMilestone({ phase: '1 Month Prior', title: '', time: '', description: '', status: 'upcoming' });
    setShowAddModal(false);
  };

  const filteredItems = timelineItems.filter((item) => {
    if (filter === 'completed') return item.status === 'completed';
    if (filter === 'in-progress') return item.status === 'in-progress';
    if (filter === 'upcoming') return item.status === 'upcoming';
    return true;
  });

  return (
    <div className="timeline-planner-wrapper">
      {/* Timeline Controls & Progress */}
      <div className="timeline-control-panel glass-panel">
        <div className="timeline-progress-group">
          <div className="progress-meta">
            <span className="progress-title">Milestone Execution Progress</span>
            <span className="progress-stat-badge">{completedCount} of {timelineItems.length} Completed ({progressPct}%)</span>
          </div>
          <div className="timeline-progress-track">
            <div className="timeline-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="timeline-actions-group">
          <div className="filter-pill-group">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All ({timelineItems.length})
            </button>
            <button className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`} onClick={() => setFilter('in-progress')}>
              Active
            </button>
            <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>
              Completed
            </button>
          </div>

          <button className="btn-secondary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Milestone
          </button>
        </div>
      </div>

      {/* Vertical Phased Timeline */}
      <div className="timeline-track-container">
        <div className="vertical-timeline-line" />

        <div className="timeline-nodes-list">
          {filteredItems.map((item, index) => {
            const isDone = item.status === 'completed';
            const isActive = item.status === 'in-progress';

            return (
              <div key={item.id} className={`timeline-node-item ${item.status}`}>
                {/* Node Checkpoint Dot */}
                <button 
                  className={`node-status-dot ${isDone ? 'dot-done' : isActive ? 'dot-active' : 'dot-upcoming'}`}
                  onClick={() => handleToggleStatus(item.id)}
                  title={`Status: ${item.status}. Click to cycle.`}
                >
                  {isDone ? <Check size={14} /> : isActive ? <Clock size={13} /> : <span className="dot-index">{index + 1}</span>}
                </button>

                {/* Node Content Card */}
                <div className="timeline-card glass-panel">
                  <div className="node-card-header">
                    <div className="node-tag-group">
                      <span className="phase-badge">{item.phase || item.time}</span>
                      <span className={`status-pill ${item.status}`}>
                        {item.status === 'completed' ? 'Completed' : item.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                      </span>
                    </div>

                    <div className="node-actions">
                      <button
                        className="btn-status-toggle"
                        onClick={() => handleToggleStatus(item.id)}
                        title="Change milestone status"
                      >
                        {isDone ? 'Mark Active' : 'Mark Done'}
                      </button>
                      <button
                        className="btn-icon-danger"
                        onClick={() => handleDeleteItem(item.id)}
                        title="Delete milestone"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <h4 className={`node-title ${isDone ? 'line-through' : ''}`}>{item.title}</h4>
                  {item.description && <p className="node-description">{item.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card glass-panel" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Timeline Milestone</h3>
            </div>
            <form onSubmit={handleAddMilestone} className="modal-body">
              <div className="form-group">
                <label>Milestone Title</label>
                <input
                  type="text"
                  placeholder="e.g. Finalize Catering Tasting & Menu"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Phase / Horizon</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Months Prior, Day-of 03:00 PM"
                    value={newMilestone.phase}
                    onChange={(e) => setNewMilestone({ ...newMilestone, phase: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Initial Status</label>
                  <select
                    value={newMilestone.status}
                    onChange={(e) => setNewMilestone({ ...newMilestone, status: e.target.value })}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Instructions & Operational Details</label>
                <textarea
                  rows="3"
                  placeholder="Key deliverables, who is responsible, vendor dependencies..."
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .timeline-planner-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .timeline-control-panel {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .timeline-progress-group {
          flex: 1;
          min-width: 260px;
        }

        .progress-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .progress-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .progress-stat-badge {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: #A7F3D0;
          background: rgba(16, 185, 129, 0.12);
          padding: 2px 8px;
          border-radius: var(--radius-pill);
        }

        .timeline-progress-track {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-pill);
          overflow: hidden;
        }

        .timeline-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8B5CF6 0%, #10B981 100%);
          border-radius: var(--radius-pill);
          transition: width var(--transition-normal);
        }

        .timeline-actions-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filter-pill-group {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.04);
          padding: 3px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-subtle);
        }

        .filter-btn {
          padding: 4px 12px;
          border-radius: var(--radius-pill);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .filter-btn.active {
          background: rgba(255, 255, 255, 0.1);
          color: #FFF;
        }

        /* Vertical Timeline Track */
        .timeline-track-container {
          position: relative;
          padding: 10px 0 30px 24px;
        }

        .vertical-timeline-line {
          position: absolute;
          left: 39px;
          top: 24px;
          bottom: 24px;
          width: 2px;
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.5) 0%, rgba(255, 255, 255, 0.08) 100%);
        }

        .timeline-nodes-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .timeline-node-item {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          position: relative;
        }

        .node-status-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          z-index: 2;
          background: var(--bg-surface-elevated);
          border: 2px solid var(--border-medium);
          color: var(--text-muted);
          transition: all var(--transition-bounce);
        }

        .node-status-dot:hover {
          transform: scale(1.15);
        }

        .dot-done {
          background: #10B981;
          border-color: #34D399;
          color: #FFF;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
        }

        .dot-active {
          background: #8B5CF6;
          border-color: #C4B5FD;
          color: #FFF;
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
        }

        .dot-upcoming {
          background: var(--bg-surface);
          border-color: var(--border-medium);
        }

        .dot-index {
          font-size: 0.75rem;
          font-weight: 700;
          font-family: var(--font-mono);
        }

        .timeline-card {
          flex: 1;
          padding: 18px 22px;
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .timeline-card:hover {
          transform: translateX(4px);
          border-color: var(--border-medium);
        }

        .node-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .node-tag-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .phase-badge {
          font-size: 0.75rem;
          font-weight: 700;
          font-family: var(--font-mono);
          color: #DDD6FE;
          background: rgba(139, 92, 246, 0.15);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
        }

        .status-pill {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
        }

        .status-pill.completed {
          background: rgba(16, 185, 129, 0.15);
          color: #A7F3D0;
        }

        .status-pill.in-progress {
          background: rgba(139, 92, 246, 0.15);
          color: #C4B5FD;
        }

        .status-pill.upcoming {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-muted);
        }

        .node-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-status-toggle {
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .btn-status-toggle:hover {
          color: #FFF;
          background: rgba(255, 255, 255, 0.1);
        }

        .node-title {
          font-size: 1.05rem;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .node-title.line-through {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .node-description {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        select {
          width: 100%;
          padding: 10px 14px;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.88rem;
        }
      `}</style>
    </div>
  );
}
