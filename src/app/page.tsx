'use client';

import Link from 'next/link';
import {
  Zap,
  FileText,
  TrendingUp,
  Shield,
  ArrowRight,
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
    { name: 'How it Works', href: '#how-it-works' }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container-custom">
          <div className="header-content">
            <div className="logo" onClick={() => window.scrollTo(0, 0)}>
              <div className="logo-icon">
                <Zap size={18} color="white" />
              </div>
              <span className="logo-text">Electricity Bill OS</span>
            </div>

            <nav className="header-nav">
              {navLinks.map(link => (
                <a key={link.name} href={link.href}>{link.name}</a>
              ))}
            </nav>

            <div className="header-actions">
              <Link href="/signup" className="btn btn-primary">Get Started</Link>
            </div>

            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mobile-menu">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)}>
                {link.name}
              </a>
            ))}
            <div className="mobile-menu-auth">
              <Link href="/signup" className="btn btn-primary">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="container-custom">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-dot" />
                <span>New: Multi-Site Analytics</span>
              </div>

              <h1>
                Master Your <br />
                <span className="text-gradient">Electricity Bills</span>
              </h1>

              <p className="hero-subtitle">
                Stop overpaying. Use AI to digitize, analyze, and optimize your business electricity consumption across multiple sites in India.
              </p>

              <div className="hero-actions">
                <Link href="/bills/upload" className="btn btn-primary btn-lg">
                  <CloudUpload size={20} />
                  Upload First Bill
                </Link>
                <Link href="#demo" className="btn btn-outline btn-lg">
                  Watch Demo
                </Link>
              </div>

              <div className="hero-features">
                <div className="hero-feature">
                  <CircleCheck size={16} className="check-icon" />
                  <span>AI Powered</span>
                </div>
                <div className="hero-feature">
                  <CircleCheck size={16} className="check-icon" />
                  <span>In-Depth Insights</span>
                </div>
                <div className="hero-feature">
                  <CircleCheck size={16} className="check-icon" />
                  <span>Risk Assessment</span>
                </div>
              </div>
            </div>

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

                <div className="floating-insight">
                  <Sparkles size={18} className="insight-icon" />
                  <div>
                    <p className="insight-title">AI Insight Detected</p>
                    <p className="insight-text">Power factor penalty risk at Site B</p>
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
            <Link href="/signup" className="btn btn-primary btn-lg">
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
        /* Dark Theme Variables - Using Global CSS Variables */
        .landing-page {
          --primary: var(--color-primary-500);
          --primary-dark: var(--color-primary-600);
          --accent: var(--color-accent-500);
          --accent-light: var(--color-accent-400);
          --bg-dark: var(--bg-primary);
          --bg-card: var(--bg-card);
          --text-main: var(--color-neutral-50);
          --text-muted: var(--color-neutral-400);
          --success: var(--color-success-500);
          --border: rgba(255, 255, 255, 0.08);
        }

        .landing-page {
          font-family: var(--font-sans);
          color: var(--text-main);
          background: linear-gradient(180deg, var(--bg-primary) 0%, #0f1629 50%, var(--bg-primary) 100%);
          min-height: 100vh;
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
          background: rgba(10, 14, 26, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
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
          background: linear-gradient(135deg, var(--color-accent-500) 0%, var(--color-primary-500) 100%);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-main);
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
          color: var(--text-main);
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

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--color-accent-500) 0%, var(--color-accent-600) 100%);
          color: white;
          padding: 10px 20px;
          box-shadow: 0 4px 15px rgba(14, 165, 233, 0.35);
        }

        .btn-primary:hover {
          box-shadow: 0 6px 25px rgba(14, 165, 233, 0.5);
          transform: translateY(-2px);
        }

        .btn-outline {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
          padding: 10px 20px;
          border: 1px solid var(--border);
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.15);
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
          background: rgba(10, 14, 26, 0.95);
          border-bottom: 1px solid var(--border);
          padding: 16px 24px;
        }

        .mobile-menu a {
          padding: 12px 0;
          font-size: 16px;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
        }

        .mobile-menu-auth {
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Hero */
        .hero {
          padding: 80px 0 120px;
          position: relative;
          overflow: hidden;
        }

        .hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }

        .hero-glow-1 {
          width: 600px;
          height: 600px;
          background: rgba(14, 165, 233, 0.15);
          top: -200px;
          right: -100px;
          animation: floatGlow1 8s ease-in-out infinite;
        }

        .hero-glow-2 {
          width: 400px;
          height: 400px;
          background: rgba(16, 185, 129, 0.1);
          bottom: -100px;
          left: -100px;
          animation: floatGlow2 10s ease-in-out infinite;
        }

        @keyframes floatGlow1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 30px) scale(1.1); }
        }

        @keyframes floatGlow2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -20px) scale(1.15); }
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(14, 165, 233, 0.15);
          border: 1px solid rgba(14, 165, 233, 0.25);
          border-radius: 100px;
          margin-bottom: 24px;
          animation: fadeInUp 0.6s ease-out;
        }

        .hero-content h1 {
          animation: fadeInUp 0.6s ease-out 0.1s both;
        }

        .hero-subtitle {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .hero-actions {
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }

        .hero-features {
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: var(--color-accent-500);
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
          color: var(--color-accent-400);
        }

        .hero h1 {
          font-size: 56px;
          font-weight: 800;
          line-height: 1.1;
          color: var(--text-main);
          margin-bottom: 20px;
        }

        .text-gradient {
          background: linear-gradient(135deg, var(--color-accent-500) 0%, var(--color-accent-400) 50%, var(--color-success-400) 100%);
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
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          border: 1px solid var(--border);
          overflow: hidden;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
          animation: float 6s ease-in-out infinite, fadeInRight 0.8s ease-out 0.3s both;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid var(--border);
        }

        .window-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot.red { background: #ef4444; }
        .dot.yellow { background: #eab308; }
        .dot.green { background: #22c55e; }

        .preview-url {
          font-size: 12px;
          color: #64748b;
        }

        .preview-content {
          padding: 24px;
          background: linear-gradient(180deg, rgba(15, 22, 41, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%);
          min-height: 300px;
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
          color: var(--text-main);
        }

        .preview-top p {
          font-size: 12px;
          color: #64748b;
        }

        .export-btn {
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
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
          background: rgba(255, 255, 255, 0.03);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
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
          background: rgba(52, 114, 255, 0.15);
          color: #3472ff;
        }

        .stat-icon.green {
          background: rgba(16, 185, 129, 0.15);
          color: var(--success);
        }

        .stat-badge {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 100px;
        }

        .stat-badge.negative {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }

        .stat-badge.positive {
          background: rgba(16, 185, 129, 0.15);
          color: var(--success);
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-main);
        }

        .stat-value .unit {
          font-size: 14px;
          font-weight: 400;
          color: #64748b;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }

        .chart-card {
          background: rgba(255, 255, 255, 0.03);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .chart-header {
          margin-bottom: 16px;
        }

        .chart-header h4 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-main);
        }

        .mini-chart {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 60px;
        }

        .bar-wrapper {
          flex: 1;
          height: 100%;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          position: relative;
        }

        .bar {
          position: absolute;
          bottom: 0;
          width: 100%;
          background: linear-gradient(180deg, #3472ff 0%, #06b6d4 100%);
          border-radius: 4px;
          animation: growUp 1s ease-out forwards;
          transform-origin: bottom;
        }

        @keyframes growUp {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }

        .bar-wrapper:nth-child(1) .bar { animation-delay: 0.1s; }
        .bar-wrapper:nth-child(2) .bar { animation-delay: 0.15s; }
        .bar-wrapper:nth-child(3) .bar { animation-delay: 0.2s; }
        .bar-wrapper:nth-child(4) .bar { animation-delay: 0.25s; }
        .bar-wrapper:nth-child(5) .bar { animation-delay: 0.3s; }
        .bar-wrapper:nth-child(6) .bar { animation-delay: 0.35s; }
        .bar-wrapper:nth-child(7) .bar { animation-delay: 0.4s; }
        .bar-wrapper:nth-child(8) .bar { animation-delay: 0.45s; }
        .bar-wrapper:nth-child(9) .bar { animation-delay: 0.5s; }

        .floating-insight {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background: linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(234, 179, 8, 0.05) 100%);
          padding: 14px;
          border-radius: 12px;
          border: 1px solid rgba(234, 179, 8, 0.3);
          max-width: 240px;
          display: flex;
          gap: 10px;
          animation: bounce 2s infinite;
          box-shadow: 0 10px 40px rgba(234, 179, 8, 0.15);
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .insight-icon {
          color: var(--accent);
          flex-shrink: 0;
        }

        .insight-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--accent);
        }

        .insight-text {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }

        /* Features */
        .features {
          padding: 100px 0;
          background: rgba(15, 22, 41, 0.5);
        }

        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .section-header h2 {
          font-size: 36px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 16px;
        }

        .section-header p {
          font-size: 18px;
          color: var(--text-muted);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.02);
          padding: 28px;
          border-radius: 16px;
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(52, 114, 255, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
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

        .feature-icon.blue { background: rgba(52, 114, 255, 0.15); color: #3472ff; }
        .feature-icon.green { background: rgba(16, 185, 129, 0.15); color: var(--success); }
        .feature-icon.amber { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .feature-icon.purple { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
        .feature-icon.pink { background: rgba(236, 72, 153, 0.15); color: #ec4899; }
        .feature-icon.cyan { background: rgba(6, 182, 212, 0.15); color: #06b6d4; }

        .feature-card h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 10px;
        }

        .feature-card p {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-muted);
        }

        /* How It Works */
        .how-it-works {
          padding: 100px 0;
        }

        .steps-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
        }

        .step-card {
          flex: 1;
          max-width: 280px;
          text-align: center;
          padding: 36px 28px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          border: 1px solid var(--border);
        }

        .step-number {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3472ff 0%, #06b6d4 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin: 0 auto 20px;
          box-shadow: 0 4px 20px rgba(52, 114, 255, 0.4);
        }

        .step-card h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 10px;
        }

        .step-card p {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .step-connector {
          color: #475569;
        }

        /* Stats */
        .stats-section {
          padding: 80px 0;
          background: linear-gradient(135deg, rgba(52, 114, 255, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
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
          background: linear-gradient(135deg, #3472ff 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .main-stat-label {
          font-size: 14px;
          color: var(--text-muted);
        }

        /* CTA */
        .cta-section {
          padding: 100px 0;
        }

        .cta-card {
          text-align: center;
          padding: 80px 40px;
          background: linear-gradient(135deg, rgba(52, 114, 255, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%);
          border: 1px solid rgba(52, 114, 255, 0.2);
          border-radius: 24px;
        }

        .cta-card h2 {
          font-size: 36px;
          font-weight: 700;
          color: var(--text-main);
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
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid var(--border);
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
          color: var(--text-main);
          margin-bottom: 16px;
        }

        .footer-col a {
          display: block;
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .footer-col a:hover {
          color: var(--text-main);
        }

        .footer-bottom {
          padding-top: 32px;
          border-top: 1px solid var(--border);
        }

        .footer-bottom p {
          font-size: 14px;
          color: #64748b;
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
