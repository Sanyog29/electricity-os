'use client';

import {
    AreaChart as RechartsAreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

export interface AreaChartDataPoint {
    name: string;
    value: number;
    value2?: number;
}

interface AreaChartProps {
    data: AreaChartDataPoint[];
    title?: string;
    height?: number;
    color?: string;
    color2?: string;
    dataKey?: string;
    dataKey2?: string;
    showGrid?: boolean;
    showLegend?: boolean;
    formatValue?: (value: number) => string;
    gradientId?: string;
}

export function AreaChart({
    data,
    title,
    height = 300,
    color = 'var(--color-accent-500)',
    color2,
    dataKey = 'value',
    dataKey2 = 'value2',
    showGrid = true,
    showLegend = false,
    formatValue = (v) => v.toLocaleString(),
    gradientId = 'areaGradient'
}: AreaChartProps) {
    // Validate data
    const safeData = data.filter(d =>
        d && typeof d.name === 'string' && typeof d.value === 'number' && !isNaN(d.value)
    );

    if (safeData.length === 0) {
        return (
            <div className="chart-empty" style={{ height }}>
                <p>No data available</p>
            </div>
        );
    }

    const hasSecondSeries = color2 && safeData.some(d => d.value2 !== undefined);

    return (
        <div className="chart-container">
            {title && <h4 className="chart-title">{title}</h4>}
            <ResponsiveContainer width="100%" height={height}>
                <RechartsAreaChart
                    data={safeData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                        {hasSecondSeries && (
                            <linearGradient id={`${gradientId}2`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        )}
                    </defs>
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                            vertical={false}
                        />
                    )}
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--color-neutral-500)', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--color-neutral-500)', fontSize: 12 }}
                        tickFormatter={formatValue}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--color-neutral-800)',
                            border: '1px solid var(--color-neutral-700)',
                            borderRadius: '8px',
                            color: 'var(--color-neutral-100)'
                        }}
                        formatter={(value) => [formatValue(Number(value) || 0), '']}
                    />
                    {showLegend && <Legend />}
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        fill={`url(#${gradientId})`}
                        animationDuration={1000}
                    />
                    {hasSecondSeries && (
                        <Area
                            type="monotone"
                            dataKey={dataKey2}
                            stroke="#10b981"
                            strokeWidth={2}
                            fill={`url(#${gradientId}2)`}
                            animationDuration={1000}
                        />
                    )}
                </RechartsAreaChart>
            </ResponsiveContainer>
            <style jsx>{`
        .chart-container {
          width: 100%;
        }
        .chart-title {
          font-size: var(--text-base);
          font-weight: 600;
          color: var(--color-neutral-200);
          margin-bottom: var(--space-4);
        }
        .chart-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-elevated);
          border-radius: var(--radius-lg);
          color: var(--color-neutral-500);
        }
      `}</style>
        </div>
    );
}
