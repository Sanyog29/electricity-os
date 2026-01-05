import { NextResponse } from 'next/server';
import { getProvidersStatus } from '@/lib/vlm';

/**
 * GET /api/vlm/status
 * Check VLM provider availability and status
 */
export async function GET() {
    try {
        const status = await getProvidersStatus();

        return NextResponse.json({
            success: true,
            ...status,
            supportedFormats: {
                images: ['JPEG', 'PNG', 'WebP', 'HEIC'],
                documents: ['PDF'],
                text: ['TXT'],
            },
        });
    } catch (error) {
        console.error('VLM status error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to check VLM status',
            },
            { status: 500 }
        );
    }
}
