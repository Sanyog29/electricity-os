'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Building2,
  ClipboardCheck,
  GitBranch,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Zap,
  ChevronDown,
  User,
  Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Bills', href: '/bills', icon: FileText },
  { label: 'Sites & Meters', href: '/sites', icon: Building2 },
  { label: 'Audits', href: '/audits', icon: ClipboardCheck },
  { label: 'Workflows', href: '/workflows', icon: GitBranch },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        });
      }
    };
    getUser();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Zap size={24} color="white" />
          </div>
          <span className="logo-text">BillOS</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="nav-icon" size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="sidebar-footer">
          <div className="user-card" onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <div className="user-avatar">
              <User size={18} />
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-email">{user?.email || 'Loading...'}</div>
            </div>
            <ChevronDown
              size={16}
              className={`user-chevron ${userMenuOpen ? 'open' : ''}`}
            />
          </div>

          {userMenuOpen && (
            <div className="user-menu">
              <Link href="/settings" className="user-menu-item">
                <Settings size={16} />
                <span>Settings</span>
              </Link>
              <button
                className="user-menu-item signout-btn"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content area */}
      <div className="main-content">
        {/* Top header */}
        <header className="top-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="header-right">
            <button className="btn btn-ghost btn-icon notification-btn">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          {children}
        </main>
      </div>

      <style jsx>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
          width: 100%;
        }

        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1019;
          display: none;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: var(--space-4);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: background var(--transition-base);
        }

        .user-card:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-lg);
          background: var(--bg-elevated);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-neutral-400);
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-neutral-100);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: var(--text-xs);
          color: var(--color-neutral-500);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-chevron {
          color: var(--color-neutral-500);
          transition: transform var(--transition-base);
          flex-shrink: 0;
        }

        .user-chevron.open {
          transform: rotate(180deg);
        }

        .user-menu {
          margin-top: var(--space-2);
          background: var(--bg-elevated);
          border-radius: var(--radius-lg);
          padding: var(--space-2);
          animation: slideUp 0.2s ease;
        }

        .user-menu-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          width: 100%;
          padding: var(--space-2) var(--space-3);
          font-size: var(--text-sm);
          color: var(--color-neutral-300);
          border-radius: var(--radius-md);
          transition: all var(--transition-base);
        }

        .user-menu-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-neutral-100);
        }

        .user-menu-item:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .signout-btn:hover:not(:disabled) {
          color: var(--color-error-400);
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .main-content {
          flex: 1;
          min-width: 0;
          width: 100%;
        }

        .top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) 0;
          margin-bottom: var(--space-4);
        }

        .mobile-menu-btn {
          display: none;
          padding: var(--space-2);
          color: var(--color-neutral-300);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-left: auto;
        }

        .notification-btn {
          position: relative;
        }

        .page-content {
          animation: fadeIn 0.3s ease;
          width: 100%;
        }

        /* Tablet and smaller laptops */
        @media (max-width: 1024px) {
          .sidebar {
            width: 220px;
          }
          
          .main-content {
            margin-left: 220px;
            padding: var(--space-6);
          }
        }

        /* Mobile and small tablets */
        @media (max-width: 768px) {
          .sidebar-overlay {
            display: block;
          }

          .sidebar {
            transform: translateX(-100%);
            width: 280px;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .main-content {
            margin-left: 0;
            padding: var(--space-4);
          }

          .mobile-menu-btn {
            display: flex;
          }

          .top-header {
            margin-bottom: var(--space-4);
          }
        }

        /* Extra small devices */
        @media (max-width: 480px) {
          .main-content {
            padding: var(--space-3);
          }

          .top-header {
            padding: var(--space-2) 0;
          }
        }
      `}</style>
    </div>
  );
}
