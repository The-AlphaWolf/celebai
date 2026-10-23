import React, { useState } from 'react';
import { Users, Plus, CheckCircle, Clock, Trash2, Mail, Phone, DollarSign, Filter } from 'lucide-react';

export default function VendorChecklist({ plan, onUpdateVendors }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [newVendor, setNewVendor] = useState({
    category: 'Catering',
    name: '',
    contact: '',
    cost: '',
    status: 'To Research',
    priority: 'High',
    notes: ''
  });

  const vendors = plan.vendors || [];
  const bookedCount = vendors.filter((v) => v.status === 'Booked').length;
  const categories = ['all', ...new Set(vendors.map((v) => v.category))];

  const handleStatusChange = (id, newStatus) => {
    const updated = vendors.map((v) => (v.id === id ? { ...v, status: newStatus } : v));
    onUpdateVendors(updated);
  };

  const handleDeleteVendor = (id) => {
    const updated = vendors.filter((v) => v.id !== id);
    onUpdateVendors(updated);
  };

  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!newVendor.name.trim()) return;

    const newItem = {
      id: `v_${Date.now()}`,
      category: newVendor.category.trim(),
      name: newVendor.name.trim(),
      contact: newVendor.contact.trim() || 'Pending',
      cost: Number(newVendor.cost) || 0,
      status: newVendor.status,
      priority: newVendor.priority,
      notes: newVendor.notes.trim()
    };

    onUpdateVendors([...vendors, newItem]);
    setNewVendor({
      category: 'Catering',
      name: '',
      contact: '',
      cost: '',
      status: 'To Research',
      priority: 'High',
      notes: ''
    });
    setShowAddModal(false);
  };

  const filteredVendors = vendors.filter((v) => {
    if (filterCategory === 'all') return true;
    return v.category === filterCategory;
  });

  return (
    <div className="vendors-wrapper">
      {/* Top Stat & Control Bar */}
      <div className="vendors-control-panel glass-panel">
        <div className="vendor-stats-group">
          <div className="vendor-stat-item">
            <span className="vendor-stat-num">{bookedCount} / {vendors.length}</span>
            <span className="vendor-stat-label">Vendors Booked</span>
          </div>

          <div className="vendor-progress-container">
            <div className="vendor-progress-bar">
              <div 
                className="vendor-progress-fill" 
                style={{ width: `${vendors.length > 0 ? (bookedCount / vendors.length) * 100 : 0}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="vendors-filter-group">
          <div className="category-select-wrapper">
            <Filter size={14} className="filter-icon" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="cat-filter-select"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Vendor Categories' : c}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-secondary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Vendor
          </button>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="vendors-grid">
        {filteredVendors.map((vendor) => {
          const isBooked = vendor.status === 'Booked';

          return (
            <div key={vendor.id} className={`vendor-card glass-panel ${isBooked ? 'card-booked' : ''}`}>
              <div className="vendor-card-header">
                <div className="vendor-meta-tags">
                  <span className="badge badge-category">{vendor.category}</span>
                  <span className={`badge-priority priority-${(vendor.priority || 'medium').toLowerCase()}`}>
                    {vendor.priority} Priority
                  </span>
                </div>

                <button
                  className="btn-icon-danger"
                  onClick={() => handleDeleteVendor(vendor.id)}
                  title="Remove vendor"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <h4 className="vendor-name">{vendor.name}</h4>

              <div className="vendor-info-rows">
                <div className="vendor-info-row">
                  <span className="info-label">Contact / Lead:</span>
                  <span className="info-value text-contact">{vendor.contact || 'No contact saved'}</span>
                </div>

                <div className="vendor-info-row">
                  <span className="info-label">Estimated Fee:</span>
                  <span className="info-value text-cost">${(vendor.cost || 0).toLocaleString()} USD</span>
                </div>
              </div>

              {vendor.notes && (
                <div className="vendor-notes-box">
                  <p>{vendor.notes}</p>
                </div>
              )}

              {/* Status Selector Footer */}
              <div className="vendor-card-footer">
                <span className="status-label">Booking Status:</span>
                <select
                  value={vendor.status}
                  onChange={(e) => handleStatusChange(vendor.id, e.target.value)}
                  className={`status-select ${vendor.status.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <option value="To Research">To Research</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quote Received">Quote Received</option>
                  <option value="Deposit Paid">Deposit Paid</option>
                  <option value="Booked">✓ Booked & Secured</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card glass-panel" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Vendor Checklist Item</h3>
            </div>
            <form onSubmit={handleAddVendor} className="modal-body">
              <div className="form-group">
                <label>Vendor or Service Role</label>
                <input
                  type="text"
                  placeholder="e.g. Lumina Cinema & Drone Studio"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Catering, Venue, DJ"
                    value={newVendor.category}
                    onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newVendor.priority}
                    onChange={(e) => setNewVendor({ ...newVendor, priority: e.target.value })}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Nice-to-have">Nice-to-have</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Contact Email / Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. booking@lumina.photo"
                    value={newVendor.contact}
                    onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Estimated Cost (USD)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2500"
                    value={newVendor.cost}
                    onChange={(e) => setNewVendor({ ...newVendor, cost: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contract Notes & Deliverables</label>
                <textarea
                  rows="3"
                  placeholder="Requires 50% deposit, vegetarian tasting, load-in at 2 PM..."
                  value={newVendor.notes}
                  onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .vendors-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .vendors-control-panel {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .vendor-stats-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .vendor-stat-num {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          color: #FFF;
          display: block;
        }

        .vendor-stat-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }

        .vendor-progress-container {
          width: 140px;
        }

        .vendor-progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-pill);
          overflow: hidden;
        }

        .vendor-progress-fill {
          height: 100%;
          background: #10B981;
          border-radius: var(--radius-pill);
          transition: width var(--transition-normal);
        }

        .vendors-filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .category-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .filter-icon {
          position: absolute;
          left: 10px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .cat-filter-select {
          padding: 6px 12px 6px 30px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.8rem;
        }

        .vendors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 18px;
        }

        .vendor-card {
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .vendor-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-medium);
        }

        .card-booked {
          border-color: rgba(16, 185, 129, 0.35);
        }

        .vendor-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .vendor-meta-tags {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .badge-category {
          background: rgba(139, 92, 246, 0.15);
          color: #DDD6FE;
          font-size: 0.72rem;
          padding: 2px 8px;
        }

        .badge-priority {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
        }

        .priority-critical {
          background: rgba(239, 68, 68, 0.15);
          color: #FCA5A5;
        }

        .priority-high {
          background: rgba(245, 158, 11, 0.15);
          color: #FDE68A;
        }

        .priority-medium {
          background: rgba(59, 130, 246, 0.15);
          color: #93C5FD;
        }

        .priority-nice-to-have {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-muted);
        }

        .vendor-name {
          font-size: 1.1rem;
          color: #FFF;
          font-weight: 700;
        }

        .vendor-info-rows {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.82rem;
        }

        .vendor-info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .info-label {
          color: var(--text-muted);
        }

        .info-value {
          font-weight: 600;
        }

        .text-cost {
          font-family: var(--font-mono);
          color: #34D399;
        }

        .text-contact {
          color: #C4B5FD;
        }

        .vendor-notes-box {
          background: rgba(0, 0, 0, 0.25);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.4;
          font-style: italic;
        }

        .vendor-card-footer {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .status-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .status-select {
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-medium);
          color: var(--text-primary);
        }

        .status-select.booked {
          background: rgba(16, 185, 129, 0.2);
          color: #A7F3D0;
          border-color: #10B981;
        }
      `}</style>
    </div>
  );
}
