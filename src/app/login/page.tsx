'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    // For demo purposes - skip auth
    const handleDemoLogin = () => {
        router.push('/dashboard');
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Left side - branding */}
                <div className="auth-brand">
                    <div className="brand-content">
                        <Link href="/" className="logo">
                            <div className="logo-icon">
                                <Zap size={28} color="white" />
                            </div>
                            <span className="logo-text">BillOS</span>
                        </Link>
                        <h1>Welcome back</h1>
                        <p>Log in to manage your electricity bills, track savings, and optimize costs.</p>
                        <div className="brand-features">
                            <div className="brand-feature">
                                <span className="feature-dot" />
                                <span>AI-powered bill analysis</span>
                            </div>
                            <div className="brand-feature">
                                <span className="feature-dot" />
                                <span>Automated error detection</span>
                            </div>
                            <div className="brand-feature">
                                <span className="feature-dot" />
                                <span>Real-time savings insights</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - form */}
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <h2>Log in to your account</h2>
                        <p className="auth-subtitle">
                            Don't have an account?{' '}
                            <Link href="/signup" className="auth-link">Sign up</Link>
                        </p>

                        <form onSubmit={handleLogin} className="auth-form">
                            {error && (
                                <div className="alert alert-error">
                                    {error}
                                </div>
                            )}

                            <div className="input-wrapper">
                                <label className="input-label" htmlFor="email">Email address</label>
                                <div className="input-with-icon">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        id="email"
                                        type="email"
                                        className="input"
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-wrapper">
                                <label className="input-label" htmlFor="password">Password</label>
                                <div className="input-with-icon">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="input"
                                        placeholder="Enter your password"
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
                                <label className="checkbox-label">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <Link href="/forgot-password" className="auth-link">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg full-width"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="animate-spin">⏳</span>
                                ) : (
                                    <>
                                        Log in
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            {/* Demo button for testing */}
                            <button
                                type="button"
                                onClick={handleDemoLogin}
                                className="btn btn-secondary btn-lg full-width"
                                style={{ marginTop: 'var(--space-3)' }}
                            >
                                Continue with Demo Account
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: stretch;
        }

        .auth-container {
          display: flex;
          width: 100%;
        }

        .auth-brand {
          flex: 1;
          background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
          padding: var(--space-12);
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .auth-brand::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(ellipse at 30% 30%, rgba(52, 114, 255, 0.15) 0%, transparent 50%);
          pointer-events: none;
        }

        .brand-content {
          position: relative;
          z-index: 1;
          max-width: 400px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-12);
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-size: var(--text-2xl);
          font-weight: 700;
          color: var(--color-neutral-50);
        }

        .brand-content h1 {
          font-size: var(--text-4xl);
          font-weight: 700;
          margin-bottom: var(--space-4);
        }

        .brand-content p {
          font-size: var(--text-lg);
          color: var(--color-neutral-400);
          line-height: 1.6;
          margin-bottom: var(--space-8);
        }

        .brand-features {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .brand-feature {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: var(--text-sm);
          color: var(--color-neutral-300);
        }

        .feature-dot {
          width: 8px;
          height: 8px;
          background: var(--color-primary-500);
          border-radius: 50%;
        }

        .auth-form-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-8);
          background: var(--bg-primary);
        }

        .auth-form-wrapper {
          width: 100%;
          max-width: 400px;
        }

        .auth-form-wrapper h2 {
          font-size: var(--text-2xl);
          font-weight: 600;
          margin-bottom: var(--space-2);
        }

        .auth-subtitle {
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
          margin-bottom: var(--space-8);
        }

        .auth-link {
          color: var(--color-primary-400);
          font-weight: 500;
          transition: color var(--transition-base);
        }

        .auth-link:hover {
          color: var(--color-primary-300);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon .input {
          padding-left: 44px;
          padding-right: 44px;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-neutral-500);
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-neutral-500);
          padding: var(--space-1);
          transition: color var(--transition-base);
        }

        .password-toggle:hover {
          color: var(--color-neutral-300);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--color-neutral-400);
          cursor: pointer;
        }

        .checkbox-label input {
          width: 16px;
          height: 16px;
          accent-color: var(--color-primary-500);
        }

        .full-width {
          width: 100%;
        }

        @media (max-width: 968px) {
          .auth-brand {
            display: none;
          }

          .auth-form-container {
            padding: var(--space-6);
          }
        }
      `}</style>
        </div>
    );
}
