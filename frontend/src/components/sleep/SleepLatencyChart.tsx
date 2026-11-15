import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { Participant } from '../../types';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { Clock } from 'lucide-react';

interface SleepLatencyChartProps {
  participant: Participant;
}

export const SleepLatencyChart: React.FC<SleepLatencyChartProps> = ({ participant }) => {
  const { records, baseline, id } = participant;

  const chartData = records.map((r) => ({
    dayLabel: `${r.testPhase === 'PRE_TEST' ? 'PRE' : r.testPhase === 'POST_TEST' ? 'P' : 'D'}${r.bedrestDay}`,
    fullDay: `${r.testPhase} Day ${r.bedrestDay}`,
    date: r.date,
    latencyMinutes: r.latencyMinutes, // null if missing (creates clean gap)
    phase: r.testPhase,
    rawLatency: r.rawLatency,
  }));

  return (
    <div className="bg-habitat-panel rounded-lg border border-habitat-border p-6 shadow-instrument space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap pb-3 border-b border-habitat-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-mission-orange" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-spaceText-secondary">
              Actigraphy Telemetry // Sleep Latency
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-spaceText-primary">
            Sleep Onset Latency (Minutes to Rest Consolidation)
          </h3>
          <p className="text-xs text-spaceText-secondary mt-0.5">
            Elapsed time between retiring to bed and initial sleep consolidation. Missing epochs rendered as gaps.
          </p>
        </div>

        <ProvenanceBadge provenance="VERIFIED_NASA_RESEARCH_DATA" />
      </div>

      {/* Recharts Line Container */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(23, 24, 29, 0.08)" vertical={false} />
            <XAxis
              dataKey="dayLabel"
              tickLine={false}
              axisLine={{ stroke: 'rgba(23, 24, 29, 0.2)' }}
              tick={{ fontSize: 10, fill: '#585E6D', fontFamily: 'Space Mono' }}
              interval={4}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: 'rgba(23, 24, 29, 0.2)' }}
              tick={{ fontSize: 10, fill: '#585E6D', fontFamily: 'Space Mono' }}
              unit="m"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-habitat-graphite text-white p-3 rounded shadow-instrument-dark border border-habitat-borderDark font-mono text-xs space-y-1">
                    <div className="text-mission-lime font-bold">{d.fullDay}</div>
                    <div className="text-spaceText-muted text-[10px]">Date: {d.date}</div>
                    {d.latencyMinutes !== null ? (
                      <div className="text-sm font-bold text-white pt-1">
                        Latency: {d.latencyMinutes} minutes
                      </div>
                    ) : (
                      <div className="text-mission-orange font-bold pt-1">
                        UNRECORDED / MISSING SENSOR READING
                      </div>
                    )}
                    <div className="text-[10px] text-spaceText-muted pt-1 border-t border-white/10">
                      Raw: {d.rawLatency || 'NA'} | Source: UTMB Actigraphy
                    </div>
                  </div>
                );
              }}
            />

            {/* Baseline reference line for C1G0001 only */}
            {baseline.isAvailable && baseline.meanLatencyMinutes !== null && (
              <ReferenceLine
                y={baseline.meanLatencyMinutes}
                stroke="#E65100"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `PRELIMINARY LATENCY BASELINE: ${baseline.meanLatencyMinutes} min (N=2)`,
                  position: 'top',
                  fill: '#E65100',
                  fontSize: 10,
                  fontFamily: 'Space Mono',
                }}
              />
            )}

            <Line
              type="monotone"
              dataKey="latencyMinutes"
              stroke="#E65100"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#E65100', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#E65100', stroke: '#FFFFFF', strokeWidth: 2 }}
              connectNulls={false} // NEVER connect nulls: shows missing readings as explicit gaps
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-habitat-border/50 flex flex-wrap items-center justify-between text-xs font-mono text-spaceText-secondary">
        <div>
          Subject {id} Latency Trend (Unit: Minutes).
        </div>
        <div>
          Genuine 0:00 recorded latency represented as 0 min.
        </div>
      </div>
    </div>
  );
};

export default SleepLatencyChart;
