import React, { useState, useMemo } from 'react';
import { DollarSign, Plus, Trash2, PieChart, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function BudgetPlanner({ plan, onUpdateBudget }) {
  const [newCategory, setNewCategory] = useState({ name: '', allocated: '', color: '#8B5CF6' });
  const [showAddModal, setShowAddModal] = useState(false);

  const budgetItems = plan.budgetItems || [];
  const totalBudget = plan.budget || 0;
  
  // Memoized efficiency calculation for budget totals and CSS conic gradient
  const { totalAllocated, totalSpent, remainingBudget, allocationPercentage, donutBackground } = useMemo(() => {
    const allocated = budgetItems.reduce((acc, item) => acc + (Number(item.allocated) || 0), 0);
    const spent = budgetItems.reduce((acc, item) => acc + (Number(item.spent) || 0), 0);
    const remaining = totalBudget - allocated;
    const allocPct = totalBudget > 0 ? Math.min(100, Math.round((allocated / totalBudget) * 100)) : 0;

    const gradientStops = budgetItems.map((item, index, arr) => {
      const priorAllocated = arr.slice(0, index).reduce((acc, prev) => acc + (Number(prev.allocated) || 0), 0);
      const currAllocated = Number(item.allocated) || 0;
      const start = allocated > 0 ? (priorAllocated / allocated) * 100 : 0;
      const end = allocated > 0 ? ((priorAllocated + currAllocated) / allocated) * 100 : 0;
      return `${item.color || '#8B5CF6'} ${start}% ${end}%`;
    }).join(', ');

    return {
      totalAllocated: allocated,
      totalSpent: spent,
      remainingBudget: remaining,
      allocationPercentage: allocPct,
      donutBackground: gradientStops ? `conic-gradient(${gradientStops})` : 'rgba(255, 255, 255, 0.1)',
    };
  }, [budgetItems, totalBudget]);

  const handleUpdateItem = (id, field, value) => {
    const numValue = Number(value) || 0;
    const updated = budgetItems.map((item) => {
      if (item.id === id) {
        const newItem = { ...item, [field]: numValue };
        if (field === 'allocated' && totalBudget > 0) {
          newItem.percentage = Math.round((numValue / totalBudget) * 100);
        }
        return newItem;
      }
      return item;
    });
    onUpdateBudget(updated);
  };

  const handleDeleteItem = (id) => {
    const updated = budgetItems.filter((item) => item.id !== id);
    onUpdateBudget(updated);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim() || !newCategory.allocated) return;

    const allocatedNum = Number(newCategory.allocated) || 0;
    const newItem = {
      id: `b_${Date.now()}`,
      category: newCategory.name.trim(),
      allocated: allocatedNum,
      spent: 0,
      percentage: totalBudget > 0 ? Math.round((allocatedNum / totalBudget) * 100) : 10,
      color: newCategory.color
    };

    onUpdateBudget([...budgetItems, newItem]);
    setNewCategory({ name: '', allocated: '', color: '#8B5CF6' });
    setShowAddModal(false);
  };

  return (
    <div className="budget-planner-wrapper">
      {/* Top Stat Cards */}
      <div className="budget-stat-grid">
        <div className="stat-card glass-panel">
          <div className="stat-header">
            <span className="stat-label">Total Target Budget</span>
            <DollarSign size={16} className="stat-icon icon-purple" />
          </div>
          <div className="stat-value">${totalBudget.toLocaleString()}</div>
          <div className="stat-subtitle">Allocated: {allocationPercentage}% of cap</div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-header">
            <span className="stat-label">Committed / Spent</span>
            <TrendingUp size={16} className="stat-icon icon-emerald" />
          </div>
          <div className="stat-value text-emerald">${totalSpent.toLocaleString()}</div>
          <div className="stat-subtitle">Across {budgetItems.length} categories</div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-header">
            <span className="stat-label">Remaining Buffer</span>
            {remainingBudget >= 0 ? (
              <CheckCircle2 size={16} className="stat-icon icon-emerald" />
            ) : (
              <AlertTriangle size={16} className="stat-icon icon-danger" />
            )}
          </div>
          <div className={`stat-value ${remainingBudget >= 0 ? 'text-primary' : 'text-danger'}`}>
            ${Math.abs(remainingBudget).toLocaleString()}
          </div>
          <div className="stat-subtitle">
            {remainingBudget >= 0 ? 'Surplus unallocated reserve' : 'Over allocated budget target'}
          </div>
        </div>
      </div>

      {/* Main Budget Visualizer & Table */}
      <div className="budget-content-grid">
        {/* Left: Donut Chart & Visual Breakdown */}
        <div className="budget-chart-panel glass-panel">
          <div className="panel-title-row">
            <div className="panel-title-group">
              <PieChart size={18} className="panel-icon" />
              <h3>Visual Allocation</h3>
            </div>
            <span className="badge badge-emerald">Real-time</span>
          </div>

          <div className="donut-container">
            <div className="donut-circle" style={{ background: donutBackground }}>
              <div className="donut-hole">
                <span className="donut-amount">${totalAllocated.toLocaleString()}</span>
                <span className="donut-label">Allocated</span>
              </div>
            </div>
          </div>

          {/* Color Legend */}
          <div className="donut-legend">
            {budgetItems.map((item) => (
              <div key={item.id} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: item.color }} />
                <span className="legend-name">{item.category}</span>
                <span className="legend-pct">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detailed Category Table */}
        <div className="budget-table-panel glass-panel">
          <div className="panel-title-row">
            <div className="panel-title-group">
              <DollarSign size={18} className="panel-icon" />
              <h3>Category Line Items</h3>
            </div>
            <button className="btn-secondary btn-sm" onClick={() => setShowAddModal(true)}>
              <Plus size={14} /> Add Category
            </button>
          </div>

          <div className="budget-table-scroll">
            <table className="budget-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Share</th>
                  <th>Allocated</th>
                  <th>Spent</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {budgetItems.map((item) => {
                  const spentPct = item.allocated > 0 ? Math.round((item.spent / item.allocated) * 100) : 0;
                  const isOver = item.spent > item.allocated;

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="category-cell">
                          <span className="cat-indicator" style={{ backgroundColor: item.color }} />
                          <span className="cat-name">{item.category}</span>
                        </div>
                      </td>
                      <td>
                        <span className="pct-badge">{item.percentage}%</span>
                      </td>
                      <td>
                        <div className="amount-input-box">
                          <span>$</span>
                          <input
                            type="number"
                            value={item.allocated}
                            onChange={(e) => handleUpdateItem(item.id, 'allocated', e.target.value)}
                            min="0"
                            step="50"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="amount-input-box">
                          <span>$</span>
                          <input
                            type="number"
                            value={item.spent}
                            onChange={(e) => handleUpdateItem(item.id, 'spent', e.target.value)}
                            min="0"
                            step="50"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="progress-cell">
                          <div className="mini-progress-bar">
                            <div 
                              className={`mini-progress-fill ${isOver ? 'fill-danger' : ''}`}
                              style={{ 
                                width: `${Math.min(100, spentPct)}%`,
                                backgroundColor: isOver ? '#EF4444' : item.color 
                              }}
                            />
                          </div>
                          <span className={`progress-label ${isOver ? 'text-danger' : ''}`}>
                            {spentPct}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn-icon-danger"
                          onClick={() => handleDeleteItem(item.id)}
                          title="Remove category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card glass-panel" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Budget Category</h3>
            </div>
            <form onSubmit={handleAddCategory} className="modal-body">
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Late-night Food Truck, Lighting"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Allocated Amount (USD)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={newCategory.allocated}
                  onChange={(e) => setNewCategory({ ...newCategory, allocated: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category Color Tag</label>
                <div className="color-picker-row">
                  {['#F59E0B', '#F43F5E', '#8B5CF6', '#10B981', '#06B6D4', '#EC4899', '#3B82F6'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`color-swatch ${newCategory.color === c ? 'selected' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setNewCategory({ ...newCategory, color: c })}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .budget-planner-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .budget-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }

        .stat-card {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .stat-icon {
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .icon-purple {
          color: #A78BFA;
          background: rgba(139, 92, 246, 0.15);
        }

        .icon-emerald {
          color: #34D399;
          background: rgba(16, 185, 129, 0.15);
        }

        .icon-danger {
          color: #F87171;
          background: rgba(239, 68, 68, 0.15);
        }

        .stat-value {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .stat-subtitle {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .budget-content-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 20px;
        }

        .budget-chart-panel, .budget-table-panel {
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .panel-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .panel-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .panel-icon {
          color: var(--primary);
        }

        .panel-title-group h3 {
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        /* Donut Chart */
        .donut-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 16px 0 24px 0;
        }

        .donut-circle {
          width: 190px;
          height: 190px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);
          transition: transform var(--transition-normal);
        }

        .donut-circle:hover {
          transform: scale(1.03);
        }

        .donut-hole {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--bg-surface-elevated);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.6);
        }

        .donut-amount {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .donut-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .donut-legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
        }

        .legend-item {
          display: flex;
          align-items: center;
          font-size: 0.8rem;
          gap: 8px;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .legend-name {
          flex: 1;
          color: var(--text-secondary);
        }

        .legend-pct {
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 0.75rem;
        }

        /* Budget Table */
        .budget-table-scroll {
          overflow-x: auto;
        }

        .budget-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .budget-table th {
          text-align: left;
          padding: 10px 12px;
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          border-bottom: 1px solid var(--border-subtle);
        }

        .budget-table td {
          padding: 12px;
          border-bottom: 1px solid var(--border-subtle);
          vertical-align: middle;
        }

        .category-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cat-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .cat-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .pct-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
          background: rgba(255, 255, 255, 0.05);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .amount-input-box {
          display: inline-flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 4px 8px;
          color: var(--text-muted);
        }

        .amount-input-box input {
          width: 80px;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 0.85rem;
          padding-left: 4px;
        }

        .progress-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mini-progress-bar {
          width: 70px;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-pill);
          overflow: hidden;
        }

        .mini-progress-fill {
          height: 100%;
          border-radius: var(--radius-pill);
          transition: width var(--transition-normal);
        }

        .progress-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .btn-icon-danger {
          color: var(--text-muted);
          padding: 6px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .btn-icon-danger:hover {
          color: #F87171;
          background: rgba(239, 68, 68, 0.1);
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 0.78rem;
        }

        .color-picker-row {
          display: flex;
          gap: 8px;
          margin-top: 6px;
        }

        .color-swatch {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid transparent;
          transition: transform var(--transition-fast);
        }

        .color-swatch.selected {
          transform: scale(1.15);
          border-color: #FFF;
        }

        @media (max-width: 990px) {
          .budget-content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
