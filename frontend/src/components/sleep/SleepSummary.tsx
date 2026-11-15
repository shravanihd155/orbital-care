import React from 'react';
import { Participant } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { Moon, Clock, Percent, AlertCircle, ShieldCheck } from 'lucide-react';

interface SleepSummaryProps {
  participant: Participant;
}

export const SleepSummary: React.FC<SleepSummaryProps> = ({ participant }) => {
  const { baseline, summary, id } = participant;

  return (
    <div className="space-y-4">
      {/* Explicit Scope & Phase Identification Banner */}
      <div className="flex items-center justify-between text-xs font-mono text-spaceText-secondary bg-habitat-elevated p-2.5 rounded border border-habitat-border flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-mission-lime" />
          <span>
            <strong>Summary Averages Scope:</strong> All 3 Study Phases Combined ({summary.phaseCounts.PRE_TEST} PRE_TEST + {summary.phaseCounts.IN_TEST} IN_TEST Bedrest + {summary.phaseCounts.POST_TEST} POST_TEST nights).
          </span>
        </div>
        <span className="text-[11px] text-spaceText-muted">
          {summary.missingRecordsCount} missing unrecorded nights excluded from averages
        </span>
      </div>

      {/* 4 Core Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mean Sleep Duration */}
        <MetricCard
          label="Overall Study Mean Duration"
          value={summary.meanDurationHours}
          unit="hrs"
          source={summary.dataSource}
          provenance={summary.provenance}
          subValue={
            summary.meanDurationMinutes
              ? `≈ ${summary.meanDurationMinutes} min/night across ${summary.validRecordsCount} valid nights`
              : 'No valid duration data'
          }
          icon={<Moon className="w-5 h-5 text-mission-violet" />}
          accentColor="violet"
          badgeNote={`All Phases Combined (N=${summary.validRecordsCount})`}
        />

        {/* Mean Sleep Latency */}
        <MetricCard
          label="Study Mean Sleep Latency"
          value={summary.meanLatencyMinutes}
          unit="min"
          source={summary.dataSource}
          provenance={summary.provenance}
          subValue="Time elapsed to sleep onset"
          icon={<Clock className="w-5 h-5 text-mission-orange" />}
          accentColor="orange"
          badgeNote={`All Phases Combined (N=${summary.validRecordsCount})`}
        />

        {/* Mean Sleep Efficiency */}
        <MetricCard
          label="Study Mean Efficiency"
          value={summary.meanEfficiencyPercent}
          unit="%"
          source={summary.dataSource}
          provenance={summary.provenance}
          subValue="Actual sleep time / Time in bed"
          icon={<Percent className="w-5 h-5 text-mission-lime" />}
          accentColor="lime"
          badgeNote={`All Phases Combined (N=${summary.validRecordsCount})`}
        />

        {/* Dataset Adherence & Validity */}
        <MetricCard
          label="Telemetry Completeness"
          value={summary.validRecordsCount}
          unit={`/ ${summary.totalRecords} days`}
          source={summary.dataSource}
          provenance={summary.provenance}
          subValue={
            summary.missingRecordsCount > 0
              ? `${summary.missingRecordsCount} missing readings (preserved as gaps)`
              : '100% complete sensor acquisition'
          }
          icon={<AlertCircle className={`w-5 h-5 ${summary.missingRecordsCount > 0 ? 'text-mission-orange' : 'text-mission-lime'}`} />}
          accentColor={summary.missingRecordsCount > 0 ? 'orange' : 'lime'}
          badgeNote={`PRE: ${summary.phaseCounts.PRE_TEST} | IN: ${summary.phaseCounts.IN_TEST} | POST: ${summary.phaseCounts.POST_TEST}`}
        />
      </div>

      {/* Participant Baseline Transparency Card */}
      <div className="bg-habitat-panel rounded-lg border border-habitat-border p-5 shadow-instrument">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-habitat-border">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-spaceText-secondary">
              Ambulatory Baseline Status // Subject {id}
            </span>
          </div>
          <span
            className={`font-mono text-xs font-bold px-2.5 py-1 rounded border ${
              baseline.isAvailable
                ? 'bg-mission-limeSubtle text-mission-lime border-mission-lime/40'
                : 'bg-habitat-elevated text-spaceText-muted border-habitat-border'
            }`}
          >
            {baseline.baselineLabel ?? (baseline.isAvailable ? 'BASELINE AVAILABLE' : 'BASELINE UNAVAILABLE')}
          </span>
        </div>

        {baseline.isAvailable ? (
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-mission-lime">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold">
                Preliminary baseline established from {baseline.validPreTestRecordCount} pre-test observation nights.
              </span>
            </div>

            <p className="text-xs text-spaceText-secondary leading-relaxed">
              <strong>Caveat:</strong> {baseline.baselineCaveat} Deviations calculated for {id} reflect empirical shifts from this individual 2-night reference, not deviations from a clinical population norm.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded bg-habitat-elevated border border-habitat-border text-xs font-mono">
                <span className="text-spaceText-muted">PRE_TEST MEAN DURATION</span>
                <div className="text-base font-bold text-spaceText-primary mt-0.5">
                  {baseline.meanDurationHours} hrs ({baseline.meanDurationMinutes} min)
                </div>
              </div>
              <div className="p-3 rounded bg-habitat-elevated border border-habitat-border text-xs font-mono">
                <span className="text-spaceText-muted">PRE_TEST MEAN LATENCY</span>
                <div className="text-base font-bold text-spaceText-primary mt-0.5">
                  {baseline.meanLatencyMinutes} min
                </div>
              </div>
              <div className="p-3 rounded bg-habitat-elevated border border-habitat-border text-xs font-mono">
                <span className="text-spaceText-muted">PRE_TEST MEAN EFFICIENCY</span>
                <div className="text-base font-bold text-spaceText-primary mt-0.5">
                  {baseline.meanEfficiencyPercent}%
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-spaceText-secondary leading-relaxed">
              <strong>Reason:</strong> {baseline.unavailabilityReason}
            </p>
            <div className="p-3 rounded bg-habitat-elevated border border-habitat-border font-mono text-xs text-spaceText-muted">
              Data Integrity Rule: Because no valid PRE_TEST nights exist for {id}, baseline comparisons and percentage deltas are completely suppressed. Zero synthetic baseline numbers are fabricated.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SleepSummary;
