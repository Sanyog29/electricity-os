'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, BarChart3, FileCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Fade, Slide, Zoom, AttentionSeeker } from 'react-awesome-reveal';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError('');

    // Form validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        // Map common Supabase errors to user-friendly messages
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please verify your email address before logging in.');
        } else if (authError.message.includes('Too many requests')) {
          setError('Too many login attempts. Please try again later.');
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
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="login-page">
      {/* Left Panel - Dark Branding */}
      <div className="login-brand-panel">
        <div className="brand-bg-effects">
          <div className="glow-1" />
          <div className="glow-2" />
          <div className="dot-pattern" />
        </div>

        <div className="brand-content">
          <Fade triggerOnce>
            <Link href="/" className="brand-logo">
              <div className="brand-logo-icon">
                <Zap size={20} color="white" />
              </div>
              <span className="brand-logo-text">Electricity Bill OS</span>
            </Link>
          </Fade>

          <div className="brand-hero">
            <Slide direction="up" triggerOnce delay={100}>
              <h1>
                Welcome <br />
                <span className="text-gradient">Back</span>
              </h1>
            </Slide>
            <Fade triggerOnce delay={300}>
              <p>
                Log in to manage your electricity bills, track savings, and optimize costs across all your sites.
              </p>
            </Fade>
          </div>

          <Fade cascade damping={0.15} triggerOnce delay={400}>
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <BarChart3 size={18} color="var(--color-accent-500)" />
                </div>
                <span>AI-powered bill analysis</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <ShieldCheck size={18} color="var(--color-success-500)" />
                </div>
                <span>Automated error detection</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <FileCheck size={18} color="var(--color-warning-500)" />
                </div>
                <span>Real-time savings insights</span>
              </div>
            </div>
          </Fade>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="login-form-panel">
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

          {/* Form Card */}
          <Zoom triggerOnce duration={600}>
            <div className="form-card">
              <Slide direction="down" triggerOnce delay={200}>
                <h2>Log in to your account</h2>
                <p className="form-subtitle">
                  Don't have an account?{' '}
                  <Link href="/signup" className="link">Sign up</Link>
                </p>
              </Slide>

              <form onSubmit={handleLogin}>
                {error && (
                  <AttentionSeeker effect="shake">
                    <div className="form-error">{error}</div>
                  </AttentionSeeker>
                )}

                <Fade cascade damping={0.1} triggerOnce delay={300}>
                  <div className="field-group">
                    <label htmlFor="email">Email address</label>
                    <div className="input-wrapper">
                      <Mail size={18} className="input-icon" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                      <Lock size={18} className="input-icon" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                  </div>

                  <div className="form-options">
                    <label className="remember-label">
                      <input type="checkbox" />
                      <span>Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="link">
                      Forgot password?
                    </Link>
                  </div>
                </Fade>

                <Fade triggerOnce delay={500}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Log in
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  {/* <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="btn btn-outline"
                  >
                    Continue with Demo Account
                  </button> */}
                </Fade>
              </form>

              <div className="form-card-accent" />
            </div>
          </Zoom>

          <Fade triggerOnce delay={700}>
            <p className="signup-link">
              New to Electricity Bill OS?{' '}
              <Link href="/signup" className="link">Create an account</Link>
            </p>
          </Fade>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
        }

        /* Left Brand Panel */
        .login-brand-panel {
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
          opacity: 0.15;
          filter: blur(120px);
          border-radius: 50%;
          animation: pulse-glow 4s ease-in-out infinite;
        }

        .glow-2 {
          position: absolute;
          bottom: -10%;
          right: -10%;
          width: 60%;
          height: 60%;
          background: var(--color-primary-500);
          opacity: 0.1;
          filter: blur(100px);
          border-radius: 50%;
          animation: pulse-glow 5s ease-in-out infinite reverse;
        }

        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.2; }
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
          max-width: 440px;
        }

        .brand-logo {
          display: inline-flex;
          align-items: center;
          color: rgba(255,255,255,0.8);
          margin-bottom: var(--space-12);
          transition: all var(--transition-base);
        }

        .brand-logo:hover {
          color: white;
          transform: scale(1.02);
        }

        .brand-logo-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--color-accent-500) 0%, var(--color-primary-500) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--space-3);
          box-shadow: 0 0 20px rgba(14,165,233,0.4);
        }

        .brand-logo-text {
          font-size: var(--text-xl);
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .brand-hero {
          margin-bottom: var(--space-10);
        }

        .brand-hero h1 {
          font-size: var(--text-5xl);
          font-weight: 800;
          color: var(--color-neutral-50);
          line-height: 1.1;
          margin-bottom: var(--space-5);
        }

        .text-gradient {
          background: linear-gradient(135deg, var(--color-accent-500) 0%, var(--color-accent-400) 50%, var(--color-success-400) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-hero p {
          font-size: var(--text-base);
          color: var(--color-neutral-400);
          line-height: 1.7;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          color: var(--color-neutral-300);
          font-size: var(--text-sm);
          font-weight: 500;
          transition: transform var(--transition-base);
        }

        .feature-item:hover {
          transform: translateX(8px);
        }

        .feature-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-lg);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-base);
        }

        .feature-item:hover .feature-icon {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }

        /* Right Form Panel */
        .login-form-panel {
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

        .login-form-panel::before {
          content: '';
          position: absolute;
          top: 50%;
          right: -20%;
          width: 60%;
          height: 60%;
          background: var(--color-accent-500);
          opacity: 0.06;
          filter: blur(100px);
          border-radius: 50%;
          transform: translateY(-50%);
        }

        .form-container {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 10;
        }

        .mobile-logo {
          display: none;
          margin-bottom: var(--space-8);
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
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--color-neutral-50);
        }

        /* Form Card */
        .form-card {
          background: var(--bg-card);
          backdrop-filter: blur(12px);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-xl);
          border: 1px solid rgba(255,255,255,0.1);
          padding: var(--space-8);
          position: relative;
          overflow: hidden;
        }

        .form-card h2 {
          font-size: var(--text-2xl);
          font-weight: 700;
          color: var(--color-neutral-50);
          margin-bottom: var(--space-2);
        }

        .form-subtitle {
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
          margin-bottom: var(--space-6);
        }

        .form-error {
          padding: var(--space-3) var(--space-4);
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-lg);
          color: var(--color-error-400);
          font-size: var(--text-sm);
          margin-bottom: var(--space-5);
        }

        form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
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
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-neutral-500);
          pointer-events: none;
        }

        .input-wrapper input {
          width: 100%;
          padding: 14px 44px;
          border: 1px solid var(--color-neutral-700);
          border-radius: var(--radius-lg);
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

        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-neutral-500);
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--space-1);
          transition: color var(--transition-base);
        }

        .password-toggle:hover {
          color: var(--color-neutral-400);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .remember-label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
          cursor: pointer;
        }

        .remember-label input {
          width: 16px;
          height: 16px;
          accent-color: var(--color-accent-500);
        }

        .link {
          color: var(--color-accent-400);
          font-weight: 500;
          transition: all var(--transition-base);
        }

        .link:hover {
          color: var(--color-accent-300);
          text-decoration: underline;
        }

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: 14px var(--space-6);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
          border: none;
          width: 100%;
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

        .btn-outline {
          background: transparent;
          color: var(--color-neutral-400);
          border: 1px solid var(--color-neutral-700);
          margin-top: var(--space-3);
        }

        .btn-outline:hover {
          background: rgba(255,255,255,0.05);
          color: var(--color-neutral-200);
          border-color: var(--color-neutral-600);
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-card-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--color-accent-500), var(--color-accent-400), var(--color-success-400));
        }

        .signup-link {
          margin-top: var(--space-6);
          text-align: center;
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .login-brand-panel {
            display: none;
          }

          .login-form-panel {
            padding: var(--space-6);
          }

          .mobile-logo {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .form-container {
            max-width: 100%;
          }

          .form-card {
            padding: var(--space-6);
          }
        }
      `}</style>
    </div>
  );
}
