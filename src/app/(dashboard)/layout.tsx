'use client';

import { MainLayout } from '@/components/layout';
import { AuroraBackground, Snowfall, MagneticCursor } from '@/components/effects';
import { AIInsightsPanel } from '@/components/ai';
import { BillProvider, SiteProvider } from '@/context';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SiteProvider>
            <BillProvider>
                {/* Aurora Background (z-index: -10) */}
                <AuroraBackground />

                {/* App Content */}
                <MainLayout>{children}</MainLayout>

                {/* AI Insights Floating Panel */}
                <AIInsightsPanel />

                {/* Magnetic Cursor Overlay */}
                <MagneticCursor />

                {/* Snowfall Layer (z-index: 100) */}
                <Snowfall />
            </BillProvider>
        </SiteProvider>
    );
}
