'use client';

import Link from 'next/link';
import {
  TrendingUp,
  IndianRupee,
  Zap,
  Building2,
  PlusCircle,
  FileText,
  Upload,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { useBills } from '@/context';

export default function DashboardPage() {
  const { bills, totalSavings, totalConsumption, totalCost } = useBills();
  const hasBills = bills.length > 0;

  // Get recent bills (last 5)
  const recentBills = bills.slice(0, 5);

  // Calculate alerts
  const alerts = bills.filter(b => b.insights.riskLevel === 'high' || b.insights.riskLevel === 'medium');

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Overview of your electricity portfolio</p>
        </div>
        <Link href="/bills/upload" className="btn btn-primary">
          <PlusCircle size={18} />
          Upload Bill
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Monthly Cost</span>
            <div className="kpi-icon" style={{ background: 'rgba(52, 114, 255, 0.15)' }}>
              <IndianRupee size={20} color="var(--color-primary-400)" />
            </div>
          </div>
          <div className="kpi-value">₹{totalCost.toLocaleString()}</div>
          <div className={`kpi-change ${hasBills ? 'neutral' : 'neutral'}`}>
            <span>{hasBills ? `From ${bills.length} bills` : 'No data yet'}</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Consumption</span>
            <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <Zap size={20} color="var(--color-success-400)" />
            </div>
          </div>
          <div className="kpi-value">{totalConsumption.toLocaleString()} kWh</div>
          <div className="kpi-change neutral">
            <span>{hasBills ? 'Across all sites' : 'No data yet'}</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Bills Analyzed</span>
            <div className="kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
              <FileText size={20} color="#a78bfa" />
            </div>
          </div>
          <div className="kpi-value">{bills.length}</div>
          <div className="kpi-change neutral">
            <span>{hasBills ? 'AI analyzed' : 'Upload your first bill'}</span>
          </div>
        </div>

        <div className="card kpi-card savings-card">
          <div className="kpi-header">
            <span className="kpi-label">Savings Identified</span>
            <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <TrendingUp size={20} color="var(--color-success-400)" />
            </div>
          </div>
          <div className="kpi-value savings">₹{totalSavings.toLocaleString()}</div>
          <div className="kpi-change neutral">
            <span>{hasBills ? 'Potential savings found' : 'Upload bills to find savings'}</span>
          </div>
        </div>
      </div>

      {/* Content depends on whether we have bills */}
      {!hasBills ? (
        /* Empty State Cards */
        <div className="empty-state-grid">
          <div className="card empty-state-card">
            <div className="empty-icon">
              <Upload size={48} />
            </div>
            <h3>Upload Your First Bill</h3>
            <p>Get started by uploading an electricity bill. Our AI will analyze it and provide insights.</p>
            <Link href="/bills/upload" className="btn btn-primary">
              <PlusCircle size={18} />
              Upload Bill
            </Link>
          </div>

          <div className="card empty-state-card">
            <div className="empty-icon site-icon">
              <Building2 size={48} />
            </div>
            <h3>Add Your First Site</h3>
            <p>Add a site or meter to organize your electricity bills and track consumption by location.</p>
            <Link href="/sites" className="btn btn-secondary">
              <PlusCircle size={18} />
              Add Site
            </Link>
          </div>
        </div>
      ) : (
        /* Dashboard with data */
        <div className="dashboard-grid">
          {/* Recent Bills */}
          <div className="card recent-bills-card">
            <div className="card-header">
              <h3>Recent Bills</h3>
              <Link href="/bills" className="view-all-link">View all</Link>
            </div>
            <div className="bills-list">
              {recentBills.map((bill) => (
                <Link key={bill.id} href={`/bills/${bill.id}`} className="bill-item">
                  <div className="bill-icon">
                    <FileText size={18} />
                  </div>
                  <div className="bill-info">
                    <div className="bill-site">{bill.site}</div>
                    <div className="bill-meta">{bill.month}</div>
                  </div>
                  <div className="bill-amount">₹{bill.totalAmount.toLocaleString()}</div>
                  <Eye size={16} className="bill-action" />
                </Link>
              ))}
            </div>
          </div>

          {/* Alerts & Insights */}
          <div className="card alerts-card">
            <div className="card-header">
              <h3>Alerts & Insights</h3>
            </div>
            {alerts.length === 0 ? (
              <div className="no-alerts">
                <CheckCircle2 size={32} />
                <p>All bills looking good!</p>
              </div>
            ) : (
              <div className="alerts-list">
                {alerts.slice(0, 3).map((bill) => (
                  <div key={bill.id} className={`alert-item ${bill.insights.riskLevel}`}>
                    <AlertTriangle size={18} />
                    <div className="alert-content">
                      <div className="alert-title">{bill.site} needs attention</div>
                      <div className="alert-desc">
                        Potential savings: ₹{bill.insights.potentialSavings.toLocaleString()}
                      </div>
                    </div>
                    <Link href={`/bills/${bill.id}`} className="btn btn-ghost btn-sm">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats for when we have data */}
      {hasBills && (
        <div className="bottom-row">
          <div className="card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions">
              <Link href="/bills/upload" className="quick-action">
                <Upload size={24} />
                <span>Upload Bill</span>
              </Link>
              <Link href="/sites" className="quick-action">
                <Building2 size={24} />
                <span>Manage Sites</span>
              </Link>
              <Link href="/bills" className="quick-action">
                <FileText size={24} />
                <span>View All Bills</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard {
          width: 100%;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-8);
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

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-6);
          margin-bottom: var(--space-6);
        }

        .kpi-card {
          padding: var(--space-6);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-4);
        }

        .kpi-label {
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
        }

        .kpi-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-value {
          font-size: var(--text-3xl);
          font-weight: 700;
          color: var(--color-neutral-50);
          margin-bottom: var(--space-2);
        }

        .kpi-value.savings {
          color: var(--color-success-400);
        }

        .kpi-change {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-sm);
        }

        .kpi-change.neutral {
          color: var(--color-neutral-500);
        }

        .empty-state-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-6);
          margin-bottom: var(--space-6);
        }

        .empty-state-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: var(--space-10);
          min-height: 300px;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: rgba(52, 114, 255, 0.1);
          border-radius: var(--radius-2xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary-400);
          margin-bottom: var(--space-6);
        }

        .empty-icon.site-icon {
          background: rgba(139, 92, 246, 0.1);
          color: #a78bfa;
        }

        .empty-state-card h3 {
          font-size: var(--text-xl);
          margin-bottom: var(--space-3);
        }

        .empty-state-card p {
          color: var(--color-neutral-400);
          margin-bottom: var(--space-6);
          max-width: 300px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: var(--space-6);
          margin-bottom: var(--space-6);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
          padding: var(--space-4) var(--space-6) 0;
        }

        .card-header h3 {
          font-size: var(--text-lg);
          font-weight: 600;
        }

        .view-all-link {
          color: var(--color-neutral-400);
          font-size: var(--text-sm);
          transition: color var(--transition-base);
        }

        .view-all-link:hover {
          color: var(--color-neutral-100);
        }

        .bills-list {
          padding: 0 var(--space-4) var(--space-4);
        }

        .bill-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          transition: background var(--transition-base);
        }

        .bill-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .bill-icon {
          width: 36px;
          height: 36px;
          background: rgba(52, 114, 255, 0.1);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary-400);
        }

        .bill-info {
          flex: 1;
        }

        .bill-site {
          font-weight: 500;
          color: var(--color-neutral-100);
          font-size: var(--text-sm);
        }

        .bill-meta {
          font-size: var(--text-xs);
          color: var(--color-neutral-500);
        }

        .bill-amount {
          font-weight: 600;
          color: var(--color-neutral-100);
          font-size: var(--text-sm);
        }

        .bill-action {
          color: var(--color-neutral-500);
        }

        .no-alerts {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-8);
          color: var(--color-success-400);
          text-align: center;
        }

        .no-alerts p {
          margin-top: var(--space-2);
          color: var(--color-neutral-400);
        }

        .alerts-list {
          padding: 0 var(--space-4) var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .alert-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          border-left: 3px solid;
        }

        .alert-item.medium {
          background: rgba(245, 158, 11, 0.1);
          border-color: var(--color-warning-500);
        }

        .alert-item.medium :global(svg:first-child) {
          color: var(--color-warning-400);
        }

        .alert-item.high {
          background: rgba(239, 68, 68, 0.1);
          border-color: var(--color-error-500);
        }

        .alert-item.high :global(svg:first-child) {
          color: var(--color-error-400);
        }

        .alert-content {
          flex: 1;
        }

        .alert-title {
          font-weight: 500;
          font-size: var(--text-sm);
          color: var(--color-neutral-100);
        }

        .alert-desc {
          font-size: var(--text-xs);
          color: var(--color-neutral-400);
        }

        .bottom-row .card {
          padding: var(--space-6);
        }

        .quick-actions {
          display: flex;
          gap: var(--space-4);
        }

        .quick-action {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-6);
          background: var(--bg-elevated);
          border-radius: var(--radius-lg);
          color: var(--color-neutral-400);
          transition: all var(--transition-base);
        }

        .quick-action:hover {
          color: var(--color-primary-400);
          background: rgba(52, 114, 255, 0.1);
        }

        .quick-action span {
          font-size: var(--text-sm);
        }

        @media (max-width: 1200px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .empty-state-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .quick-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
