'use client';

export default function WorkflowsPage() {
    return (
        <div className="workflows-page">
            <h1>Workflows</h1>
            <p className="page-subtitle">Manage disputes, approvals, and tasks</p>

            <div className="coming-soon card">
                <h2>Coming Soon</h2>
                <p>Workflow management and automation tools will be displayed here.</p>
            </div>

            <style jsx>{`
        .workflows-page {
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
