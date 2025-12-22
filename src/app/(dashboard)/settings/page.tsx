'use client';

export default function SettingsPage() {
    return (
        <div className="settings-page">
            <h1>Settings</h1>
            <p className="page-subtitle">Manage your account and organization settings</p>

            <div className="coming-soon card">
                <h2>Coming Soon</h2>
                <p>Account settings, organization management, and preferences will be displayed here.</p>
            </div>

            <style jsx>{`
        .settings-page {
          max-width: 1400px;
        }

        h1 {
          font-size: var(--text-3xl);
          margin-bottom: var(--space-2);
        }

        .page-subtitle {
          color: var(--color-neutral-400);
          margin-bottom: var(--space-8);
        }

        .coming-soon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .coming-soon h2 {
          font-size: var(--text-2xl);
          margin-bottom: var(--space-4);
        }

        .coming-soon p {
          color: var(--color-neutral-400);
        }
      `}</style>
        </div>
    );
}
