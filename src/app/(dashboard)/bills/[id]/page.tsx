'use client';

import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Upload,
  PlusCircle,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  Download
} from 'lucide-react';
import { useBills } from '@/context';

export default function BillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { getBill } = useBills();
  const bill = getBill(resolvedParams.id);

  if (!bill) {
    return (
      <div className="bill-detail-page">
        <div className="page-header">
          <Link href="/bills" className="back-link">
            <ArrowLeft size={20} />
            <span>Back to Bills</span>
          </Link>
        </div>

        <div className="card empty-state">
          <div className="empty-icon">
            <FileText size={48} />
          </div>
          <h2>Bill Not Found</h2>
          <p>This bill doesn't exist or hasn't been uploaded yet. Upload a bill to see detailed analysis and audit results.</p>
          <Link href="/bills/upload" className="btn btn-primary btn-lg">
            <Upload size={20} />
            Upload a Bill
          </Link>
        </div>

        <style jsx>{`
          .bill-detail-page {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
          }

          .back-link {
            display: inline-flex;
            align-items: center;
            gap: var(--space-2);
            color: var(--color-neutral-400);
            font-size: var(--text-sm);
            margin-bottom: var(--space-8);
            transition: color var(--transition-base);
          }

          .back-link:hover {
            color: var(--color-neutral-100);
          }

          .empty-state {
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

          .empty-state h2 {
            font-size: var(--text-2xl);
            margin-bottom: var(--space-4);
          }

          .empty-state p {
            color: var(--color-neutral-400);
            max-width: 400px;
            margin-bottom: var(--space-8);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="bill-detail-page">
      {/* Header */}
      <div className="page-header">
        <Link href="/bills" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to Bills</span>
        </Link>

        <div className="header-content">
          <div className="header-info">
            <h1>{bill.site} - {bill.month}</h1>
            <div className="header-meta">
              <span className="meta-item">
                <FileText size={14} />
                {bill.fileName}
              </span>
              <span className="meta-item">
                <Calendar size={14} />
                Uploaded: {new Date(bill.uploadDate).toLocaleDateString('en-IN')}
              </span>
              <span className={`badge badge-${bill.insights.riskLevel === 'low' ? 'success' : bill.insights.riskLevel === 'medium' ? 'warning' : 'error'}`}>
                {bill.insights.riskLevel === 'low' ? 'Good' : bill.insights.riskLevel === 'medium' ? 'Needs Attention' : 'Issues Found'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon blue">
            <Zap size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Units Consumed</div>
            <div className="stat-value">{bill.unitsConsumed.toLocaleString()} kWh</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon purple">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Amount</div>
            <div className="stat-value">₹{bill.totalAmount.toLocaleString()}</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon green">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Potential Savings</div>
            <div className="stat-value savings">₹{bill.insights.potentialSavings.toLocaleString()}</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className={`stat-icon ${bill.insights.riskLevel}`}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Risk Level</div>
            <div className={`stat-value risk-${bill.insights.riskLevel}`}>
              {bill.insights.riskLevel.charAt(0).toUpperCase() + bill.insights.riskLevel.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      {(bill.maxDemand || bill.powerFactor) && (
        <div className="card details-card">
          <h3>Technical Details</h3>
          <div className="details-grid">
            {bill.maxDemand && (
              <div className="detail-item">
                <div className="detail-label">Max Demand</div>
                <div className="detail-value">{bill.maxDemand} kVA</div>
              </div>
            )}
            {bill.powerFactor && (
              <div className="detail-item">
                <div className="detail-label">Power Factor</div>
                <div className={`detail-value ${bill.powerFactor < 0.9 ? 'warning' : ''}`}>
                  {bill.powerFactor.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bill Image Preview */}
      {bill.fileUrl && (
        <div className="card bill-preview-card">
          <div className="card-header">
            <FileText size={20} />
            <h3>Original Bill</h3>
            <div className="preview-actions">
              <a
                href={bill.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <Download size={16} />
                View Original
              </a>
              <a
                href={bill.fileUrl}
                download={bill.fileName}
                className="btn btn-primary btn-sm"
              >
                <Download size={16} />
                Download
              </a>
            </div>
          </div>
          <div className="bill-preview">
            {bill.fileName.toLowerCase().endsWith('.pdf') ? (
              <div className="pdf-preview">
                <FileText size={64} />
                <p>PDF Document</p>
                <span className="file-name">{bill.fileName}</span>
              </div>
            ) : (
              <img
                src={bill.fileUrl}
                alt={`Bill for ${bill.site} - ${bill.month}`}
                className="bill-image"
              />
            )}
          </div>
        </div>
      )}

      {/* AI Summary */}
      <div className="card summary-card">
        <div className="card-header">
          <Sparkles size={20} />
          <h3>AI Summary</h3>
        </div>
        <p className="summary-text">{bill.insights.summary}</p>
      </div>

      {/* Insights */}
      <div className="card insights-card">
        <h3>Key Insights</h3>
        <ul className="insights-list">
          {bill.insights.insights.map((insight, index) => (
            <li key={index}>
              <Zap size={16} />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="card recommendations-card">
        <h3>Recommendations</h3>
        <ul className="recommendations-list">
          {bill.insights.recommendations.map((rec, index) => (
            <li key={index}>
              <CheckCircle2 size={16} />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="actions">
        <Link href="/bills/upload" className="btn btn-secondary">
          <Upload size={18} />
          Upload Another Bill
        </Link>
        <Link href="/bills" className="btn btn-primary">
          View All Bills
        </Link>
      </div>

      <style jsx>{`
        .bill-detail-page {
          width: 100%;
          max-width: 1000px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-neutral-400);
          font-size: var(--text-sm);
          margin-bottom: var(--space-4);
          transition: color var(--transition-base);
        }

        .back-link:hover {
          color: var(--color-neutral-100);
        }

        .page-header {
          margin-bottom: var(--space-8);
        }

        .header-info h1 {
          font-size: var(--text-2xl);
          margin-bottom: var(--space-3);
        }

        .header-meta {
          display: flex;
          align-items: center;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-5);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon.blue {
          background: rgba(52, 114, 255, 0.15);
          color: var(--color-primary-400);
        }

        .stat-icon.purple {
          background: rgba(139, 92, 246, 0.15);
          color: #a78bfa;
        }

        .stat-icon.green, .stat-icon.low {
          background: rgba(16, 185, 129, 0.15);
          color: var(--color-success-400);
        }

        .stat-icon.medium {
          background: rgba(245, 158, 11, 0.15);
          color: var(--color-warning-400);
        }

        .stat-icon.high {
          background: rgba(239, 68, 68, 0.15);
          color: var(--color-error-400);
        }

        .stat-label {
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
          margin-bottom: var(--space-1);
        }

        .stat-value {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--color-neutral-50);
        }

        .stat-value.savings {
          color: var(--color-success-400);
        }

        .stat-value.risk-low {
          color: var(--color-success-400);
        }

        .stat-value.risk-medium {
          color: var(--color-warning-400);
        }

        .stat-value.risk-high {
          color: var(--color-error-400);
        }

        .details-card, .summary-card, .insights-card, .recommendations-card {
          padding: var(--space-6);
          margin-bottom: var(--space-6);
        }

        .details-card h3, .insights-card h3, .recommendations-card h3 {
          margin-bottom: var(--space-4);
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }

        .detail-item {
          padding: var(--space-4);
          background: var(--bg-elevated);
          border-radius: var(--radius-lg);
        }

        .detail-label {
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
          margin-bottom: var(--space-2);
        }

        .detail-value {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--color-neutral-100);
        }

        .detail-value.warning {
          color: var(--color-warning-400);
        }

        .summary-card .card-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
        }

        .summary-card .card-header :global(svg) {
          color: var(--color-primary-400);
        }

        .summary-card h3 {
          margin: 0;
        }

        .summary-text {
          color: var(--color-neutral-300);
          line-height: 1.7;
        }

        .insights-list, .recommendations-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .insights-list li, .recommendations-list li {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-3);
          background: var(--bg-elevated);
          border-radius: var(--radius-lg);
        }

        .insights-list li :global(svg) {
          color: var(--color-warning-400);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .recommendations-list li :global(svg) {
          color: var(--color-success-400);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .insights-list li span, .recommendations-list li span {
          color: var(--color-neutral-300);
        }

        /* Bill Preview Card */
        .bill-preview-card .card-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .bill-preview-card .card-header h3 {
          flex: 1;
          margin: 0;
        }

        .preview-actions {
          display: flex;
          gap: var(--space-2);
        }

        .bill-preview {
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--bg-elevated);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bill-image {
          width: 100%;
          height: auto;
          max-height: 600px;
          object-fit: contain;
          display: block;
        }

        .pdf-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-12);
          text-align: center;
          color: var(--color-neutral-400);
        }

        .pdf-preview :global(svg) {
          color: var(--color-primary-400);
          margin-bottom: var(--space-4);
        }

        .pdf-preview p {
          font-size: var(--text-lg);
          font-weight: 500;
          color: var(--color-neutral-200);
          margin-bottom: var(--space-2);
        }

        .pdf-preview .file-name {
          font-size: var(--text-sm);
          color: var(--color-neutral-500);
          word-break: break-all;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: var(--space-4);
          padding: var(--space-6) 0;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions {
            flex-direction: column;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
