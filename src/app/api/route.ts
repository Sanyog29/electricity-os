import { NextResponse } from 'next/server';

/**
 * API Health Check
 * GET /api
 */
export async function GET() {
    return NextResponse.json({
        success: true,
        data: {
            status: 'healthy',
            version: '1.0.0',
            name: 'Electricity Bill OS API',
            timestamp: new Date().toISOString(),
        },
    });
}
