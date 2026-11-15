import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { Participant } from '../../types';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { Percent } from 'lucide-react';

interface SleepEfficiencyChartProps {
  participant: Participant;
}

export const SleepEfficiencyChart: React.FC<SleepEfficiencyChartProps> = ({ participant }) => {
  const { records, baseline, id } = participant;

  const chartData = records.map((r) => ({
    dayLabel: `${r.testPhase === 'PRE_TEST' ? 'PRE' : r.testPhase === 'POST_TEST' ? 'P' : 'D'}${r.bedrestDay}`,
    fullDay: `${r.testPhase} Day ${r.bedrestDay}`,
    date: r.date,
    efficiencyPercent: r.efficiencyPercent, // null if missing
    phase: r.testPhase,
    notes: r.notes,
  }));

  return (
    <div className="bg-habitat-panel rounded-lg border border-habitat-border p-6 shadow-instrument space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap pb-3 border-b border-habitat-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Percent className="w-4 h-4 text-mission-lime" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-spaceText-secondary">
              Actigraphy Telemetry // Sleep Efficiency
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-spaceText-primary">
            Sleep Efficiency Percentage (Actual Sleep / Time in Bed)
          </h3>
          <p className="text-xs text-spaceText-secondary mt-0.5">
            Empirical actigraphy ratio over 60-day bedrest protocol. Unvalidated clinical thresholds are omitted.
          </p>
        </div>

        <ProvenanceBadge provenance="VERIFIED_NASA_RESEARCH_DATA" />
      </div>

      {/* Recharts Area Container */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <defs>
              <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#689F00" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#689F00" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="2 2" stroke="rgba(23, 24, 29, 0.08)" vertical={false} />
            <XAxis
              dataKey="dayLabel"
              tickLine={false}
              axisLine={{ stroke: 'rgba(23, 24, 29, 0.2)' }}
              tick={{ fontSize: 10, fill: '#585E6D', fontFamily: 'Space Mono' }}
              interval={4}
            />
            <YAxis
              domain={[60, 100]}
              ticks={[60, 70, 80, 90, 100]}
              tickLine={false}
              axisLine={{ stroke: 'rgba(23, 24, 29, 0.2)' }}
              tick={{ fontSize: 10, fill: '#585E6D', fontFamily: 'Space Mono' }}
              unit="%"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-habitat-graphite text-white p-3 rounded shadow-instrument-dark border border-habitat-borderDark font-mono text-xs space-y-1">
                    <div className="text-mission-lime font-bold">{d.fullDay}</div>
                    <div className="text-spaceText-muted text-[10px]">Date: {d.date}</div>
                    {d.efficiencyPercent !== null ? (
                      <div className="text-sm font-bold text-white pt-1">
                        Efficiency: {d.efficiencyPercent}%
                      </div>
                    ) : (
                      <div className="text-mission-orange font-bold pt-1">
                        UNRECORDED / MISSING SENSOR READING
                      </div>
                    )}
                    <div className="text-[10px] text-spaceText-muted pt-1 border-t border-white/10">
                      Phase: {d.phase} | Source: UTMB Actigraphy
                    </div>
                  </div>
                );
              }}
            />

            {/* Baseline reference line for C1G0001 only */}
            {baseline.isAvailable && baseline.meanEfficiencyPercent !== null && (
              <ReferenceLine
                y={baseline.meanEfficiencyPercent}
                stroke="#689F00"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `PRELIMINARY BASELINE: ${baseline.meanEfficiencyPercent}% (N=2)`,
                  position: 'top',
                  fill: '#689F00',
                  fontSize: 10,
                  fontFamily: 'Space Mono',
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="efficiencyPercent"
              stroke="#689F00"
              strokeWidth={2}
              fill="url(#efficiencyGradient)"
              dot={{ r: 2, fill: '#689F00', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#689F00', stroke: '#FFFFFF', strokeWidth: 2 }}
              connectNulls={false} // Clean visual gaps for missing data
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-habitat-border/50 flex flex-wrap items-center justify-between text-xs font-mono text-spaceText-secondary">
        <div>
          Subject {id} Efficiency Time-Series (0–100%).
        </div>
        <div>
          Empirical observations only; unsupported clinical cutoffs omitted.
        </div>
      </div>
    </div>
  );
};

export default SleepEfficiencyChart;
