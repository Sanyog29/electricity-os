'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Upload,
    FileText,
    X,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Loader2,
    Image as ImageIcon,
    Building2,
    Calendar,
    Sparkles,
    TrendingUp,
    AlertTriangle,
    Zap
} from 'lucide-react';
import { BillData, InsightResponse } from '@/lib/gemini/client';
import { useBills, StoredBill, useSites } from '@/context';

interface UploadedFile {
    id: string;
    file: File;
    preview?: string;
    status: 'pending' | 'uploading' | 'processing' | 'analyzing' | 'done' | 'error';
    progress: number;
    error?: string;
}

interface AnalysisResult {
    billData: BillData;
    insights: InsightResponse;
}

export default function BillUploadPage() {
    const router = useRouter();
    const { addBill } = useBills();
    const { sites } = useSites();
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [selectedSite, setSelectedSite] = useState('');
    const [billMonth, setBillMonth] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [showResults, setShowResults] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files));
        }
    };

    const addFiles = (newFiles: File[]) => {
        const validFiles = newFiles.filter(file => {
            const isValid = file.type === 'application/pdf' ||
                file.type.startsWith('image/');
            return isValid;
        });

        const uploadedFiles: UploadedFile[] = validFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            status: 'pending',
            progress: 0,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        }));

        setFiles(prev => [...prev, ...uploadedFiles]);
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        for (const file of files) {
            setFiles(prev => prev.map(f =>
                f.id === file.id ? { ...f, status: 'uploading' } : f
            ));

            // Simulate upload progress
            for (let i = 0; i <= 100; i += 20) {
                await new Promise(r => setTimeout(r, 100));
                setFiles(prev => prev.map(f =>
                    f.id === file.id ? { ...f, progress: i } : f
                ));
            }

            setFiles(prev => prev.map(f =>
                f.id === file.id ? { ...f, status: 'processing' } : f
            ));

            // Simulate processing delay
            await new Promise(r => setTimeout(r, 800));

            // Generate bill data (mock data for demo - real OCR requires valid API key)
            const billData: BillData = generateMockBillData();

            // Now analyze with AI
            setFiles(prev => prev.map(f =>
                f.id === file.id ? { ...f, status: 'analyzing' } : f
            ));

            // Simulate AI analysis delay
            await new Promise(r => setTimeout(r, 1000));

            try {
                // Generate smart mock insights based on bill data
                const insights: InsightResponse = generateMockInsights(billData);

                setAnalysisResult({ billData, insights });

                // Store the bill in context (and database if configured)
                const storedBill: StoredBill = {
                    id: file.id,
                    fileName: file.file.name,
                    uploadDate: new Date(),
                    site: billData.site,
                    month: billData.month,
                    totalAmount: billData.totalAmount,
                    unitsConsumed: billData.unitsConsumed,
                    maxDemand: billData.maxDemand,
                    powerFactor: billData.powerFactor,
                    status: 'analyzed',
                    insights
                };
                // Pass the actual file for database storage
                await addBill(storedBill, file.file);

                setFiles(prev => prev.map(f =>
                    f.id === file.id ? { ...f, status: 'done' } : f
                ));
            } catch (error) {
                setFiles(prev => prev.map(f =>
                    f.id === file.id ? { ...f, status: 'error', error: 'Analysis failed' } : f
                ));
            }
        }

        // Show results
        setTimeout(() => {
            setShowResults(true);
        }, 500);
    };

    const generateMockBillData = (): BillData => ({
        site: selectedSite || 'Main Office',
        month: billMonth || new Date().toISOString().slice(0, 7),
        totalAmount: Math.floor(Math.random() * 500000) + 50000,
        unitsConsumed: Math.floor(Math.random() * 50000) + 5000,
        maxDemand: Math.floor(Math.random() * 200) + 50,
        powerFactor: 0.85 + Math.random() * 0.1,
        lineItems: [
            { type: 'Energy Charge', amount: Math.floor(Math.random() * 300000) + 30000 },
            { type: 'Fixed Charge', amount: Math.floor(Math.random() * 50000) + 5000 },
            { type: 'Demand Charge', amount: Math.floor(Math.random() * 30000) + 3000 },
            { type: 'Electricity Duty', amount: Math.floor(Math.random() * 40000) + 4000 },
        ]
    });

    const generateMockInsights = (billData: BillData): InsightResponse => {
        const costPerUnit = billData.totalAmount / billData.unitsConsumed;
        const isHighCost = costPerUnit > 8;
        const isPoorPF = billData.powerFactor && billData.powerFactor < 0.9;
        const isHighDemand = billData.maxDemand && billData.maxDemand > 100;

        return {
            summary: `Your electricity bill for ${billData.month} shows consumption of ${billData.unitsConsumed.toLocaleString()} kWh with a total cost of ₹${billData.totalAmount.toLocaleString()}. ${isPoorPF ? 'Your power factor needs improvement to avoid penalties.' : 'Your power factor is within acceptable range.'} ${isHighCost ? 'Your per-unit cost is above average - consider tariff optimization.' : ''}`,
            insights: [
                `Monthly consumption: ${billData.unitsConsumed.toLocaleString()} kWh`,
                `Cost per unit: ₹${costPerUnit.toFixed(2)}/kWh`,
                billData.powerFactor ? `Power factor: ${billData.powerFactor.toFixed(2)} ${isPoorPF ? '(needs improvement)' : '(good)'}` : 'Power factor data not available',
                billData.maxDemand ? `Maximum demand: ${billData.maxDemand} kVA ${isHighDemand ? '(consider demand management)' : ''}` : 'Demand data not available',
            ],
            recommendations: [
                isPoorPF ? 'Install capacitor banks to improve power factor above 0.95' : 'Maintain current power factor levels',
                isHighDemand ? 'Implement demand-side management to reduce peak loads' : 'Monitor demand patterns for optimization',
                'Consider shifting high-load operations to off-peak hours',
                'Review your tariff category for potential cost savings',
                'Regular energy audits can identify additional savings'
            ],
            potentialSavings: Math.floor(billData.totalAmount * (isPoorPF ? 0.12 : 0.06)),
            riskLevel: isPoorPF && isHighDemand ? 'high' : (isPoorPF || isHighDemand ? 'medium' : 'low')
        };
    };

    const allDone = files.length > 0 && files.every(f => f.status === 'done');
    const hasFiles = files.length > 0;

    return (
        <div className="upload-page">
            {/* Header */}
            <div className="page-header">
                <Link href="/bills" className="back-link">
                    <ArrowLeft size={20} />
                    <span>Back to Bills</span>
                </Link>
                <h1>Upload Bills</h1>
                <p className="page-subtitle">Upload PDF or image files of your electricity bills for AI analysis</p>
            </div>

            {!showResults ? (
                <div className="upload-container">
                    {/* Upload Zone */}
                    <div
                        className={`upload-zone ${dragOver ? 'drag-over' : ''} ${hasFiles ? 'has-files' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-input')?.click()}
                    >
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            accept=".pdf,image/*"
                            onChange={handleFileInput}
                            style={{ display: 'none' }}
                        />
                        <div className="upload-icon">
                            <Upload size={48} />
                        </div>
                        <div className="upload-title">
                            Drop files here or click to upload
                        </div>
                        <div className="upload-subtitle">
                            Supports PDF and images (JPG, PNG). Max 10MB per file.
                        </div>
                        <div className="upload-formats">
                            <span className="format-badge">
                                <FileText size={14} /> PDF
                            </span>
                            <span className="format-badge">
                                <ImageIcon size={14} /> JPG
                            </span>
                            <span className="format-badge">
                                <ImageIcon size={14} /> PNG
                            </span>
                        </div>
                    </div>

                    {/* File List */}
                    {hasFiles && (
                        <div className="files-section">
                            <h3>Uploaded Files ({files.length})</h3>
                            <div className="files-list">
                                {files.map((file) => (
                                    <div key={file.id} className={`file-item ${file.status}`}>
                                        <div className="file-icon">
                                            {file.preview ? (
                                                <img src={file.preview} alt="" className="file-preview" />
                                            ) : (
                                                <FileText size={24} />
                                            )}
                                        </div>
                                        <div className="file-info">
                                            <div className="file-name">{file.file.name}</div>
                                            <div className="file-size">
                                                {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                            </div>
                                            {file.status === 'uploading' && (
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${file.progress}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="file-status">
                                            {file.status === 'pending' && (
                                                <span className="status-text">Ready</span>
                                            )}
                                            {file.status === 'uploading' && (
                                                <span className="status-text">{file.progress}%</span>
                                            )}
                                            {file.status === 'processing' && (
                                                <span className="status-processing">
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Processing
                                                </span>
                                            )}
                                            {file.status === 'analyzing' && (
                                                <span className="status-analyzing">
                                                    <Sparkles size={16} className="animate-pulse" />
                                                    AI Analyzing
                                                </span>
                                            )}
                                            {file.status === 'done' && (
                                                <span className="status-done">
                                                    <CheckCircle2 size={16} />
                                                    Done
                                                </span>
                                            )}
                                            {file.status === 'error' && (
                                                <span className="status-error">
                                                    <AlertCircle size={16} />
                                                    Error
                                                </span>
                                            )}
                                        </div>
                                        {file.status === 'pending' && (
                                            <button
                                                className="remove-btn"
                                                onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Options */}
                    {hasFiles && !allDone && (
                        <div className="options-section card">
                            <h3>Bill Details (Optional)</h3>
                            <div className="options-grid">
                                <div className="input-wrapper">
                                    <label className="input-label">
                                        <Building2 size={16} />
                                        Site
                                    </label>
                                    <select
                                        className="input"
                                        value={selectedSite}
                                        onChange={(e) => setSelectedSite(e.target.value)}
                                    >
                                        <option value="">Select a site or leave empty</option>
                                        {sites.map((site) => (
                                            <option key={site.id} value={site.name}>
                                                {site.name}
                                            </option>
                                        ))}
                                    </select>
                                    {sites.length === 0 && (
                                        <p className="input-hint">No sites added. <a href="/sites">Add a site first</a></p>
                                    )}
                                </div>
                                <div className="input-wrapper">
                                    <label className="input-label">
                                        <Calendar size={16} />
                                        Bill Month
                                    </label>
                                    <input
                                        type="month"
                                        className="input"
                                        value={billMonth}
                                        onChange={(e) => setBillMonth(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="actions">
                        {hasFiles && !allDone && (
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleUpload}
                                disabled={files.some(f => f.status !== 'pending')}
                            >
                                {files.some(f => f.status === 'uploading' || f.status === 'processing' || f.status === 'analyzing') ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Upload & Analyze with AI
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                /* AI Analysis Results */
                <div className="results-container">
                    <div className="success-header">
                        <CheckCircle2 size={48} />
                        <h2>Bill Analyzed Successfully!</h2>
                        <p>Here are your AI-powered insights</p>
                    </div>

                    {analysisResult && (
                        <>
                            {/* Summary Stats */}
                            <div className="stats-grid">
                                <div className="card stat-card">
                                    <div className="stat-icon blue">
                                        <Zap size={24} />
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Units Consumed</div>
                                        <div className="stat-value">{analysisResult.billData.unitsConsumed.toLocaleString()} kWh</div>
                                    </div>
                                </div>
                                <div className="card stat-card">
                                    <div className="stat-icon purple">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Total Amount</div>
                                        <div className="stat-value">₹{analysisResult.billData.totalAmount.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="card stat-card">
                                    <div className="stat-icon green">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Potential Savings</div>
                                        <div className="stat-value savings">₹{analysisResult.insights.potentialSavings.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="card stat-card">
                                    <div className={`stat-icon ${analysisResult.insights.riskLevel}`}>
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Risk Level</div>
                                        <div className={`stat-value risk-${analysisResult.insights.riskLevel}`}>
                                            {analysisResult.insights.riskLevel.charAt(0).toUpperCase() + analysisResult.insights.riskLevel.slice(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Summary */}
                            <div className="card summary-card">
                                <div className="card-header">
                                    <Sparkles size={20} />
                                    <h3>AI Summary</h3>
                                </div>
                                <p className="summary-text">{analysisResult.insights.summary}</p>
                            </div>

                            {/* Insights */}
                            <div className="card insights-card">
                                <h3>Key Insights</h3>
                                <ul className="insights-list">
                                    {analysisResult.insights.insights.map((insight, index) => (
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
                                    {analysisResult.insights.recommendations.map((rec, index) => (
                                        <li key={index}>
                                            <CheckCircle2 size={16} />
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="result-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowResults(false);
                                        setFiles([]);
                                        setAnalysisResult(null);
                                    }}
                                >
                                    Upload Another Bill
                                </button>
                                <Link href="/dashboard" className="btn btn-primary">
                                    Go to Dashboard
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}

            <style jsx>{`
        .upload-page {
          max-width: 900px;
          margin: 0 auto;
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

        .page-header h1 {
          font-size: var(--text-3xl);
          margin-bottom: var(--space-2);
        }

        .page-subtitle {
          color: var(--color-neutral-400);
        }

        .upload-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .upload-zone {
          cursor: pointer;
        }

        .upload-zone.has-files {
          padding: var(--space-8);
        }

        .upload-formats {
          display: flex;
          gap: var(--space-2);
          margin-top: var(--space-4);
        }

        .format-badge {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-1) var(--space-3);
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          color: var(--color-neutral-400);
        }

        .files-section h3,
        .options-section h3 {
          font-size: var(--text-lg);
          margin-bottom: var(--space-4);
        }

        .files-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4);
          background: var(--bg-glass);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-lg);
          transition: all var(--transition-base);
        }

        .file-item.done {
          border-color: rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.05);
        }

        .file-item.error {
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
        }

        .file-icon {
          width: 48px;
          height: 48px;
          background: var(--bg-elevated);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-neutral-400);
          overflow: hidden;
          flex-shrink: 0;
        }

        .file-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .file-info {
          flex: 1;
          min-width: 0;
        }

        .file-name {
          font-weight: 500;
          color: var(--color-neutral-100);
          margin-bottom: var(--space-1);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          font-size: var(--text-sm);
          color: var(--color-neutral-500);
        }

        .file-item .progress-bar {
          margin-top: var(--space-2);
          height: 4px;
        }

        .file-status {
          flex-shrink: 0;
        }

        .status-text {
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
        }

        .status-processing {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--color-warning-400);
        }

        .status-analyzing {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--color-primary-400);
        }

        .status-done {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--color-success-400);
        }

        .status-error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--color-error-400);
        }

        .remove-btn {
          padding: var(--space-2);
          color: var(--color-neutral-500);
          border-radius: var(--radius-md);
          transition: all var(--transition-base);
        }

        .remove-btn:hover {
          color: var(--color-error-400);
          background: rgba(239, 68, 68, 0.1);
        }

        .options-section {
          padding: var(--space-6);
        }

        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .input-label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .actions {
          display: flex;
          justify-content: center;
          padding: var(--space-4) 0;
        }

        /* Results Styles */
        .results-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .success-header {
          text-align: center;
          padding: var(--space-8);
        }

        .success-header :global(svg) {
          color: var(--color-success-400);
          margin-bottom: var(--space-4);
        }

        .success-header h2 {
          font-size: var(--text-2xl);
          margin-bottom: var(--space-2);
        }

        .success-header p {
          color: var(--color-neutral-400);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
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

        .stat-icon.green {
          background: rgba(16, 185, 129, 0.15);
          color: var(--color-success-400);
        }

        .stat-icon.low {
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

        .summary-card {
          padding: var(--space-6);
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

        .insights-card,
        .recommendations-card {
          padding: var(--space-6);
        }

        .insights-card h3,
        .recommendations-card h3 {
          margin-bottom: var(--space-4);
        }

        .insights-list,
        .recommendations-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .insights-list li,
        .recommendations-list li {
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

        .insights-list li span,
        .recommendations-list li span {
          color: var(--color-neutral-300);
        }

        .result-actions {
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
          .options-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .result-actions {
            flex-direction: column;
          }
        }
      `}</style>
        </div>
    );
}
