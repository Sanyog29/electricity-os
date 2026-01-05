'use client';

import { useState } from 'react';
import {
    CheckCircle2,
    AlertTriangle,
    Edit3,
    Save,
    X,
    Zap,
    IndianRupee,
    Calendar,
    Building2,
    Gauge,
    TrendingUp,
    AlertCircle,
    Info
} from 'lucide-react';
import { ExtractedBillData, InsightResponse } from '@/lib/gemini/client';

interface BillScanResultProps {
    extractedData: ExtractedBillData;
    insights: InsightResponse | null;
    confidence: number;
    warnings: string[];
    onConfirm: (data: ExtractedBillData) => void;
    onCancel: () => void;
}

export function BillScanResult({
    extractedData,
    insights,
    confidence,
    warnings,
    onConfirm,
    onCancel
}: BillScanResultProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<ExtractedBillData>(extractedData);

    const handleSave = () => {
        setIsEditing(false);
        onConfirm(editedData);
    };

    const updateField = (field: keyof ExtractedBillData, value: string | number) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
    };

    const confidenceLevel = confidence >= 0.9 ? 'high' : confidence >= 0.7 ? 'medium' : 'low';
    const confidenceColor = confidenceLevel === 'high' ? 'success' : confidenceLevel === 'medium' ? 'warning' : 'error';

    return (
        <div className="scan-result">
            {/* Confidence Banner */}
            <div className={`confidence-banner ${confidenceColor}`}>
                <div className="confidence-left">
                    {confidenceLevel === 'high' ? (
                        <CheckCircle2 size={20} />
                    ) : (
                        <AlertTriangle size={20} />
                    )}
                    <span>
                        AI Confidence: {Math.round(confidence * 100)}%
                        {confidenceLevel === 'high' && ' - Data looks accurate'}
                        {confidenceLevel === 'medium' && ' - Please verify the data'}
                        {confidenceLevel === 'low' && ' - Manual review recommended'}
                    </span>
                </div>
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
                <div className="warnings-section">
                    {warnings.map((warning, index) => (
                        <div key={index} className="warning-item">
                            <AlertCircle size={16} />
                            <span>{warning}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Extracted Data Grid */}
            <div className="data-section">
                <h3>Extracted Bill Data</h3>
                <div className="data-grid">
                    {/* Consumer Info */}
                    <div className="data-group">
                        <h4><Building2 size={16} /> Consumer Details</h4>
                        <div className="data-fields">
                            <DataField
                                label="Consumer Number"
                                value={editedData.consumerNumber}
                                isEditing={isEditing}
                                onChange={(v) => updateField('consumerNumber', v)}
                            />
                            <DataField
                                label="Meter Number"
                                value={editedData.meterNumber}
                                isEditing={isEditing}
                                onChange={(v) => updateField('meterNumber', v)}
                            />
                            <DataField
                                label="DISCOM"
                                value={editedData.discom}
                                isEditing={isEditing}
                                onChange={(v) => updateField('discom', v)}
                            />
                            <DataField
                                label="Tariff Category"
                                value={editedData.tariffCategory}
                                isEditing={isEditing}
                                onChange={(v) => updateField('tariffCategory', v)}
                            />
                        </div>
                    </div>

                    {/* Billing Period */}
                    <div className="data-group">
                        <h4><Calendar size={16} /> Billing Period</h4>
                        <div className="data-fields">
                            <DataField
                                label="Billing Period"
                                value={editedData.billingPeriod}
                                isEditing={isEditing}
                                onChange={(v) => updateField('billingPeriod', v)}
                            />
                            <DataField
                                label="Bill Date"
                                value={editedData.billDate}
                                isEditing={isEditing}
                                onChange={(v) => updateField('billDate', v)}
                            />
                            <DataField
                                label="Due Date"
                                value={editedData.dueDate}
                                isEditing={isEditing}
                                onChange={(v) => updateField('dueDate', v)}
                            />
                        </div>
                    </div>

                    {/* Consumption */}
                    <div className="data-group">
                        <h4><Zap size={16} /> Consumption</h4>
                        <div className="data-fields">
                            <DataField
                                label="Units Consumed"
                                value={editedData.unitsConsumed}
                                suffix="kWh"
                                isEditing={isEditing}
                                type="number"
                                onChange={(v) => updateField('unitsConsumed', Number(v))}
                            />
                            <DataField
                                label="Previous Reading"
                                value={editedData.previousReading}
                                isEditing={isEditing}
                                type="number"
                                onChange={(v) => updateField('previousReading', Number(v))}
                            />
                            <DataField
                                label="Current Reading"
                                value={editedData.currentReading}
                                isEditing={isEditing}
                                type="number"
                                onChange={(v) => updateField('currentReading', Number(v))}
                            />
                            <DataField
                                label="Max Demand"
                                value={editedData.maxDemand}
                                suffix="kVA"
                                isEditing={isEditing}
                                type="number"
                                onChange={(v) => updateField('maxDemand', Number(v))}
                            />
                        </div>
                    </div>

                    {/* Technical */}
                    <div className="data-group">
                        <h4><Gauge size={16} /> Technical Details</h4>
                        <div className="data-fields">
                            <DataField
                                label="Power Factor"
                                value={editedData.powerFactor}
                                isEditing={isEditing}
                                type="number"
                                onChange={(v) => updateField('powerFactor', Number(v))}
                                highlight={editedData.powerFactor > 0 && editedData.powerFactor < 0.9}
                            />
                            <DataField
                                label="Sanctioned Load"
                                value={editedData.sanctionedLoad}
                                suffix="kW"
                                isEditing={isEditing}
                                type="number"
                                onChange={(v) => updateField('sanctionedLoad', Number(v))}
                            />
                            <DataField
                                label="Contract Demand"
                                value={editedData.contractDemand}
                                suffix="kVA"
                                isEditing={isEditing}
                                type="number"
                                onChange={(v) => updateField('contractDemand', Number(v))}
                            />
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="data-group highlight">
                        <h4><IndianRupee size={16} /> Bill Amount</h4>
                        <div className="data-fields">
                            <DataField
                                label="Total Amount"
                                value={editedData.totalAmount}
                                prefix="₹"
                                isEditing={isEditing}
                                type="number"
                                onChange={(v) => updateField('totalAmount', Number(v))}
                                large
                            />
                        </div>
                        {editedData.lineItems.length > 0 && (
                            <div className="line-items">
                                <h5>Breakdown</h5>
                                {editedData.lineItems.map((item, index) => (
                                    <div key={index} className="line-item">
                                        <span>{item.description}</span>
                                        <span>₹{item.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            {insights && (
                <div className="insights-section">
                    <h3><TrendingUp size={18} /> AI Analysis</h3>

                    {/* Summary */}
                    <div className="insight-summary">
                        <Info size={18} />
                        <p>{insights.summary}</p>
                    </div>

                    {/* Key Insights */}
                    <div className="insight-list">
                        <h4>Key Insights</h4>
                        <ul>
                            {insights.insights.map((insight, index) => (
                                <li key={index}>
                                    <Zap size={14} />
                                    <span>{insight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Recommendations */}
                    <div className="recommendations-list">
                        <h4>Recommendations</h4>
                        <ul>
                            {insights.recommendations.map((rec, index) => (
                                <li key={index}>
                                    <CheckCircle2 size={14} />
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Savings & Risk */}
                    <div className="insight-metrics">
                        <div className={`metric-card savings`}>
                            <span className="metric-label">Potential Savings</span>
                            <span className="metric-value">₹{insights.potentialSavings.toLocaleString()}</span>
                        </div>
                        <div className={`metric-card risk-${insights.riskLevel}`}>
                            <span className="metric-label">Risk Level</span>
                            <span className="metric-value">{insights.riskLevel.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="actions">
                <button className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={18} />
                    {isEditing ? 'Save Changes' : 'Confirm & Save'}
                </button>
            </div>

            <style jsx>{`
                .scan-result {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-6);
                }

                .confidence-banner {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-4);
                    border-radius: var(--radius-lg);
                    font-size: var(--text-sm);
                }

                .confidence-banner.success {
                    background: rgba(16, 185, 129, 0.1);
                    color: var(--color-success-400);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }

                .confidence-banner.warning {
                    background: rgba(245, 158, 11, 0.1);
                    color: var(--color-warning-400);
                    border: 1px solid rgba(245, 158, 11, 0.3);
                }

                .confidence-banner.error {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--color-error-400);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }

                .confidence-left {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                }

                .warnings-section {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .warning-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-3);
                    background: rgba(245, 158, 11, 0.05);
                    border-radius: var(--radius-md);
                    color: var(--color-warning-400);
                    font-size: var(--text-sm);
                }

                .data-section h3,
                .insights-section h3 {
                    font-size: var(--text-lg);
                    margin-bottom: var(--space-4);
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                }

                .data-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--space-4);
                }

                .data-group {
                    background: var(--bg-glass);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: var(--radius-lg);
                    padding: var(--space-4);
                }

                .data-group.highlight {
                    grid-column: 1 / -1;
                    background: rgba(52, 114, 255, 0.05);
                    border-color: rgba(52, 114, 255, 0.2);
                }

                .data-group h4 {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: var(--text-sm);
                    color: var(--color-neutral-400);
                    margin-bottom: var(--space-3);
                }

                .data-fields {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--space-3);
                }

                .line-items {
                    margin-top: var(--space-4);
                    padding-top: var(--space-4);
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }

                .line-items h5 {
                    font-size: var(--text-sm);
                    color: var(--color-neutral-400);
                    margin-bottom: var(--space-2);
                }

                .line-item {
                    display: flex;
                    justify-content: space-between;
                    padding: var(--space-2) 0;
                    font-size: var(--text-sm);
                    color: var(--color-neutral-300);
                }

                .insights-section {
                    background: var(--bg-glass);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: var(--radius-lg);
                    padding: var(--space-6);
                }

                .insight-summary {
                    display: flex;
                    gap: var(--space-3);
                    padding: var(--space-4);
                    background: rgba(52, 114, 255, 0.05);
                    border-radius: var(--radius-md);
                    margin-bottom: var(--space-4);
                }

                .insight-summary p {
                    color: var(--color-neutral-200);
                    line-height: 1.6;
                }

                .insight-list,
                .recommendations-list {
                    margin-bottom: var(--space-4);
                }

                .insight-list h4,
                .recommendations-list h4 {
                    font-size: var(--text-sm);
                    color: var(--color-neutral-400);
                    margin-bottom: var(--space-2);
                }

                .insight-list ul,
                .recommendations-list ul {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .insight-list li,
                .recommendations-list li {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-2);
                    font-size: var(--text-sm);
                    color: var(--color-neutral-300);
                }

                .insight-list li :global(svg) {
                    color: var(--color-primary-400);
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .recommendations-list li :global(svg) {
                    color: var(--color-success-400);
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .insight-metrics {
                    display: flex;
                    gap: var(--space-4);
                }

                .metric-card {
                    flex: 1;
                    padding: var(--space-4);
                    border-radius: var(--radius-md);
                    text-align: center;
                }

                .metric-card.savings {
                    background: rgba(16, 185, 129, 0.1);
                }

                .metric-card.risk-low {
                    background: rgba(16, 185, 129, 0.1);
                }

                .metric-card.risk-medium {
                    background: rgba(245, 158, 11, 0.1);
                }

                .metric-card.risk-high {
                    background: rgba(239, 68, 68, 0.1);
                }

                .metric-label {
                    display: block;
                    font-size: var(--text-xs);
                    color: var(--color-neutral-400);
                    margin-bottom: var(--space-1);
                }

                .metric-value {
                    font-size: var(--text-xl);
                    font-weight: 700;
                    color: var(--color-neutral-100);
                }

                .metric-card.savings .metric-value {
                    color: var(--color-success-400);
                }

                .metric-card.risk-low .metric-value {
                    color: var(--color-success-400);
                }

                .metric-card.risk-medium .metric-value {
                    color: var(--color-warning-400);
                }

                .metric-card.risk-high .metric-value {
                    color: var(--color-error-400);
                }

                .actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: var(--space-4);
                    padding-top: var(--space-4);
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }

                @media (max-width: 768px) {
                    .data-grid {
                        grid-template-columns: 1fr;
                    }

                    .data-fields {
                        grid-template-columns: 1fr;
                    }

                    .insight-metrics {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
}

// Helper component for data fields
function DataField({
    label,
    value,
    isEditing,
    onChange,
    type = 'text',
    prefix,
    suffix,
    highlight,
    large
}: {
    label: string;
    value: string | number;
    isEditing: boolean;
    onChange: (value: string) => void;
    type?: 'text' | 'number';
    prefix?: string;
    suffix?: string;
    highlight?: boolean;
    large?: boolean;
}) {
    const displayValue = typeof value === 'number' && type === 'number'
        ? value.toLocaleString()
        : value;

    return (
        <div className={`data-field ${highlight ? 'highlight' : ''} ${large ? 'large' : ''}`}>
            <span className="field-label">{label}</span>
            {isEditing ? (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="field-input"
                />
            ) : (
                <span className="field-value">
                    {prefix}{displayValue}{suffix && ` ${suffix}`}
                </span>
            )}
            <style jsx>{`
                .data-field {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-1);
                }

                .data-field.highlight .field-value {
                    color: var(--color-warning-400);
                }

                .data-field.large .field-value {
                    font-size: var(--text-2xl);
                    font-weight: 700;
                    color: var(--color-primary-400);
                }

                .field-label {
                    font-size: var(--text-xs);
                    color: var(--color-neutral-500);
                }

                .field-value {
                    font-size: var(--text-sm);
                    color: var(--color-neutral-100);
                    font-weight: 500;
                }

                .field-input {
                    padding: var(--space-2);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: var(--radius-md);
                    background: var(--bg-elevated);
                    color: var(--color-neutral-100);
                    font-size: var(--text-sm);
                }

                .field-input:focus {
                    outline: none;
                    border-color: var(--color-primary-500);
                }
            `}</style>
        </div>
    );
}
