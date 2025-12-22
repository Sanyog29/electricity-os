'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  PlusCircle,
  Upload,
  Calendar,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { useBills, StoredBill } from '@/context';

export default function BillsPage() {
  const { bills, totalSavings, totalConsumption, totalCost } = useBills();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bills-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Bills</h1>
          <p className="page-subtitle">Manage and track your electricity bills</p>
        </div>
        <Link href="/bills/upload" className="btn btn-primary">
          <PlusCircle size={18} />
          Upload Bill
        </Link>
      </div>

      {/* Summary Stats */}
      {bills.length > 0 && (
        <div className="summary-stats">
          <div className="stat-item">
            <FileText size={20} className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{bills.length}</div>
              <div className="stat-label">Bills Analyzed</div>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <Zap size={20} className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{totalConsumption.toLocaleString()} kWh</div>
              <div className="stat-label">Total Consumption</div>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <TrendingUp size={20} className="stat-icon purple" />
            <div className="stat-content">
              <div className="stat-value">₹{totalCost.toLocaleString()}</div>
              <div className="stat-label">Total Cost</div>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <CheckCircle2 size={20} className="stat-icon green" />
            <div className="stat-content">
              <div className="stat-value savings">₹{totalSavings.toLocaleString()}</div>
              <div className="stat-label">Potential Savings</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar card">
        <div className="search-input">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="input"
            placeholder="Search by site or file name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="analyzed">Analyzed</option>
            <option value="audited">Audited</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {bills.length === 0 ? (
        <div className="card empty-state-card">
          <div className="empty-icon">
            <Upload size={48} />
          </div>
          <h2>No Bills Uploaded Yet</h2>
          <p>Upload your first electricity bill to get started. Our AI will automatically extract data and identify potential savings.</p>
          <div className="empty-actions">
            <Link href="/bills/upload" className="btn btn-primary btn-lg">
              <PlusCircle size={20} />
              Upload Your First Bill
            </Link>
          </div>
          <div className="supported-formats">
            <span>Supported formats:</span>
            <span className="format-badge">PDF</span>
            <span className="format-badge">JPG</span>
            <span className="format-badge">PNG</span>
          </div>
        </div>
      ) : (
        <div className="bills-list">
          {filteredBills.map((bill) => (
            <div key={bill.id} className="bill-card card card-interactive">
              <div className="bill-icon">
                <FileText size={24} />
              </div>
              <div className="bill-info">
                <div className="bill-header">
                  <h3 className="bill-site">{bill.site}</h3>
                  <span className={`badge badge-${bill.insights.riskLevel === 'low' ? 'success' : bill.insights.riskLevel === 'medium' ? 'warning' : 'error'}`}>
                    {bill.insights.riskLevel === 'low' ? 'Good' : bill.insights.riskLevel === 'medium' ? 'Attention' : 'Issues'}
                  </span>
                </div>
                <div className="bill-meta">
                  <span className="meta-item">
                    <Calendar size={14} />
                    {bill.month}
                  </span>
                  <span className="meta-item">
                    <FileText size={14} />
                    {bill.fileName}
                  </span>
                </div>
              </div>
              <div className="bill-stats">
                <div className="bill-stat">
                  <div className="bill-stat-value">{bill.unitsConsumed.toLocaleString()}</div>
                  <div className="bill-stat-label">kWh</div>
                </div>
                <div className="bill-stat">
                  <div className="bill-stat-value">₹{bill.totalAmount.toLocaleString()}</div>
                  <div className="bill-stat-label">Total</div>
                </div>
                <div className="bill-stat savings">
                  <div className="bill-stat-value">₹{bill.insights.potentialSavings.toLocaleString()}</div>
                  <div className="bill-stat-label">Savings</div>
                </div>
              </div>
              <Link href={`/bills/${bill.id}`} className="btn btn-secondary btn-sm view-btn">
                <Eye size={16} />
                View
              </Link>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .bills-page {
          width: 100%;
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

        .stat-icon.purple {
          color: #a78bfa;
        }

        .stat-icon.green {
          color: var(--color-success-400);
        }

        .stat-value {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--color-neutral-50);
        }

        .stat-value.savings {
          color: var(--color-success-400);
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
          padding: var(--space-4);
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
        }

        .filter-select {
          padding: var(--space-3) var(--space-4);
          background: var(--bg-elevated);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          color: var(--color-neutral-300);
          font-size: var(--text-sm);
          min-width: 140px;
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
          background: rgba(52, 114, 255, 0.1);
          border-radius: var(--radius-2xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary-400);
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

        .empty-actions {
          margin-bottom: var(--space-8);
        }

        .supported-formats {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-neutral-500);
          font-size: var(--text-sm);
        }

        .format-badge {
          padding: var(--space-1) var(--space-2);
          background: var(--bg-elevated);
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
        }

        .bills-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .bill-card {
          display: flex;
          align-items: center;
          gap: var(--space-5);
          padding: var(--space-5);
        }

        .bill-icon {
          width: 48px;
          height: 48px;
          background: rgba(52, 114, 255, 0.15);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary-400);
          flex-shrink: 0;
        }

        .bill-info {
          flex: 1;
          min-width: 0;
        }

        .bill-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
        }

        .bill-site {
          font-size: var(--text-lg);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bill-meta {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
        }

        .bill-stats {
          display: flex;
          gap: var(--space-6);
        }

        .bill-stat {
          text-align: center;
        }

        .bill-stat-value {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--color-neutral-100);
        }

        .bill-stat.savings .bill-stat-value {
          color: var(--color-success-400);
        }

        .bill-stat-label {
          font-size: var(--text-xs);
          color: var(--color-neutral-500);
        }

        .view-btn {
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .bill-stats {
            display: none;
          }
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
        }
      `}</style>
    </div>
  );
}
