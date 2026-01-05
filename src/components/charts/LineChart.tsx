'use client';

import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

export interface LineChartDataPoint {
    name: string;
    [key: string]: string | number;
}

interface LineSeries {
    dataKey: string;
    color: string;
    name?: string;
}

interface LineChartProps {
    data: LineChartDataPoint[];
    series: LineSeries[];
    title?: string;
    height?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    formatValue?: (value: number) => string;
    showDots?: boolean;
}

export function LineChart({
    data,
    series,
    title,
    height = 300,
    showGrid = true,
    showLegend = true,
    formatValue = (v) => v.toLocaleString(),
    showDots = true
}: LineChartProps) {
    // Validate data
    const safeData = data.filter(d => d && typeof d.name === 'string');

    if (safeData.length === 0 || series.length === 0) {
        return (
            <div className="chart-empty" style={{ height }}>
                <p>No data available</p>
            </div>
        );
    }

    return (
        <div className="chart-container">
            {title && <h4 className="chart-title">{title}</h4>}
            <ResponsiveContainer width="100%" height={height}>
                <RechartsLineChart
                    data={safeData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
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
                        formatter={(value, name) => [formatValue(Number(value) || 0), String(name)]}
                    />
                    {showLegend && (
                        <Legend
                            formatter={(value) => (
                                <span style={{ color: 'var(--color-neutral-300)', fontSize: 12 }}>
                                    {value}
                                </span>
                            )}
                        />
                    )}
                    {series.map((s, index) => (
                        <Line
                            key={s.dataKey}
                            type="monotone"
                            dataKey={s.dataKey}
                            name={s.name || s.dataKey}
                            stroke={s.color}
                            strokeWidth={2}
                            dot={showDots ? { fill: s.color, strokeWidth: 0, r: 4 } : false}
                            activeDot={{ r: 6, fill: s.color, stroke: 'white', strokeWidth: 2 }}
                            animationDuration={1000 + index * 200}
                        />
                    ))}
                </RechartsLineChart>
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
