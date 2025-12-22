'use client';

export default function AuditsPage() {
    return (
        <div className="audits-page">
            <h1>Audit Results</h1>
            <p className="page-subtitle">Review bill audits and savings opportunities</p>

            <div className="coming-soon card">
                <h2>Coming Soon</h2>
                <p>Audit analytics and detailed findings will be displayed here.</p>
            </div>

            <style jsx>{`
        .audits-page {
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
