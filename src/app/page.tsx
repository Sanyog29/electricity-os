'use client';

import Link from 'next/link';
import {
  Zap,
  FileText,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  BarChart3,
  Clock,
  IndianRupee,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">
                <Zap size={24} color="white" />
              </div>
              <span className="logo-text">BillOS</span>
            </div>
            <nav className="header-nav">
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
            </nav>
            <div className="header-actions">
              <Link href="/login" className="btn btn-ghost">Log In</Link>
              <Link href="/signup" className="btn btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>AI-Powered Bill Intelligence</span>
          </div>
          <h1 className="hero-title">
            The <span className="text-gradient">Electricity Bill OS</span><br />
            for India
          </h1>
          <p className="hero-subtitle">
            Understand, audit, optimize, and manage electricity bills across DISCOMs.
            Save money, detect errors, and automate workflows with AI.
          </p>
          <div className="hero-actions">
            <Link href="/signup" className="btn btn-primary btn-lg">
              Start Free Trial
              <ArrowRight size={18} />
            </Link>
            <Link href="#demo" className="btn btn-secondary btn-lg">
              Watch Demo
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">₹2.5Cr+</div>
              <div className="stat-label">Savings Identified</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">15,000+</div>
              <div className="stat-label">Bills Processed</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">50+</div>
              <div className="stat-label">DISCOMs Covered</div>
            </div>
          </div>
        </div>
        <div className="hero-gradient" />
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Everything you need to manage electricity costs</h2>
            <p>From bill parsing to savings optimization – all in one platform</p>
          </div>
          <div className="features-grid">
            <div className="feature-card card card-interactive">
              <div className="feature-icon" style={{ background: 'rgba(52, 114, 255, 0.15)' }}>
                <FileText size={24} color="var(--color-primary-400)" />
              </div>
              <h3>Smart Bill Upload</h3>
              <p>Upload PDF, image, or forward emails. Our AI extracts every line item accurately across all Indian DISCOMs.</p>
            </div>
            <div className="feature-card card card-interactive">
              <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                <Shield size={24} color="var(--color-success-400)" />
              </div>
              <h3>Automated Audit</h3>
              <p>Detect errors, overcharges, wrong category, missed rebates, and penalty anomalies automatically.</p>
            </div>
            <div className="feature-card card card-interactive">
              <div className="feature-icon" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
                <TrendingUp size={24} color="var(--color-warning-400)" />
              </div>
              <h3>Savings Insights</h3>
              <p>Get quantified savings opportunities – tariff optimization, load reduction, solar migration, and more.</p>
            </div>
            <div className="feature-card card card-interactive">
              <div className="feature-icon" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
                <BarChart3 size={24} color="#a78bfa" />
              </div>
              <h3>Portfolio Analytics</h3>
              <p>Multi-site dashboards with trends, anomaly alerts, and executive reports for CFOs and facility heads.</p>
            </div>
            <div className="feature-card card card-interactive">
              <div className="feature-icon" style={{ background: 'rgba(236, 72, 153, 0.15)' }}>
                <Clock size={24} color="#f472b6" />
              </div>
              <h3>Workflow Automation</h3>
              <p>Dispute templates, internal approvals, vendor tasks, and reminders tied to billing cycles.</p>
            </div>
            <div className="feature-card card card-interactive">
              <div className="feature-icon" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
                <IndianRupee size={24} color="#22d3ee" />
              </div>
              <h3>Subsidy Discovery</h3>
              <p>Match your profile to available schemes – MSME benefits, IT-ITES rebates, sector-specific subsidies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to smarter electricity management</p>
          </div>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Upload Bills</h3>
              <p>Upload PDFs, images, or connect your email. We support all major Indian DISCOMs.</p>
            </div>
            <div className="step-connector">
              <ArrowRight size={24} />
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>AI Analysis</h3>
              <p>Our AI extracts data, validates against tariff rules, and identifies savings opportunities.</p>
            </div>
            <div className="step-connector">
              <ArrowRight size={24} />
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Take Action</h3>
              <p>Review insights, file disputes, implement optimizations, and track savings over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-content">
            <h2>Trusted by businesses across India</h2>
            <div className="trust-items">
              <div className="trust-item">
                <CheckCircle2 size={20} color="var(--color-success-400)" />
                <span>Works with all major DISCOMs</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={20} color="var(--color-success-400)" />
                <span>Bank-grade data security</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={20} color="var(--color-success-400)" />
                <span>SOC 2 compliant</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={20} color="var(--color-success-400)" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card card">
            <h2>Start saving on electricity bills today</h2>
            <p>Join hundreds of businesses who have already discovered hidden savings.</p>
            <Link href="/signup" className="btn btn-primary btn-lg">
              Get Started Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon">
                  <Zap size={20} color="white" />
                </div>
                <span className="logo-text">BillOS</span>
              </div>
              <p>AI-powered electricity bill management for India.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#demo">Demo</a>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
                <a href="/careers">Careers</a>
              </div>
              <div className="footer-col">
                <h4>Legal</h4>
                <a href="/privacy">Privacy</a>
                <a href="/terms">Terms</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 BillOS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          overflow-x: hidden;
        }

        .landing-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--z-fixed);
          padding: var(--space-4) 0;
          background: rgba(10, 14, 26, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: var(--space-8);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--color-neutral-50);
        }

        .header-nav {
          display: flex;
          gap: var(--space-6);
        }

        .header-nav a {
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
          transition: color var(--transition-base);
        }

        .header-nav a:hover {
          color: var(--color-neutral-100);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-left: auto;
        }

        /* Hero */
        .hero {
          position: relative;
          padding: 160px 0 100px;
          text-align: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          background: rgba(52, 114, 255, 0.1);
          border: 1px solid rgba(52, 114, 255, 0.2);
          border-radius: var(--radius-full);
          color: var(--color-primary-400);
          font-size: var(--text-sm);
          font-weight: 500;
          margin-bottom: var(--space-6);
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: var(--space-6);
        }

        .hero-subtitle {
          font-size: var(--text-xl);
          color: var(--color-neutral-400);
          max-width: 600px;
          margin: 0 auto var(--space-8);
        }

        .hero-actions {
          display: flex;
          gap: var(--space-4);
          justify-content: center;
          margin-bottom: var(--space-12);
        }

        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-8);
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: var(--text-3xl);
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

        .hero-gradient {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 600px;
          background: radial-gradient(ellipse at center top, rgba(52, 114, 255, 0.2) 0%, transparent 60%);
          pointer-events: none;
          z-index: -1;
        }

        /* Features */
        .features {
          padding: var(--space-16) 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--space-12);
        }

        .section-header h2 {
          font-size: var(--text-3xl);
          margin-bottom: var(--space-4);
        }

        .section-header p {
          font-size: var(--text-lg);
          color: var(--color-neutral-400);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }

        .feature-card {
          padding: var(--space-8);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-4);
        }

        .feature-card h3 {
          font-size: var(--text-lg);
          margin-bottom: var(--space-2);
        }

        .feature-card p {
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
          line-height: 1.6;
        }

        /* How It Works */
        .how-it-works {
          padding: var(--space-16) 0;
          background: var(--bg-secondary);
        }

        .steps-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-4);
        }

        .step-card {
          flex: 1;
          max-width: 300px;
          text-align: center;
          padding: var(--space-8);
        }

        .step-number {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-xl);
          font-weight: 700;
          color: white;
          margin: 0 auto var(--space-4);
        }

        .step-card h3 {
          font-size: var(--text-lg);
          margin-bottom: var(--space-2);
        }

        .step-card p {
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
        }

        .step-connector {
          color: var(--color-neutral-600);
        }

        /* Trust */
        .trust-section {
          padding: var(--space-12) 0;
        }

        .trust-content {
          text-align: center;
        }

        .trust-content h2 {
          font-size: var(--text-2xl);
          margin-bottom: var(--space-6);
        }

        .trust-items {
          display: flex;
          gap: var(--space-8);
          justify-content: center;
          flex-wrap: wrap;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--color-neutral-300);
        }

        /* CTA */
        .cta-section {
          padding: var(--space-16) 0;
        }

        .cta-card {
          text-align: center;
          padding: var(--space-12);
          background: linear-gradient(135deg, rgba(52, 114, 255, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
          border: 1px solid rgba(52, 114, 255, 0.2);
        }

        .cta-card h2 {
          font-size: var(--text-3xl);
          margin-bottom: var(--space-4);
        }

        .cta-card p {
          font-size: var(--text-lg);
          color: var(--color-neutral-400);
          margin-bottom: var(--space-6);
        }

        /* Footer */
        .landing-footer {
          padding: var(--space-12) 0 var(--space-8);
          background: var(--bg-secondary);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-8);
        }

        .footer-brand {
          max-width: 300px;
        }

        .footer-brand p {
          margin-top: var(--space-4);
          font-size: var(--text-sm);
          color: var(--color-neutral-500);
        }

        .footer-links {
          display: flex;
          gap: var(--space-12);
        }

        .footer-col h4 {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--color-neutral-300);
          margin-bottom: var(--space-4);
        }

        .footer-col a {
          display: block;
          font-size: var(--text-sm);
          color: var(--color-neutral-500);
          margin-bottom: var(--space-2);
          transition: color var(--transition-base);
        }

        .footer-col a:hover {
          color: var(--color-neutral-300);
        }

        .footer-bottom {
          padding-top: var(--space-6);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-bottom p {
          font-size: var(--text-sm);
          color: var(--color-neutral-600);
        }

        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .header-nav {
            display: none;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .hero-stats {
            flex-direction: column;
            gap: var(--space-4);
          }

          .stat-divider {
            width: 60px;
            height: 1px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .steps-container {
            flex-direction: column;
          }

          .step-connector {
            transform: rotate(90deg);
          }

          .footer-content {
            flex-direction: column;
            gap: var(--space-8);
          }

          .footer-links {
            flex-wrap: wrap;
            gap: var(--space-6);
          }
        }
      `}</style>
    </div>
  );
}
