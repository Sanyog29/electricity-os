'use client';

import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell
} from 'recharts';

export interface BarChartDataPoint {
    name: string;
    value: number;
    value2?: number;
    color?: string;
}

interface BarChartProps {
    data: BarChartDataPoint[];
    title?: string;
    height?: number;
    color?: string;
    color2?: string;
    dataKey?: string;
    dataKey2?: string;
    showGrid?: boolean;
    showLegend?: boolean;
    formatValue?: (value: number) => string;
    layout?: 'horizontal' | 'vertical';
    stacked?: boolean;
}

const COLORS = [
    '#0ea5e9', // cyan
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ef4444', // red
    '#06b6d4', // teal
];

export function BarChart({
    data,
    title,
    height = 300,
    color = '#0ea5e9',
    color2 = '#10b981',
    dataKey = 'value',
    dataKey2 = 'value2',
    showGrid = true,
    showLegend = false,
    formatValue = (v) => v.toLocaleString(),
    layout = 'horizontal',
    stacked = false
}: BarChartProps) {
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

    const hasSecondSeries = safeData.some(d => d.value2 !== undefined);
    const useCustomColors = safeData.some(d => d.color);

    return (
        <div className="chart-container">
            {title && <h4 className="chart-title">{title}</h4>}
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart
                    data={safeData}
                    layout={layout === 'vertical' ? 'vertical' : 'horizontal'}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                            vertical={layout !== 'vertical'}
                            horizontal={layout === 'vertical'}
                        />
                    )}
                    {layout === 'vertical' ? (
                        <>
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--color-neutral-500)', fontSize: 12 }}
                                tickFormatter={formatValue}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--color-neutral-500)', fontSize: 12 }}
                                width={100}
                            />
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--color-neutral-800)',
                            border: '1px solid var(--color-neutral-700)',
                            borderRadius: '8px',
                            color: 'var(--color-neutral-100)'
                        }}
                        formatter={(value) => [formatValue(Number(value) || 0), '']}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    {showLegend && <Legend />}
                    <Bar
                        dataKey={dataKey}
                        fill={color}
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                        stackId={stacked ? 'stack' : undefined}
                    >
                        {useCustomColors && safeData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color || COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Bar>
                    {hasSecondSeries && (
                        <Bar
                            dataKey={dataKey2}
                            fill={color2}
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                            stackId={stacked ? 'stack' : undefined}
                        />
                    )}
                </RechartsBarChart>
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
