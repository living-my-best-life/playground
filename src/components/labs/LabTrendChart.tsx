import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, Minus, ChevronDown, Calendar } from 'lucide-react';
import clsx from 'clsx';
import type { LabTrend, LabPanel } from '../../types';

interface LabTrendChartProps {
  trends: LabTrend[];
  recentPanels: LabPanel[];
}

export function LabTrendChart({ trends, recentPanels }: LabTrendChartProps) {
  const [selectedTest, setSelectedTest] = useState(trends[0]?.testName || '');
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | '2y' | 'all'>('2y');

  const selectedTrend = trends.find((t) => t.testName === selectedTest);

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), 'MMM yyyy');
  };

  const getFilteredData = () => {
    if (!selectedTrend) return [];

    const now = new Date();
    const cutoff = new Date();

    switch (timeRange) {
      case '6m':
        cutoff.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
      case '2y':
        cutoff.setFullYear(now.getFullYear() - 2);
        break;
      default:
        return selectedTrend.dataPoints;
    }

    return selectedTrend.dataPoints.filter(
      (dp) => parseISO(dp.date) >= cutoff
    );
  };

  const calculateTrend = () => {
    const data = getFilteredData();
    if (data.length < 2) return 'stable';

    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    const change = ((lastValue - firstValue) / firstValue) * 100;

    if (Math.abs(change) < 5) return 'stable';
    return change > 0 ? 'increasing' : 'decreasing';
  };

  const getTrendIcon = () => {
    const trend = calculateTrend();
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const isValueAbnormal = (value: number) => {
    if (!selectedTrend) return false;
    return value < selectedTrend.referenceRange.low || value > selectedTrend.referenceRange.high;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const isAbnormal = isValueAbnormal(value);

      return (
        <div className="bg-white border border-ehr-border rounded-lg shadow-lg p-3">
          <p className="text-xs text-ehr-text-muted">{format(parseISO(label), 'MMM d, yyyy')}</p>
          <p className={clsx(
            'text-lg font-bold',
            isAbnormal ? 'text-red-600' : 'text-ehr-text-primary'
          )}>
            {value} {selectedTrend?.unit}
          </p>
          {isAbnormal && (
            <p className="text-xs text-red-600 mt-1">
              {value < selectedTrend!.referenceRange.low ? 'Below' : 'Above'} normal range
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const data = getFilteredData();
  const latestValue = data[data.length - 1]?.value;
  const isLatestAbnormal = latestValue !== undefined && isValueAbnormal(latestValue);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-ehr-text-primary">Lab Trends</h2>
        <div className="flex items-center gap-2">
          {/* Test Selector */}
          <div className="relative">
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="ehr-input pr-8 text-sm appearance-none cursor-pointer"
            >
              {trends.map((t) => (
                <option key={t.testName} value={t.testName}>
                  {t.testName}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-ehr-text-muted pointer-events-none" />
          </div>

          {/* Time Range */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            {(['6m', '1y', '2y', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={clsx(
                  'px-2 py-1 text-xs font-medium rounded transition-colors',
                  timeRange === range
                    ? 'bg-white text-ehr-primary shadow-sm'
                    : 'text-ehr-text-secondary hover:text-ehr-text-primary'
                )}
              >
                {range === 'all' ? 'All' : range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Value Summary */}
      {selectedTrend && latestValue !== undefined && (
        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
          <div>
            <p className="text-xs text-ehr-text-muted">Latest Value</p>
            <div className="flex items-center gap-2">
              <span className={clsx(
                'text-2xl font-bold',
                isLatestAbnormal ? 'text-red-600' : 'text-ehr-text-primary'
              )}>
                {latestValue}
              </span>
              <span className="text-sm text-ehr-text-secondary">{selectedTrend.unit}</span>
              <span className={clsx(
                'flex items-center gap-1 text-sm',
                calculateTrend() === 'increasing' && 'text-amber-600',
                calculateTrend() === 'decreasing' && 'text-emerald-600',
                calculateTrend() === 'stable' && 'text-slate-500'
              )}>
                {getTrendIcon()}
              </span>
            </div>
          </div>
          <div className="border-l border-ehr-border pl-4">
            <p className="text-xs text-ehr-text-muted">Reference Range</p>
            <p className="text-sm font-medium">
              {selectedTrend.referenceRange.low} - {selectedTrend.referenceRange.high} {selectedTrend.unit}
            </p>
          </div>
          <div className="border-l border-ehr-border pl-4">
            <p className="text-xs text-ehr-text-muted">Data Points</p>
            <p className="text-sm font-medium">{data.length} results</p>
          </div>
          <div className="flex-1" />
          <button className="ehr-btn ehr-btn-secondary text-xs">
            <Calendar className="w-4 h-4" />
            Order New
          </button>
        </div>
      )}

      {/* Chart */}
      {selectedTrend && data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Reference range area */}
              <ReferenceArea
                y1={selectedTrend.referenceRange.low}
                y2={selectedTrend.referenceRange.high}
                fill="#10b981"
                fillOpacity={0.1}
              />

              {/* Reference lines */}
              <ReferenceLine
                y={selectedTrend.referenceRange.high}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{ value: 'High', position: 'right', fontSize: 10, fill: '#10b981' }}
              />
              <ReferenceLine
                y={selectedTrend.referenceRange.low}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{ value: 'Low', position: 'right', fontSize: 10, fill: '#10b981' }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isAbnormal = isValueAbnormal(payload.value);
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={isAbnormal ? '#dc2626' : '#2563eb'}
                      stroke={isAbnormal ? '#dc2626' : '#2563eb'}
                    />
                  );
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-ehr-text-muted">
          No data available for selected time range
        </div>
      )}

      {/* Recent Results Table */}
      <div>
        <h3 className="text-sm font-semibold text-ehr-text-secondary mb-2">Recent Lab Panels</h3>
        <div className="border border-ehr-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-ehr-text-secondary">Date</th>
                <th className="px-3 py-2 text-left font-medium text-ehr-text-secondary">Panel</th>
                <th className="px-3 py-2 text-left font-medium text-ehr-text-secondary">Key Results</th>
                <th className="px-3 py-2 text-right font-medium text-ehr-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ehr-border">
              {recentPanels.slice(0, 5).map((panel) => {
                const abnormalResults = panel.results.filter(
                  (r) => r.status === 'high' || r.status === 'low' || r.status === 'critical'
                );
                return (
                  <tr key={panel.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-ehr-text-secondary">
                      {format(parseISO(panel.collectedDate), 'MM/dd/yyyy')}
                    </td>
                    <td className="px-3 py-2 font-medium">{panel.name}</td>
                    <td className="px-3 py-2">
                      {abnormalResults.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {abnormalResults.slice(0, 3).map((r) => (
                            <span
                              key={r.id}
                              className={clsx(
                                'ehr-badge',
                                r.status === 'critical' ? 'ehr-badge-danger' : 'ehr-badge-warning'
                              )}
                            >
                              {r.testName}: {r.value} {r.status === 'high' ? '↑' : '↓'}
                            </span>
                          ))}
                          {abnormalResults.length > 3 && (
                            <span className="ehr-badge ehr-badge-neutral">
                              +{abnormalResults.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-emerald-600 text-xs">All normal</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button className="text-xs text-ehr-primary hover:underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
