import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Participant } from '../../types';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { Moon } from 'lucide-react';

interface SleepDurationChartProps {
  participant: Participant;
}

export const SleepDurationChart: React.FC<SleepDurationChartProps> = ({ participant }) => {
  const { records, baseline, id } = participant;

  // Format data for Recharts, keeping missing readings as null
  const chartData = records.map((r) => ({
    dayLabel: `${r.testPhase === 'PRE_TEST' ? 'PRE' : r.testPhase === 'POST_TEST' ? 'P' : 'D'}${r.bedrestDay}`,
    fullDay: `${r.testPhase} Day ${r.bedrestDay}`,
    date: r.date,
    durationHours: r.durationHours, // null if missing
    durationMinutes: r.durationMinutes,
    phase: r.testPhase,
    rawDuration: r.rawDuration,
    notes: r.notes,
  }));

  // Phase color mapping
  const getBarColor = (phase: string, val: number | null) => {
    if (val === null) return 'transparent';
    if (phase === 'PRE_TEST') return '#E65100'; // Mission Orange for baseline days
    if (phase === 'POST_TEST') return '#689F00'; // Lime for post-test recovery
    return '#665584'; // Dusty Violet for 60-day in-test bedrest
  };

  return (
    <div className="bg-habitat-panel rounded-lg border border-habitat-border p-6 shadow-instrument space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap pb-3 border-b border-habitat-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Moon className="w-4 h-4 text-mission-violet" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-spaceText-secondary">
              Actigraphy Telemetry // Sleep Duration
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-spaceText-primary">
            Daily Sleep Duration Across Study Phases
          </h3>
          <p className="text-xs text-spaceText-secondary mt-0.5">
            Total recorded sleep time per night in decimal hours. Missing readings are rendered as gaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ProvenanceBadge provenance="VERIFIED_NASA_RESEARCH_DATA" />
          <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-spaceText-secondary">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-mission-orange" />
              <span>PRE_TEST</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-mission-violet" />
              <span>IN_TEST (BEDREST)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-mission-lime" />
              <span>POST_TEST</span>
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Bar Container */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(23, 24, 29, 0.08)" vertical={false} />
            <XAxis
              dataKey="dayLabel"
              tickLine={false}
              axisLine={{ stroke: 'rgba(23, 24, 29, 0.2)' }}
              tick={{ fontSize: 10, fill: '#585E6D', fontFamily: 'Space Mono' }}
              interval={4} // sample ticks every 5 days for clarity across 69 days
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              tickLine={false}
              axisLine={{ stroke: 'rgba(23, 24, 29, 0.2)' }}
              tick={{ fontSize: 10, fill: '#585E6D', fontFamily: 'Space Mono' }}
              unit="h"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-habitat-graphite text-white p-3 rounded shadow-instrument-dark border border-habitat-borderDark font-mono text-xs space-y-1">
                    <div className="text-mission-lime font-bold">{d.fullDay}</div>
                    <div className="text-spaceText-muted text-[10px]">Date: {d.date}</div>
                    {d.durationHours !== null ? (
                      <div className="text-sm font-bold text-white pt-1">
                        Duration: {d.durationHours} hrs{' '}
                        <span className="text-xs text-spaceText-muted">({d.durationMinutes} min)</span>
                      </div>
                    ) : (
                      <div className="text-mission-orange font-bold pt-1">
                        UNRECORDED / MISSING SENSOR READING
                      </div>
                    )}
                    <div className="text-[10px] text-spaceText-muted pt-1 border-t border-white/10">
                      Raw: {d.rawDuration || 'NA'} | Source: UTMB Actigraphy
                    </div>
                  </div>
                );
              }}
            />

            {/* Baseline reference line for C1G0001 only (suppressed for C1G0002/C1G0003) */}
            {baseline.isAvailable && baseline.meanDurationHours !== null && (
              <ReferenceLine
                y={baseline.meanDurationHours}
                stroke="#E65100"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `PRELIMINARY BASELINE: ${baseline.meanDurationHours} hrs (N=2)`,
                  position: 'top',
                  fill: '#E65100',
                  fontSize: 10,
                  fontFamily: 'Space Mono',
                }}
              />
            )}

            <Bar dataKey="durationHours" radius={[2, 2, 0, 0]} isAnimationActive={false}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.phase, entry.durationHours)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer with Context Note */}
      <div className="pt-2 border-t border-habitat-border/50 flex flex-wrap items-center justify-between text-xs font-mono text-spaceText-secondary">
        <div>
          Showing 69 continuous days for Subject {id} (2 PRE, 60 IN, 7 POST).
        </div>
        <div>
          {baseline.isAvailable
            ? 'Reference line shows preliminary N=2 pre-test mean.'
            : 'Baseline reference suppressed: Zero valid PRE_TEST data.'}
        </div>
      </div>
    </div>
  );
};

export default SleepDurationChart;
