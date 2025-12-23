'use client';

import Link from 'next/link';
import {
  Zap,
  FileText,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Clock,
  IndianRupee,
  CloudUpload,
  Sparkles,
  Menu,
  X,
  CircleCheck
} from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'For Business', href: '#business' }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container-custom">
          <div className="header-content">
            {/* Logo */}
            <div className="logo" onClick={() => window.scrollTo(0, 0)}>
              <div className="logo-icon">
                <Zap size={18} color="white" />
              </div>
              <span className="logo-text">Electricity Bill OS</span>
            </div>

            {/* Desktop Nav */}
            <nav className="header-nav">
              {navLinks.map(link => (
                <a key={link.name} href={link.href}>{link.name}</a>
              ))}
            </nav>

            {/* Auth Actions */}
            <div className="header-actions">
              <Link href="/login" className="auth-link">Sign in</Link>
              <Link href="/signup" className="btn btn-primary-light">Get Started</Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)}>
                {link.name}
              </a>
            ))}
            <div className="mobile-menu-auth">
              <Link href="/login">Sign in</Link>
              <Link href="/signup" className="btn btn-primary-light">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container-custom">
          <div className="hero-grid">
            {/* Left Content */}
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-dot" />
                <span>New: Multi-Site Analytics</span>
              </div>

              <h1>
                Master Your <br />
                <span className="text-gradient-light">Electricity Bills</span>
              </h1>

              <p className="hero-subtitle">
                Stop overpaying. Use AI to digitize, analyze, and optimize your business electricity consumption across multiple sites in India.
              </p>

              <div className="hero-actions">
                <Link href="/bills/upload" className="btn btn-primary-light btn-lg">
                  <CloudUpload size={20} />
                  Upload First Bill
                </Link>
                <Link href="#demo" className="btn btn-outline-light btn-lg">
                  Watch Demo
                </Link>
              </div>

              <div className="hero-features">
                <div className="hero-feature">
                  <CircleCheck size={16} className="check-icon" />
                  <span>OCR Powered</span>
                </div>
                <div className="hero-feature">
                  <CircleCheck size={16} className="check-icon" />
                  <span>AI Insights</span>
                </div>
                <div className="hero-feature">
                  <CircleCheck size={16} className="check-icon" />
                  <span>Risk Assessment</span>
                </div>
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="hero-preview">
              <div className="preview-window">
                <div className="preview-header">
                  <div className="window-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <span className="preview-url">app.electricitybillos.com</span>
                </div>
                <div className="preview-content">
                  <div className="preview-top">
                    <div>
                      <h3>Overview</h3>
                      <p>Last 30 Days</p>
                    </div>
                    <button className="export-btn">Export</button>
                  </div>

                  <div className="stats-cards">
                    <div className="stat-card">
                      <div className="stat-header">
                        <div className="stat-icon blue">
                          <IndianRupee size={16} />
                        </div>
                        <span className="stat-badge negative">+12%</span>
                      </div>
                      <div className="stat-value">₹45,230</div>
                      <div className="stat-label">Total Bill Amount</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-header">
                        <div className="stat-icon green">
                          <Zap size={16} />
                        </div>
                        <span className="stat-badge positive">-5%</span>
                      </div>
                      <div className="stat-value">3,120 <span className="unit">kWh</span></div>
                      <div className="stat-label">Consumption</div>
                    </div>
                  </div>

                  <div className="chart-card">
                    <div className="chart-header">
                      <h4>Consumption Trend</h4>
                    </div>
                    <div className="mini-chart">
                      {[30, 45, 35, 60, 50, 75, 55, 65, 40].map((h, i) => (
                        <div key={i} className="bar-wrapper">
                          <div className="bar" style={{ height: `${h}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Insight */}
                <div className="floating-insight">
                  <Sparkles size={18} className="insight-icon" />
                  <div>
                    <p className="insight-title">AI Insight Detected</p>
                    <p className="insight-text">Potential power factor penalty risk at Site B. Check capacitors.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container-custom">
          <div className="section-header">
            <h2>Everything you need to manage electricity costs</h2>
            <p>From bill parsing to savings optimization – all in one platform</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon blue">
                <FileText size={24} />
              </div>
              <h3>Smart Bill Upload</h3>
              <p>Upload PDF, image, or forward emails. Our AI extracts every line item accurately across all Indian DISCOMs.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">
                <Shield size={24} />
              </div>
              <h3>Automated Audit</h3>
              <p>Detect errors, overcharges, wrong category, missed rebates, and penalty anomalies automatically.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon amber">
                <TrendingUp size={24} />
              </div>
              <h3>Savings Insights</h3>
              <p>Get quantified savings opportunities – tariff optimization, load reduction, solar migration, and more.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon purple">
                <BarChart3 size={24} />
              </div>
              <h3>Portfolio Analytics</h3>
              <p>Multi-site dashboards with trends, anomaly alerts, and executive reports for CFOs and facility heads.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon pink">
                <Clock size={24} />
              </div>
              <h3>Workflow Automation</h3>
              <p>Dispute templates, internal approvals, vendor tasks, and reminders tied to billing cycles.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon cyan">
                <IndianRupee size={24} />
              </div>
              <h3>Subsidy Discovery</h3>
              <p>Match your profile to available schemes – MSME benefits, IT-ITES rebates, sector-specific subsidies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container-custom">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to smarter electricity management</p>
          </div>

          <div className="steps-grid">
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

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container-custom">
          <div className="stats-grid-main">
            <div className="main-stat">
              <div className="main-stat-value">₹2.5Cr+</div>
              <div className="main-stat-label">Savings Identified</div>
            </div>
            <div className="main-stat">
              <div className="main-stat-value">15,000+</div>
              <div className="main-stat-label">Bills Processed</div>
            </div>
            <div className="main-stat">
              <div className="main-stat-value">50+</div>
              <div className="main-stat-label">DISCOMs Covered</div>
            </div>
            <div className="main-stat">
              <div className="main-stat-value">500+</div>
              <div className="main-stat-label">Business Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container-custom">
          <div className="cta-card">
            <h2>Start saving on electricity bills today</h2>
            <p>Join hundreds of businesses who have already discovered hidden savings.</p>
            <Link href="/signup" className="btn btn-primary-light btn-lg">
              Get Started Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container-custom">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon">
                  <Zap size={16} color="white" />
                </div>
                <span className="logo-text">Electricity Bill OS</span>
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
            <p>© 2024 Electricity Bill OS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Light Theme Variables */
        :root {
          --primary: #0ea5e9;
          --primary-dark: #0284c7;
          --secondary: #0f172a;
          --accent: #eab308;
          --bg-light: #f8fafc;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --success: #10b981;
        }

        .landing-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--text-main);
          background: white;
        }

        .container-custom {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Header */
        .landing-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e2e8f0;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
          color: var(--secondary);
        }

        .header-nav {
          display: flex;
          gap: 32px;
        }

        .header-nav a {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-muted);
          transition: color 0.2s;
        }

        .header-nav a:hover {
          color: var(--primary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .auth-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-muted);
        }

        .auth-link:hover {
          color: var(--text-main);
        }

        .btn-primary-light {
          background: var(--primary);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s, box-shadow 0.2s;
        }

        .btn-primary-light:hover {
          background: var(--primary-dark);
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }

        .btn-outline-light {
          background: white;
          color: var(--text-main);
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #e2e8f0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-outline-light:hover {
          background: #f8fafc;
        }

        .btn-lg {
          padding: 14px 28px;
          font-size: 16px;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--text-main);
          cursor: pointer;
        }

        .mobile-menu {
          display: none;
          flex-direction: column;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 16px 24px;
        }

        .mobile-menu a {
          padding: 12px 0;
          font-size: 16px;
          color: var(--text-main);
          border-bottom: 1px solid #f1f5f9;
        }

        .mobile-menu-auth {
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Hero */
        .hero {
          padding: 80px 0 100px;
          background: var(--bg-light);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.2);
          border-radius: 100px;
          margin-bottom: 24px;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .hero-badge span {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--primary-dark);
        }

        .hero h1 {
          font-size: 56px;
          font-weight: 800;
          line-height: 1.1;
          color: var(--secondary);
          margin-bottom: 20px;
        }

        .text-gradient-light {
          background: linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 18px;
          line-height: 1.7;
          color: var(--text-muted);
          margin-bottom: 32px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }

        .hero-features {
          display: flex;
          gap: 24px;
        }

        .hero-feature {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: var(--text-muted);
        }

        .check-icon {
          color: var(--success);
        }

        /* Preview Window */
        .hero-preview {
          position: relative;
        }

        .preview-window {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .window-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot.red { background: rgba(248, 113, 113, 0.8); }
        .dot.yellow { background: rgba(250, 204, 21, 0.8); }
        .dot.green { background: rgba(74, 222, 128, 0.8); }

        .preview-url {
          font-size: 12px;
          color: #94a3b8;
        }

        .preview-content {
          padding: 24px;
          background: #f8fafc;
          min-height: 340px;
        }

        .preview-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .preview-top h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--secondary);
        }

        .preview-top p {
          font-size: 12px;
          color: #94a3b8;
        }

        .export-btn {
          padding: 8px 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
        }

        .stats-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .stat-card {
          background: white;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.blue {
          background: rgba(14, 165, 233, 0.1);
          color: var(--primary);
        }

        .stat-icon.green {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
        }

        .stat-badge {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 100px;
        }

        .stat-badge.negative {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .stat-badge.positive {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--secondary);
        }

        .stat-value .unit {
          font-size: 14px;
          font-weight: 400;
          color: #94a3b8;
        }

        .stat-label {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
        }

        .chart-card {
          background: white;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .chart-header {
          margin-bottom: 16px;
        }

        .chart-header h4 {
          font-size: 14px;
          font-weight: 600;
          color: var(--secondary);
        }

        .mini-chart {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 80px;
        }

        .bar-wrapper {
          flex: 1;
          height: 100%;
          background: #f1f5f9;
          border-radius: 4px;
          position: relative;
        }

        .bar {
          position: absolute;
          bottom: 0;
          width: 100%;
          background: var(--primary);
          border-radius: 4px;
          transition: height 0.3s, background 0.2s;
        }

        .bar-wrapper:hover .bar {
          background: var(--primary-dark);
        }

        .floating-insight {
          position: absolute;
          bottom: -24px;
          right: -24px;
          background: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          max-width: 280px;
          display: flex;
          gap: 12px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .insight-icon {
          color: var(--accent);
          flex-shrink: 0;
        }

        .insight-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--secondary);
        }

        .insight-text {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
        }

        /* Features */
        .features {
          padding: 100px 0;
          background: white;
        }

        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .section-header h2 {
          font-size: 36px;
          font-weight: 700;
          color: var(--secondary);
          margin-bottom: 16px;
        }

        .section-header p {
          font-size: 18px;
          color: var(--text-muted);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .feature-card {
          background: white;
          padding: 32px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: box-shadow 0.3s, transform 0.3s;
        }

        .feature-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          transform: translateY(-4px);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .feature-icon.blue { background: rgba(14, 165, 233, 0.1); color: var(--primary); }
        .feature-icon.green { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .feature-icon.amber { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .feature-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
        .feature-icon.pink { background: rgba(236, 72, 153, 0.1); color: #ec4899; }
        .feature-icon.cyan { background: rgba(6, 182, 212, 0.1); color: #06b6d4; }

        .feature-card h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--secondary);
          margin-bottom: 12px;
        }

        .feature-card p {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-muted);
        }

        /* How It Works */
        .how-it-works {
          padding: 100px 0;
          background: var(--bg-light);
        }

        .steps-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
        }

        .step-card {
          flex: 1;
          max-width: 300px;
          text-align: center;
          padding: 40px 32px;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .step-number {
          width: 48px;
          height: 48px;
          background: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin: 0 auto 20px;
        }

        .step-card h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--secondary);
          margin-bottom: 12px;
        }

        .step-card p {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .step-connector {
          color: #cbd5e1;
        }

        /* Stats */
        .stats-section {
          padding: 80px 0;
          background: var(--secondary);
        }

        .stats-grid-main {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 48px;
          text-align: center;
        }

        .main-stat-value {
          font-size: 48px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }

        .main-stat-label {
          font-size: 14px;
          color: #94a3b8;
        }

        /* CTA */
        .cta-section {
          padding: 100px 0;
          background: white;
        }

        .cta-card {
          text-align: center;
          padding: 80px 40px;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%);
          border: 1px solid rgba(14, 165, 233, 0.1);
          border-radius: 24px;
        }

        .cta-card h2 {
          font-size: 36px;
          font-weight: 700;
          color: var(--secondary);
          margin-bottom: 16px;
        }

        .cta-card p {
          font-size: 18px;
          color: var(--text-muted);
          margin-bottom: 32px;
        }

        /* Footer */
        .landing-footer {
          padding: 80px 0 40px;
          background: var(--bg-light);
          border-top: 1px solid #e2e8f0;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          margin-bottom: 48px;
        }

        .footer-brand {
          max-width: 300px;
        }

        .footer-brand p {
          margin-top: 16px;
          font-size: 14px;
          color: var(--text-muted);
        }

        .footer-links {
          display: flex;
          gap: 80px;
        }

        .footer-col h4 {
          font-size: 14px;
          font-weight: 600;
          color: var(--secondary);
          margin-bottom: 16px;
        }

        .footer-col a {
          display: block;
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .footer-col a:hover {
          color: var(--primary);
        }

        .footer-bottom {
          padding-top: 32px;
          border-top: 1px solid #e2e8f0;
        }

        .footer-bottom p {
          font-size: 14px;
          color: var(--text-muted);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .hero h1 {
            font-size: 42px;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .stats-grid-main {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .header-nav, .header-actions {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-menu {
            display: flex;
          }

          .hero {
            padding: 60px 0 80px;
          }

          .hero h1 {
            font-size: 32px;
          }

          .hero-actions {
            flex-direction: column;
          }

          .hero-features {
            flex-direction: column;
            gap: 12px;
          }

          .floating-insight {
            display: none;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .steps-grid {
            flex-direction: column;
          }

          .step-connector {
            transform: rotate(90deg);
          }

          .stats-grid-main {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
          }

          .main-stat-value {
            font-size: 32px;
          }

          .footer-content {
            flex-direction: column;
            gap: 48px;
          }

          .footer-links {
            flex-wrap: wrap;
            gap: 40px;
          }
        }
      `}</style>
    </div>
  );
}
