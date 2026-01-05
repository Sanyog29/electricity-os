'use client';

import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

export interface PieChartDataPoint {
    name: string;
    value: number;
    color?: string;
    [key: string]: string | number | undefined;
}

interface PieChartProps {
    data: PieChartDataPoint[];
    title?: string;
    height?: number;
    showLegend?: boolean;
    formatValue?: (value: number) => string;
    innerRadius?: number;
    outerRadius?: number;
}

const COLORS = [
    '#0ea5e9', // cyan
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ef4444', // red
    '#06b6d4', // teal
    '#ec4899', // pink
    '#84cc16', // lime
];

export function PieChart({
    data,
    title,
    height = 300,
    showLegend = true,
    formatValue = (v) => v.toLocaleString(),
    innerRadius = 60,
    outerRadius = 100
}: PieChartProps) {
    // Validate and filter data
    const safeData = data.filter(d =>
        d && typeof d.name === 'string' && typeof d.value === 'number' && !isNaN(d.value) && d.value > 0
    );

    if (safeData.length === 0) {
        return (
            <div className="chart-empty" style={{ height }}>
                <p>No data available</p>
            </div>
        );
    }

    // Calculate total for percentage
    const total = safeData.reduce((sum, d) => sum + d.value, 0);

    const renderCustomLabel = (props: PieLabelRenderProps) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

        // Handle undefined values
        if (
            typeof cx !== 'number' ||
            typeof cy !== 'number' ||
            typeof midAngle !== 'number' ||
            typeof innerRadius !== 'number' ||
            typeof outerRadius !== 'number' ||
            typeof percent !== 'number' ||
            percent < 0.05
        ) {
            return null;
        }

        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fontWeight={600}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="chart-container">
            {title && <h4 className="chart-title">{title}</h4>}
            <ResponsiveContainer width="100%" height={height}>
                <RechartsPieChart>
                    <Pie
                        data={safeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        paddingAngle={2}
                        dataKey="value"
                        labelLine={false}
                        label={renderCustomLabel}
                        animationDuration={1000}
                    >
                        {safeData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color || COLORS[index % COLORS.length]}
                                stroke="transparent"
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--color-neutral-800)',
                            border: '1px solid var(--color-neutral-700)',
                            borderRadius: '8px',
                            color: 'var(--color-neutral-100)'
                        }}
                        formatter={(value) => {
                            const numValue = Number(value) || 0;
                            return [
                                `${formatValue(numValue)} (${((numValue / total) * 100).toFixed(1)}%)`,
                                ''
                            ];
                        }}
                    />
                    {showLegend && (
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => (
                                <span style={{ color: 'var(--color-neutral-300)', fontSize: 12 }}>
                                    {value}
                                </span>
                            )}
                        />
                    )}
                </RechartsPieChart>
            </ResponsiveContainer>

            {/* Center label for donut chart */}
            <div className="center-label">
                <div className="center-value">{formatValue(total)}</div>
                <div className="center-text">Total</div>
            </div>

            <style jsx>{`
        .chart-container {
          width: 100%;
          position: relative;
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
        .center-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -60%);
          text-align: center;
          pointer-events: none;
        }
        .center-value {
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--color-neutral-100);
        }
        .center-text {
          font-size: var(--text-xs);
          color: var(--color-neutral-500);
        }
      `}</style>
        </div>
    );
}
