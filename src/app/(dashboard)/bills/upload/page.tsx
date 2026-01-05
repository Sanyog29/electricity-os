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
  Zap,
  Brain
} from 'lucide-react';
import { ExtractedBillData, InsightResponse } from '@/lib/gemini/client';
import { useBills, StoredBill, useSites } from '@/context';
import { BillScanResult } from '@/components/ai/BillScanResult';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'scanning' | 'done' | 'error';
  progress: number;
  error?: string;
}

interface ScanResult {
  extractedData: ExtractedBillData;
  insights: InsightResponse | null;
  confidence: number;
  warnings: string[];
}

export default function BillUploadPage() {
  const router = useRouter();
  const { addBill } = useBills();
  const { sites } = useSites();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [selectedSite, setSelectedSite] = useState('');
  const [billMonth, setBillMonth] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showScanResult, setShowScanResult] = useState(false);
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(null);

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
      const isValid =
        file.type === 'application/pdf' ||
        file.type === 'text/plain' ||
        file.type.startsWith('image/');
      return isValid && file.size <= 15 * 1024 * 1024; // 15MB limit
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

    const file = files[0]; // Process first file
    setCurrentFile(file);

    // Update status: uploading
    setFiles(prev => prev.map(f =>
      f.id === file.id ? { ...f, status: 'uploading' } : f
    ));

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 25) {
      await new Promise(r => setTimeout(r, 100));
      setFiles(prev => prev.map(f =>
        f.id === file.id ? { ...f, progress: i } : f
      ));
    }

    // Update status: scanning with AI
    setFiles(prev => prev.map(f =>
      f.id === file.id ? { ...f, status: 'scanning' } : f
    ));

    try {
      // Call the VLM scan API
      const formData = new FormData();
      formData.append('file', file.file);

      const response = await fetch('/api/bills/scan', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        // Extract error message from various possible locations
        const errorMessage =
          result.error?.message ||
          result.message ||
          (result.data?.warnings?.length ? result.data.warnings.join(', ') : null) ||
          'Failed to scan bill. Please check your Gemini API key.';
        throw new Error(errorMessage);
      }

      // Store the scan result
      setScanResult({
        extractedData: result.data.extractedData,
        insights: result.data.insights,
        confidence: result.data.confidence,
        warnings: result.data.warnings || [],
      });

      setFiles(prev => prev.map(f =>
        f.id === file.id ? { ...f, status: 'done' } : f
      ));

      // Show the scan result for user verification
      setShowScanResult(true);

    } catch (error) {
      console.error('Scan error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Scan failed';
      setFiles(prev => prev.map(f =>
        f.id === file.id ? {
          ...f,
          status: 'error',
          error: errorMessage
        } : f
      ));
    }
  };

  const handleConfirmScan = async (editedData: ExtractedBillData) => {
    if (!currentFile || !scanResult) return;

    // Store the bill in context (and database if configured)
    const storedBill: StoredBill = {
      id: currentFile.id,
      fileName: currentFile.file.name,
      uploadDate: new Date(),
      site: selectedSite || editedData.discom || 'Unknown Site',
      month: billMonth || editedData.billingPeriod || new Date().toISOString().slice(0, 7),
      totalAmount: editedData.totalAmount,
      unitsConsumed: editedData.unitsConsumed,
      maxDemand: editedData.maxDemand,
      powerFactor: editedData.powerFactor,
      status: 'analyzed',
      insights: scanResult.insights || {
        summary: 'Bill processed successfully.',
        insights: [],
        recommendations: [],
        potentialSavings: 0,
        riskLevel: 'low'
      }
    };

    await addBill(storedBill, currentFile.file);

    // Navigate to dashboard
    router.push('/dashboard');
  };

  const handleCancelScan = () => {
    setShowScanResult(false);
    setScanResult(null);
    setFiles([]);
    setCurrentFile(null);
  };

  const hasFiles = files.length > 0;
  const isProcessing = files.some(f =>
    f.status === 'uploading' || f.status === 'scanning'
  );

  return (
    <div className="upload-page">
      {/* Header */}
      <div className="page-header">
        <Link href="/bills" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to Bills</span>
        </Link>
        <h1>Upload Bills</h1>
        <p className="page-subtitle">
          <Brain size={16} />
          Upload PDF or image files - AI will automatically extract bill data
        </p>
      </div>

      {showScanResult && scanResult ? (
        /* AI Scan Results for Verification */
        <div className="scan-results-container">
          <div className="scan-header">
            <Sparkles size={24} />
            <h2>AI Bill Analysis Complete</h2>
            <p>Review the extracted data below and confirm to save</p>
          </div>

          <BillScanResult
            extractedData={scanResult.extractedData}
            insights={scanResult.insights}
            confidence={scanResult.confidence}
            warnings={scanResult.warnings}
            onConfirm={handleConfirmScan}
            onCancel={handleCancelScan}
          />
        </div>
      ) : (
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
              multiple={false}
              accept="image/*,.pdf,.txt,text/plain,application/pdf"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            <div className="upload-icon">
              <Upload size={48} />
            </div>
            <div className="upload-title">
              Drop file here or click to upload
            </div>
            <div className="upload-subtitle">
              AI will automatically extract all bill details
            </div>
            <div className="upload-formats">
              <span className="format-badge">
                <ImageIcon size={14} /> JPG
              </span>
              <span className="format-badge">
                <ImageIcon size={14} /> PNG
              </span>
              <span className="format-badge">
                <FileText size={14} /> PDF
              </span>
              <span className="format-badge">
                <FileText size={14} /> TXT
              </span>
            </div>
            <div className="ai-badge">
              <Sparkles size={14} />
              Powered by Gemini AI
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
                      {file.error && (
                        <div className="file-error">{file.error}</div>
                      )}
                    </div>
                    <div className="file-status">
                      {file.status === 'pending' && (
                        <span className="status-text">Ready</span>
                      )}
                      {file.status === 'uploading' && (
                        <span className="status-text">{file.progress}%</span>
                      )}
                      {file.status === 'scanning' && (
                        <span className="status-scanning">
                          <Loader2 size={16} className="animate-spin" />
                          AI Scanning
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
          {hasFiles && !isProcessing && (
            <div className="options-section card">
              <h3>Bill Details (Optional)</h3>
              <p className="options-hint">
                AI will try to detect these automatically, but you can pre-fill them
              </p>
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
                    <option value="">Auto-detect from bill</option>
                    {sites.map((site) => (
                      <option key={site.id} value={site.name}>
                        {site.name}
                      </option>
                    ))}
                  </select>
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
                    placeholder="Auto-detect"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="actions">
            {hasFiles && (
              <button
                className="btn btn-primary btn-lg"
                onClick={handleUpload}
                disabled={isProcessing || files[0]?.status === 'error'}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {files[0]?.status === 'scanning' ? 'AI Scanning...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <Brain size={18} />
                    Scan with AI
                  </>
                )}
              </button>
            )}
          </div>
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
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    color: var(--color-neutral-400);
                }

                .upload-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-6);
                }

                .upload-zone {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--space-12);
                    border: 2px dashed rgba(255, 255, 255, 0.15);
                    border-radius: var(--radius-xl);
                    background: var(--bg-glass);
                    cursor: pointer;
                    transition: all var(--transition-base);
                }

                .upload-zone:hover,
                .upload-zone.drag-over {
                    border-color: var(--color-primary-500);
                    background: rgba(52, 114, 255, 0.05);
                }

                .upload-zone.has-files {
                    padding: var(--space-8);
                }

                .upload-icon {
                    color: var(--color-primary-400);
                    margin-bottom: var(--space-4);
                }

                .upload-title {
                    font-size: var(--text-xl);
                    font-weight: 600;
                    color: var(--color-neutral-100);
                    margin-bottom: var(--space-2);
                }

                .upload-subtitle {
                    color: var(--color-neutral-400);
                    margin-bottom: var(--space-4);
                }

                .upload-formats {
                    display: flex;
                    gap: var(--space-2);
                    margin-bottom: var(--space-4);
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

                .format-badge.coming-soon {
                    opacity: 0.5;
                }

                .ai-badge {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-4);
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(52, 114, 255, 0.2));
                    border-radius: var(--radius-full);
                    font-size: var(--text-sm);
                    color: var(--color-primary-300);
                }

                .files-section h3,
                .options-section h3 {
                    font-size: var(--text-lg);
                    margin-bottom: var(--space-2);
                }

                .options-hint {
                    color: var(--color-neutral-500);
                    font-size: var(--text-sm);
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

                .file-item.scanning {
                    border-color: rgba(139, 92, 246, 0.3);
                    background: rgba(139, 92, 246, 0.05);
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

                .file-error {
                    font-size: var(--text-sm);
                    color: var(--color-error-400);
                    margin-top: var(--space-1);
                }

                .progress-bar {
                    margin-top: var(--space-2);
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: var(--color-primary-500);
                    transition: width 0.2s;
                }

                .file-status {
                    flex-shrink: 0;
                }

                .status-text {
                    font-size: var(--text-sm);
                    color: var(--color-neutral-400);
                }

                .status-scanning {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: var(--text-sm);
                    color: #a78bfa;
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

                .scan-results-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-6);
                }

                .scan-header {
                    text-align: center;
                    padding: var(--space-6);
                }

                .scan-header :global(svg) {
                    color: #a78bfa;
                    margin-bottom: var(--space-2);
                }

                .scan-header h2 {
                    font-size: var(--text-2xl);
                    margin-bottom: var(--space-2);
                }

                .scan-header p {
                    color: var(--color-neutral-400);
                }

                @media (max-width: 768px) {
                    .options-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
    </div>
  );
}
