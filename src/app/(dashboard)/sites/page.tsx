'use client';

import { useState } from 'react';
import {
  Building2,
  Zap,
  PlusCircle,
  Search,
  Activity,
  MapPin,
  X,
  CheckCircle2
} from 'lucide-react';
import { useSites, Site } from '@/context';

export default function SitesPage() {
  const { sites, addSite, totalMeters } = useSites();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    state: string;
    type: Site['type'];
    discom: string;
    meters: number;
  }>({
    name: '',
    address: '',
    state: '',
    type: 'office',
    discom: '',
    meters: 1
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    const newSite: Site = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      address: formData.address,
      state: formData.state,
      type: formData.type as Site['type'],
      discom: formData.discom,
      meters: formData.meters,
      createdAt: new Date()
    };
    addSite(newSite);
    setFormData({
      name: '',
      address: '',
      state: '',
      type: 'office',
      discom: '',
      meters: 1
    });
    setShowAddModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sites-page">
      {/* Success Toast */}
      {showSuccess && (
        <div className="success-toast">
          <CheckCircle2 size={18} />
          <span>Site added successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Sites & Meters</h1>
          <p className="page-subtitle">Manage your locations and electricity connections</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <PlusCircle size={18} />
          Add Site
        </button>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-item">
          <Building2 size={20} className="stat-icon" />
          <div className="stat-content">
            <div className="stat-value">{sites.length}</div>
            <div className="stat-label">Sites</div>
          </div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <Activity size={20} className="stat-icon" />
          <div className="stat-content">
            <div className="stat-value">{sites.reduce((sum, s) => sum + s.meters, 0)}</div>
            <div className="stat-label">Meters</div>
          </div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <Zap size={20} className="stat-icon" />
          <div className="stat-content">
            <div className="stat-value">0 kWh</div>
            <div className="stat-label">Monthly Consumption</div>
          </div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-content">
            <div className="stat-value">₹0</div>
            <div className="stat-label">Monthly Cost</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-input">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="input"
            placeholder="Search sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select className="filter-select">
            <option>All Types</option>
            <option>Office</option>
            <option>Factory</option>
            <option>Warehouse</option>
            <option>Retail</option>
            <option>Residential</option>
          </select>
          <select className="filter-select">
            <option>All States</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {sites.length === 0 ? (
        <div className="card empty-state-card">
          <div className="empty-icon">
            <MapPin size={48} />
          </div>
          <h2>No Sites Added Yet</h2>
          <p>Add your first site to start organizing your electricity bills by location.</p>
          <button className="btn btn-primary btn-lg" onClick={() => setShowAddModal(true)}>
            <PlusCircle size={20} />
            Add Your First Site
          </button>
        </div>
      ) : (
        <div className="sites-grid">
          {filteredSites.map((site) => (
            <div key={site.id} className="site-card card card-interactive">
              <div className="site-header">
                <div className="site-icon">
                  <Building2 size={24} />
                </div>
              </div>
              <h3 className="site-name">{site.name}</h3>
              <div className="site-location">
                <MapPin size={14} />
                <span>{site.address}, {site.state}</span>
              </div>
              <div className="site-badges">
                <span className="badge badge-primary">{site.type}</span>
                <span className="badge badge-neutral">{site.discom}</span>
              </div>
              <div className="site-stats">
                <div className="site-stat">
                  <div className="site-stat-value">{site.meters}</div>
                  <div className="site-stat-label">Meters</div>
                </div>
                <div className="site-stat">
                  <div className="site-stat-value">0</div>
                  <div className="site-stat-label">kWh/month</div>
                </div>
                <div className="site-stat">
                  <div className="site-stat-value">₹0</div>
                  <div className="site-stat-label">Cost/month</div>
                </div>
              </div>
            </div>
          ))}
          <button className="add-site-card card" onClick={() => setShowAddModal(true)}>
            <PlusCircle size={32} />
            <span>Add New Site</span>
          </button>
        </div>
      )}

      {/* Add Site Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Site</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddSite}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="input-label">Site Name *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., Main Office"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">Address *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., 123 Business Park"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="input-label">State *</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., Maharashtra"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="input-label">Site Type</label>
                    <select
                      className="input"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as Site['type'] })}
                    >
                      <option value="office">Office</option>
                      <option value="factory">Factory</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="retail">Retail</option>
                      <option value="residential">Residential</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="input-label">DISCOM *</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., MSEDCL, BESCOM"
                      value={formData.discom}
                      onChange={(e) => setFormData({ ...formData, discom: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="input-label">Number of Meters</label>
                    <input
                      type="number"
                      className="input"
                      min="1"
                      value={formData.meters}
                      onChange={(e) => setFormData({ ...formData, meters: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <PlusCircle size={18} />
                  Add Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .sites-page {
          width: 100%;
          max-width: 100%;
        }

        .success-toast {
          position: fixed;
          top: var(--space-6);
          right: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-4) var(--space-6);
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-lg);
          color: var(--color-success-400);
          font-weight: 500;
          z-index: 1000;
          animation: slideIn 0.3s ease;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .page-header h1 {
          font-size: var(--text-3xl);
          margin-bottom: var(--space-1);
        }

        .page-subtitle {
          color: var(--color-neutral-400);
          font-size: var(--text-sm);
        }

        .summary-stats {
          display: flex;
          align-items: center;
          gap: var(--space-6);
          padding: var(--space-5) var(--space-6);
          background: var(--bg-glass);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-xl);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .stat-icon {
          color: var(--color-primary-400);
        }

        .stat-value {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--color-neutral-50);
        }

        .stat-label {
          font-size: var(--text-sm);
          color: var(--color-neutral-500);
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
        }

        .filters-bar {
          display: flex;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }

        .search-input {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 400px;
        }

        .search-input .input {
          padding-left: 44px;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-neutral-500);
        }

        .filter-group {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        .filter-select {
          padding: var(--space-3) var(--space-4);
          background: var(--bg-elevated);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          color: var(--color-neutral-300);
          font-size: var(--text-sm);
          min-width: 130px;
        }

        .empty-state-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: var(--space-16);
          min-height: 400px;
        }

        .empty-icon {
          width: 100px;
          height: 100px;
          background: rgba(139, 92, 246, 0.1);
          border-radius: var(--radius-2xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a78bfa;
          margin-bottom: var(--space-8);
        }

        .empty-state-card h2 {
          font-size: var(--text-2xl);
          margin-bottom: var(--space-4);
        }

        .empty-state-card p {
          color: var(--color-neutral-400);
          max-width: 450px;
          margin-bottom: var(--space-8);
        }

        .sites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-6);
        }

        .site-card {
          display: flex;
          flex-direction: column;
          padding: var(--space-6);
        }

        .site-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-4);
        }

        .site-icon {
          width: 48px;
          height: 48px;
          background: rgba(52, 114, 255, 0.15);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary-400);
        }

        .site-name {
          font-size: var(--text-lg);
          font-weight: 600;
          margin-bottom: var(--space-2);
        }

        .site-location {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
          margin-bottom: var(--space-4);
        }

        .site-badges {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-5);
          flex-wrap: wrap;
        }

        .site-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-elevated);
          border-radius: var(--radius-lg);
        }

        .site-stat {
          text-align: center;
        }

        .site-stat-value {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--color-neutral-100);
        }

        .site-stat-label {
          font-size: var(--text-xs);
          color: var(--color-neutral-500);
        }

        .add-site-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-4);
          padding: var(--space-6);
          color: var(--color-neutral-500);
          border: 2px dashed rgba(255, 255, 255, 0.1);
          min-height: 280px;
          transition: all var(--transition-base);
          cursor: pointer;
        }

        .add-site-card:hover {
          color: var(--color-primary-400);
          border-color: var(--color-primary-500);
          background: rgba(52, 114, 255, 0.05);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: var(--space-4);
          backdrop-filter: blur(4px);
        }

        .modal {
          background: var(--bg-secondary);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-6);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .modal-header h2 {
          font-size: var(--text-xl);
        }

        .close-btn {
          padding: var(--space-2);
          color: var(--color-neutral-500);
          border-radius: var(--radius-md);
          transition: all var(--transition-base);
        }

        .close-btn:hover {
          color: var(--color-neutral-100);
          background: rgba(255, 255, 255, 0.05);
        }

        .modal-body {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .input-label {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-neutral-300);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
          padding: var(--space-6);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .summary-stats {
            gap: var(--space-4);
          }

          .stat-divider {
            display: none;
          }

          .filters-bar {
            flex-direction: column;
          }

          .search-input {
            max-width: none;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
