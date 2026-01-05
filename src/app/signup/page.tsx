'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Building2,
  ShieldCheck,
  Check,
  FileCheck,
  TrendingUp
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Fade, Slide, Zoom, AttentionSeeker, JackInTheBox } from 'react-awesome-reveal';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    meters: '1-5',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!formData.email.trim()) {
        setError('Please enter your email address');
        return;
      }
      if (!isValidEmail(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }
    if (step === 2) {
      if (!formData.companyName.trim()) {
        setError('Please enter your company name');
        return;
      }
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check password requirements
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError('');

    // Final validation
    if (!formData.password) {
      setError('Please enter a password');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            company_name: formData.companyName.trim(),
            meters_count: formData.meters,
          },
        },
      });

      if (authError) {
        // Map common Supabase errors to user-friendly messages
        if (authError.message.includes('already registered')) {
          setError('An account with this email already exists. Please log in instead.');
        } else if (authError.message.includes('invalid')) {
          setError('Invalid email or password format. Please check and try again.');
        } else if (authError.message.includes('Too many requests')) {
          setError('Too many signup attempts. Please try again later.');
        } else {
          setError(authError.message);
        }
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      // Handle network or unexpected errors
      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('network')) {
          setError('Network error. Please check your internet connection.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes
  const handleDemoSignup = () => {
    router.push('/dashboard');
  };

  const getPasswordStrength = (): number => {
    const password = formData.password;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // Map to 1-4 scale
    if (strength <= 2) return 1;
    if (strength === 3) return 2;
    if (strength === 4) return 3;
    return 4;
  };

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="signup-page">
      {/* Left Panel - Dark Branding */}
      <div className="signup-brand-panel">
        {/* Background Effects */}
        <div className="brand-bg-effects">
          <div className="glow-1" />
          <div className="glow-2" />
          <div className="noise-overlay" />
          <div className="dot-pattern" />
        </div>

        <div className="brand-content">
          {/* Logo */}
          <Fade triggerOnce>
            <Link href="/" className="brand-logo">
              <div className="brand-logo-icon">
                <Zap size={20} color="white" />
              </div>
              <span className="brand-logo-text">Electricity Bill OS</span>
            </Link>
          </Fade>

          {/* Hero Text */}
          <div className="brand-hero">
            <Slide direction="up" triggerOnce delay={100}>
              <h1>
                Start Saving on <br />
                <span className="text-gradient">Energy Costs Today</span>
              </h1>
            </Slide>
            <Fade triggerOnce delay={300}>
              <p>
                Join 500+ businesses using AI to audit bills, detect anomalies, and optimize multi-site consumption.
              </p>
            </Fade>
          </div>

          {/* 3D Visual Card */}
          <JackInTheBox triggerOnce delay={400}>
            <div className="visual-card">
              <div className="visual-card-inner">
                <div className="shine-effect" />

                {/* Card Header */}
                <div className="visual-header">
                  <div className="visual-header-left">
                    <div className="visual-avatar">
                      <Building2 size={20} color="white" />
                    </div>
                    <div className="visual-company">
                      {/* <div className="company-bar" /> */}
                      <span className="visual-avatar-text">Autopilot-Offices</span>
                      <div className="company-bar-medium" />
                    </div>
                  </div>
                  <div className="optimized-badge">Optimized</div>
                </div>

                {/* Chart */}
                <div className="visual-chart-section">
                  <div className="visual-bars">
                    {[60, 40, 80, 70, 50].map((h, i) => (
                      <div key={i} className="bar-container">
                        <div
                          className="bar-bg"
                          style={{ height: `${h + 20}px` }}
                        >
                          <div
                            className="bar-fill"
                            style={{ height: `${h}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="chart-line" />
                  <div className="chart-labels">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                </div>

                {/* Savings Footer */}
                <div className="visual-footer">
                  <div className="savings-info">
                    <TrendingUp size={16} className="savings-icon" />
                    <span>Savings Found</span>
                  </div>
                  <span className="savings-amount">₹ 12,450</span>
                </div>
              </div>

              {/* Floating Elements */}
              {/* <div className="floating-badge floating-badge-1">
              <Zap size={20} className="text-yellow-500" />
            </div> */}
              <div className="floating-badge floating-badge-2">
                <FileCheck size={20} className="text-emerald-400" />
              </div>
            </div>
          </JackInTheBox>

          {/* Trust Badges */}
          <Fade cascade damping={0.2} triggerOnce delay={600}>
            <div className="trust-badges">
              <div className="trust-badge">
                <ShieldCheck size={20} color="#10b981" />
                <span>Bank-grade Security</span>
              </div>
              <div className="trust-badge">
                <Zap size={20} color="#facc15" />
                <span>Instant Setup</span>
              </div>
            </div>
          </Fade>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="signup-form-panel">
        <div className="form-container">
          {/* Mobile Logo */}
          <div className="mobile-logo">
            <Link href="/" className="mobile-logo-link">
              <div className="mobile-logo-icon">
                <Zap size={16} color="white" />
              </div>
              <span className="mobile-logo-text">Electricity Bill OS</span>
            </Link>
          </div>

          {/* Progress Steps */}
          <Fade triggerOnce>
            <div className="progress-section">
              <div className="progress-steps">
                <div className="progress-line" />
                {[1, 2, 3].map(s => (
                  <div
                    key={s}
                    className={`progress-step ${step >= s ? 'active' : ''}`}
                  >
                    {step > s ? <Check size={16} /> : s}
                  </div>
                ))}
              </div>
              <div className="progress-labels">
                <span>Account</span>
                <span>Business</span>
                <span>Verify</span>
              </div>
            </div>
          </Fade>

          {/* Form Card */}
          <Zoom triggerOnce duration={500} delay={200}>
            <div className="form-card">
              <form onSubmit={handleSignup}>
                {error && (
                  <AttentionSeeker effect="shake">
                    <div className="form-error">{error}</div>
                  </AttentionSeeker>
                )}

                {/* Step 1 - Account */}
                <div className={`form-step ${step === 1 ? 'active' : 'hidden'}`}>
                  <h2>Create Account</h2>
                  <p className="step-subtitle">Enter your details to get started.</p>

                  <div className="form-fields">
                    <div className="field-group">
                      <label htmlFor="fullName">Full Name</label>
                      <div className="input-wrapper">
                        <User size={18} className="input-icon" />
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label htmlFor="email">Work Email</label>
                      <div className="input-wrapper">
                        <Mail size={18} className="input-icon" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn btn-primary full-width"
                    >
                      Continue
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Step 2 - Business */}
                <div className={`form-step ${step === 2 ? 'active' : 'hidden'}`}>
                  <h2>Business Details</h2>
                  <p className="step-subtitle">Tell us about your organization.</p>

                  <div className="form-fields">
                    <div className="field-group">
                      <label htmlFor="companyName">Company Name</label>
                      <div className="input-wrapper">
                        <Building2 size={18} className="input-icon" />
                        <input
                          id="companyName"
                          name="companyName"
                          type="text"
                          value={formData.companyName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label htmlFor="meters">Number of Meters/Sites</label>
                      <select
                        id="meters"
                        name="meters"
                        value={formData.meters}
                        onChange={handleChange}
                      >
                        <option value="1-5">1-5 Meters</option>
                        <option value="5-20">5-20 Meters</option>
                        <option value="20-100">20-100 Meters</option>
                        <option value="100+">100+ Meters</option>
                      </select>
                    </div>

                    <div className="button-row">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn btn-secondary"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn btn-primary"
                      >
                        Next
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 3 - Verify */}
                <div className={`form-step ${step === 3 ? 'active' : 'hidden'}`}>
                  <h2>Secure Account</h2>
                  <p className="step-subtitle">Set a strong password.</p>

                  <div className="form-fields">
                    <div className="field-group">
                      <label htmlFor="password">Password</label>
                      <div className="input-wrapper">
                        <Lock size={18} className="input-icon" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          minLength={8}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      {/* Password Strength */}
                      <div className="password-strength">
                        {[1, 2, 3, 4].map(level => (
                          <div
                            key={level}
                            className={`strength-bar ${getPasswordStrength() >= level ? 'filled' : ''}`}
                          />
                        ))}
                      </div>
                      {formData.password && (
                        <p className="strength-label">
                          Strength: {strengthLabels[getPasswordStrength()]}
                        </p>
                      )}
                    </div>

                    <div className="terms-checkbox">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                      />
                      <label htmlFor="terms">
                        I agree to the{' '}
                        <Link href="/terms" className="link">Terms</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="link">Privacy Policy</Link>
                      </label>
                    </div>

                    <div className="button-row">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn btn-secondary"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !agreedToTerms}
                        className="btn btn-primary"
                      >
                        {loading ? (
                          <>
                            <span className="spinner" />
                            Processing...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    </div>

                    {/* Demo button */}
                    <button
                      type="button"
                      onClick={handleDemoSignup}
                      className="btn btn-outline full-width demo-btn"
                    >
                      Continue with Demo Account
                    </button>
                  </div>
                </div>
              </form>

              {/* Bottom Gradient Line */}
              <div className="form-card-accent" />
            </div>
          </Zoom>

          {/* Sign In Link */}
          <Fade triggerOnce delay={400}>
            <p className="signin-link">
              Already have an account?{' '}
              <Link href="/login" className="link">Sign in</Link>
            </p>
          </Fade>
        </div>
      </div>

      <style jsx>{`
                .signup-page {
                    min-height: 100vh;
                    display: flex;
                }

                /* Left Brand Panel */
                .signup-brand-panel {
                    flex: 1;
                    background: var(--color-neutral-900);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: var(--space-12);
                }

                .brand-bg-effects {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }

                .glow-1 {
                    position: absolute;
                    top: -20%;
                    left: -20%;
                    width: 80%;
                    height: 80%;
                    background: var(--color-accent-500);
                    opacity: 0.2;
                    filter: blur(120px);
                    border-radius: 50%;
                }

                .glow-2 {
                    position: absolute;
                    bottom: -10%;
                    right: -10%;
                    width: 60%;
                    height: 60%;
                    background: var(--color-warning-500);
                    opacity: 0.1;
                    filter: blur(100px);
                    border-radius: 50%;
                }

                .noise-overlay {
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                    opacity: 0.1;
                }

                .dot-pattern {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 30px 30px;
                }

                .brand-content {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 480px;
                }

                .brand-logo {
                    display: inline-flex;
                    align-items: center;
                    color: rgba(255,255,255,0.8);
                    margin-bottom: 48px;
                    transition: color 0.2s;
                }

                .brand-logo:hover {
                    color: white;
                }

                .brand-logo-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-md);
                    background: var(--color-accent-500);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: var(--space-3);
                    box-shadow: 0 0 15px rgba(14,165,233,0.5);
                }

                .brand-logo-text {
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                }

                .brand-hero {
                    margin-bottom: 32px;
                }

                .brand-hero h1 {
                    font-size: 40px;
                    font-weight: 700;
                    color: white;
                    line-height: 1.2;
                    margin-bottom: 24px;
                }

                .text-gradient {
                    background: linear-gradient(to right, var(--color-accent-400), var(--color-success-400));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .brand-hero p {
                    font-size: var(--text-base);
                    color: var(--color-neutral-400);
                    line-height: 1.6;
                    max-width: 400px;
                }

                /* Visual Card */
                .visual-card {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 16/10;
                    perspective: 1000px;
                }

                .visual-card-inner {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    border: 1px solid rgba(56, 189, 248, 0.2);
                    box-shadow: 
                        0 25px 50px -12px rgba(0,0,0,0.6),
                        0 0 0 1px rgba(255,255,255,0.05),
                        inset 0 1px 0 rgba(255,255,255,0.1);
                    padding: 28px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    overflow: hidden;
                    animation: cardFloat 6s ease-in-out infinite;
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                                box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                                border-color 0.4s ease;
                    cursor: pointer;
                }

                .visual-card:hover .visual-card-inner {
                    transform: translateY(-12px) scale(1.02) rotateX(5deg);
                    box-shadow: 
                        0 35px 60px -15px rgba(0,0,0,0.7),
                        0 0 40px rgba(14, 165, 233, 0.15),
                        0 0 0 1px rgba(255,255,255,0.1),
                        inset 0 1px 0 rgba(255,255,255,0.15);
                    border-color: rgba(56, 189, 248, 0.4);
                    animation-play-state: paused;
                }

                @keyframes cardFloat {
                    0%, 100% { transform: translateY(0) rotateX(0deg); }
                    50% { transform: translateY(-8px) rotateX(2deg); }
                }

                .shine-effect {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 60%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.15), rgba(255,255,255,0.2), transparent);
                    transform: skewX(-15deg);
                    animation: shine 4s ease-in-out infinite;
                }

                @keyframes shine {
                    0%, 100% { left: -100%; }
                    50% { left: 150%; }
                }

                .visual-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .visual-header-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .visual-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 
                        0 4px 15px rgba(14, 165, 233, 0.5),
                        0 0 25px rgba(14, 165, 233, 0.3);
                    animation: avatarPulse 3s ease-in-out infinite;
                }

                @keyframes avatarPulse {
                    0%, 100% { box-shadow: 0 4px 15px rgba(14, 165, 233, 0.5), 0 0 25px rgba(14, 165, 233, 0.3); }
                    50% { box-shadow: 0 4px 20px rgba(14, 165, 233, 0.7), 0 0 35px rgba(14, 165, 233, 0.4); }
                }

                .visual-company {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .company-bar {
                    width: 100px;
                    height: 10px;
                    background: linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.3));
                    border-radius: 5px;
                }

                .company-bar-sm {
                    width: 64px;
                    height: 6px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 3px;
                }

                .optimized-badge {
                    padding: 6px 14px;
                    border-radius: 8px;
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(52, 211, 153, 0.15) 100%);
                    border: 1px solid rgba(52, 211, 153, 0.4);
                    color: #34d399;
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                    text-shadow: 0 0 10px rgba(52, 211, 153, 0.5);
                    animation: badgePulse 2s ease-in-out infinite;
                }

                @keyframes badgePulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.85; }
                }

                .visual-chart-section {
                    margin-top: 24px;
                }

                .visual-bars {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 12px;
                    height: 100px;
                    padding: 0 8px;
                }

                .bar-container {
                    flex: 1;
                }

                .bar-bg {
                    width: 100%;
                    background: rgba(71, 85, 105, 0.5);
                    border-radius: 6px 6px 0 0;
                    position: relative;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .bar-container:nth-child(1) .bar-bg { animation: barGrow 0.8s ease-out 0.1s both; }
                .bar-container:nth-child(2) .bar-bg { animation: barGrow 0.8s ease-out 0.2s both; }
                .bar-container:nth-child(3) .bar-bg { animation: barGrow 0.8s ease-out 0.3s both; }
                .bar-container:nth-child(4) .bar-bg { animation: barGrow 0.8s ease-out 0.4s both; }
                .bar-container:nth-child(5) .bar-bg { animation: barGrow 0.8s ease-out 0.5s both; }

                @keyframes barGrow {
                    from { transform: scaleY(0); opacity: 0; }
                    to { transform: scaleY(1); opacity: 1; }
                }

                .bar-fill {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    background: linear-gradient(180deg, #22d3ee 0%, #0ea5e9 50%, #0284c7 100%);
                    border-radius: 6px 6px 0 0;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 
                        0 0 15px rgba(14, 165, 233, 0.4),
                        inset 0 1px 0 rgba(255,255,255,0.3);
                }

                .visual-card:hover .bar-fill {
                    background: linear-gradient(180deg, #67e8f9 0%, #22d3ee 50%, #0ea5e9 100%);
                    box-shadow: 
                        0 0 25px rgba(14, 165, 233, 0.6),
                        inset 0 1px 0 rgba(255,255,255,0.4);
                    transform: scaleY(1.05);
                }

                .chart-line {
                    height: 1px;
                    background: rgba(255,255,255,0.1);
                    margin: 8px 0;
                }

                .chart-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    font-weight: 500;
                    color: rgba(148, 163, 184, 0.9);
                    padding: 0 8px;
                }

                .visual-footer {
                    margin-top: 20px;
                    padding: 14px 16px;
                    background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    backdrop-filter: blur(8px);
                }

                .savings-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: rgba(255, 255, 255, 0.95);
                    font-size: 14px;
                    font-weight: 500;
                }

                .savings-icon {
                    color: #10b981;
                    filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.5));
                }

                .savings-amount {
                    font-size: 20px;
                    font-weight: 800;
                    color: white;
                    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
                    letter-spacing: -0.01em;
                }

                .floating-badge {
                    position: absolute;
                    padding: 14px;
                    border-radius: 14px;
                    box-shadow: 
                        0 10px 30px rgba(0,0,0,0.4),
                        0 0 0 1px rgba(255,255,255,0.1);
                    z-index: 20;
                    animation: float 5s ease-in-out infinite;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .floating-badge:hover {
                    transform: scale(1.1);
                }

                .floating-badge-1 {
                    top: -24px;
                    right: -24px;
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border: 1px solid rgba(0,0,0,0.05);
                    box-shadow: 
                        0 10px 30px rgba(0,0,0,0.2),
                        0 0 40px rgba(234, 179, 8, 0.2);
                }

                .floating-badge-2 {
                    bottom: -20px;
                    left: -20px;
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    border: 1px solid rgba(52, 211, 153, 0.3);
                    animation-delay: 1s;
                    box-shadow: 
                        0 10px 30px rgba(0,0,0,0.4),
                        0 0 30px rgba(16, 185, 129, 0.15);
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(3deg); }
                }

                .trust-badges {
                    display: flex;
                    gap: var(--space-8);
                    margin-top: var(--space-12);
                    padding: var(--space-4) 0;
                }

                .trust-badge {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: var(--text-sm);
                    font-weight: 500;
                    color: var(--color-neutral-300);
                }

                .trust-badge :global(svg) {
                    filter: drop-shadow(0 0 4px currentColor);
                }

                /* Right Form Panel */
                .signup-form-panel {
                    flex: 1;
                    background: var(--color-neutral-900);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: var(--space-6) var(--space-12);
                    position: relative;
                    overflow: hidden;
                }

                .signup-form-panel::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    right: -20%;
                    width: 60%;
                    height: 60%;
                    background: var(--color-accent-500);
                    opacity: 0.08;
                    filter: blur(100px);
                    border-radius: 50%;
                    transform: translateY(-50%);
                }

                .form-container {
                    width: 100%;
                    max-width: 420px;
                }

                .mobile-logo {
                    display: none;
                    margin-bottom: 32px;
                }

                .mobile-logo-link {
                    display: flex;
                    align-items: center;
                }

                .mobile-logo-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-md);
                    background: var(--color-accent-500);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: var(--space-2);
                }

                .mobile-logo-text {
                    font-size: var(--text-xl);
                    font-weight: 700;
                    color: var(--color-neutral-50);
                }

                /* Progress Steps */
                .progress-section {
                    margin-bottom: 40px;
                }

                .progress-steps {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                }

                .progress-line {
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 100%;
                    height: 2px;
                    background: var(--color-neutral-700);
                    z-index: 0;
                }

                .progress-step {
                    position: relative;
                    z-index: 1;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: var(--text-sm);
                    font-weight: 600;
                    background: var(--color-neutral-800);
                    color: var(--color-neutral-500);
                    border: 1px solid var(--color-neutral-700);
                    transition: all 0.3s ease;
                }

                .progress-step.active {
                    background: var(--color-accent-500);
                    color: white;
                    border-color: var(--color-accent-500);
                    box-shadow: 0 0 0 4px rgba(14,165,233,0.15);
                    transform: scale(1.1);
                }

                .progress-labels {
                    display: flex;
                    justify-content: space-between;
                    margin-top: var(--space-2);
                    font-size: var(--text-xs);
                    font-weight: 500;
                    color: var(--color-neutral-400);
                }

                /* Form Card */
                .form-card {
                    background: var(--bg-card);
                    backdrop-filter: blur(12px);
                    border-radius: var(--radius-2xl);
                    box-shadow: var(--shadow-xl);
                    border: 1px solid rgba(255,255,255,0.1);
                    overflow: hidden;
                    position: relative;
                    z-index: 10;
                }

                .form-card form {
                    padding: 32px;
                }

                .form-error {
                    padding: 12px 16px;
                    background: rgba(239, 68, 68, 0.15);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 8px;
                    color: #f87171;
                    font-size: 14px;
                    margin-bottom: 20px;
                }

                .form-step {
                    display: none;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .form-step.active {
                    display: block;
                    opacity: 1;
                }

                .form-step.hidden {
                    display: none;
                }

                .form-step h2 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #f8fafc;
                    margin-bottom: 4px;
                }

                .step-subtitle {
                    font-size: 14px;
                    color: #94a3b8;
                    margin-bottom: 24px;
                }

                .form-fields {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .field-group label {
                    font-size: var(--text-sm);
                    font-weight: 500;
                    color: var(--color-neutral-200);
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: var(--space-3);
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--color-neutral-500);
                    pointer-events: none;
                }

                .input-wrapper input {
                    width: 100%;
                    padding: var(--space-3) 44px var(--space-3) 42px;
                    border: 1px solid var(--color-neutral-700);
                    border-radius: var(--radius-md);
                    font-size: var(--text-sm);
                    color: var(--color-neutral-50);
                    transition: all var(--transition-base);
                    background: var(--color-neutral-900);
                }

                .input-wrapper input:focus {
                    outline: none;
                    border-color: var(--color-accent-500);
                    box-shadow: 0 0 0 3px rgba(14,165,233,0.15);
                }

                .input-wrapper input::placeholder {
                    color: var(--color-neutral-500);
                }

                select {
                    width: 100%;
                    padding: var(--space-3);
                    border: 1px solid var(--color-neutral-700);
                    border-radius: var(--radius-md);
                    font-size: var(--text-sm);
                    color: var(--color-neutral-50);
                    background: var(--color-neutral-900);
                    cursor: pointer;
                    transition: all var(--transition-base);
                }

                select option {
                    background: var(--color-neutral-800);
                    color: var(--color-neutral-50);
                }

                select:focus {
                    outline: none;
                    border-color: var(--color-accent-500);
                    box-shadow: 0 0 0 3px rgba(14,165,233,0.15);
                }

                .password-toggle {
                    position: absolute;
                    right: var(--space-3);
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--color-neutral-500);
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: var(--space-1);
                }

                .password-toggle:hover {
                    color: var(--color-neutral-400);
                }

                .password-strength {
                    display: flex;
                    gap: var(--space-1);
                    margin-top: var(--space-2);
                }

                .strength-bar {
                    height: 4px;
                    flex: 1;
                    background: var(--color-neutral-700);
                    border-radius: 2px;
                    transition: background 0.3s;
                }

                .strength-bar.filled {
                    background: var(--color-success-500);
                }

                .strength-label {
                    font-size: var(--text-xs);
                    color: var(--color-neutral-400);
                    margin-top: var(--space-1);
                }

                .terms-checkbox {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-2);
                }

                .terms-checkbox input {
                    width: 16px;
                    height: 16px;
                    margin-top: 2px;
                    accent-color: var(--color-accent-500);
                }

                .terms-checkbox label {
                    font-size: var(--text-sm);
                    color: var(--color-neutral-400);
                }

                .link {
                    color: var(--color-accent-400);
                    font-weight: 500;
                    transition: color var(--transition-base);
                }

                .link:hover {
                    color: var(--color-accent-300);
                }

                .button-row {
                    display: flex;
                    gap: var(--space-3);
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-2);
                    padding: var(--space-3) var(--space-5);
                    border-radius: var(--radius-md);
                    font-size: var(--text-sm);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all var(--transition-base);
                    flex: 1;
                    border: none;
                }

                .btn-primary {
                    background: linear-gradient(135deg, var(--color-accent-500) 0%, var(--color-accent-600) 100%);
                    color: white;
                    box-shadow: 0 4px 15px rgba(14,165,233,0.35);
                }

                .btn-primary:hover {
                    box-shadow: 0 6px 25px rgba(14,165,233,0.5);
                    transform: translateY(-2px);
                }

                .btn-primary:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .btn-secondary {
                    background: var(--color-neutral-800);
                    color: var(--color-neutral-200);
                    border: 1px solid var(--color-neutral-700);
                }

                .btn-secondary:hover {
                    background: var(--color-neutral-700);
                }

                .btn-outline {
                    background: transparent;
                    color: var(--color-neutral-400);
                    border: 1px solid var(--color-neutral-700);
                }

                .btn-outline:hover {
                    background: rgba(255,255,255,0.05);
                    color: var(--color-neutral-200);
                }

                .demo-btn {
                    margin-top: 12px;
                }

                .full-width {
                    width: 100%;
                }

                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid white;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .form-card-accent {
                    height: 6px;
                    background: linear-gradient(90deg, #38bdf8, #0ea5e9, #34d399);
                }

                .signin-link {
                    margin-top: 32px;
                    text-align: center;
                    font-size: 14px;
                    color: #94a3b8;
                    position: relative;
                    z-index: 10;
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .signup-brand-panel {
                        display: none;
                    }

                    .signup-form-panel {
                        padding: 24px;
                    }

                    .mobile-logo {
                        display: block;
                    }
                }

                @media (max-width: 480px) {
                    .form-container {
                        max-width: 100%;
                    }

                    .form-card form {
                        padding: 24px;
                    }

                    .button-row {
                        flex-direction: column;
                    }
                }
            `}</style>
    </div>
  );
}
