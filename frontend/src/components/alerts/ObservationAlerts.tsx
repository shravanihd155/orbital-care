import React from 'react';
import { Participant } from '../../types';
import { generateParticipantObservations, DECISION_SUPPORT_DISCLAIMER } from '../../utils/observationGenerator';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { Info, Bell, ShieldAlert } from 'lucide-react';

interface ObservationAlertsProps {
  participant: Participant;
}

export const ObservationAlerts: React.FC<ObservationAlertsProps> = ({ participant }) => {
  const alerts = generateParticipantObservations(participant);

  return (
    <div className="bg-habitat-panel rounded-lg border border-habitat-border p-6 shadow-instrument space-y-5">
      {/* Header with Mandatory Regulatory Disclaimer */}
      <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-habitat-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-mission-orange" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-spaceText-secondary">
              Decision Support & Clinical Observations
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-spaceText-primary">
            Explainable Health Observations // Subject {participant.id}
          </h3>
          <p className="text-xs text-spaceText-secondary mt-0.5">
            Transparent observations derived from empirical dataset deltas.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded bg-habitat-graphite text-mission-lime font-mono text-xs flex items-center gap-2 border border-mission-lime/30">
          <ShieldAlert className="w-4 h-4 text-mission-orange" />
          <span className="font-bold">DECISION SUPPORT ONLY — NOT A MEDICAL DIAGNOSIS</span>
        </div>
      </div>

      {/* Prominent Legal Disclaimer Banner */}
      <div className="p-3.5 rounded-md bg-habitat-elevated border border-habitat-border font-mono text-xs text-spaceText-secondary flex items-start gap-2.5">
        <Info className="w-4 h-4 text-mission-orange flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-spaceText-primary uppercase tracking-wide">
            Notice to Flight Surgeons & Medical Operations:
          </div>
          <p className="text-[11px] leading-relaxed">
            {DECISION_SUPPORT_DISCLAIMER} Automated observations detect mathematical shifts relative to individual pre-test measurements. They do not constitute autonomous medical evaluations or diagnostic determinations.
          </p>
        </div>
      </div>

      {/* Observation Cards Stream */}
      <div className="space-y-3.5">
        {alerts.map((alert) => {
          const isCaution = alert.urgency === 'CAUTION';
          const isAdvisory = alert.urgency === 'ADVISORY';

          const cardBorder = isCaution
            ? 'border-mission-orange/50 bg-mission-orangeSubtle/25'
            : isAdvisory
            ? 'border-mission-violet/40 bg-mission-violetSubtle/25'
            : 'border-habitat-border bg-habitat-elevated/40';

          const urgencyBadge = isCaution ? (
            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-mission-orange text-white">
              OPERATIONAL CAUTION
            </span>
          ) : isAdvisory ? (
            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-mission-violet text-white">
              CLINICAL ADVISORY
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-spaceText-secondary text-white">
              DATA INTEGRITY NOTE
            </span>
          );

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${cardBorder} space-y-2`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {urgencyBadge}
                  <h4 className="text-sm font-bold text-spaceText-primary font-sans">
                    {alert.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  {alert.studyDay && (
                    <span className="font-mono text-[11px] text-spaceText-muted">
                      Day {alert.studyDay} ({alert.date})
                    </span>
                  )}
                  <ProvenanceBadge provenance={alert.provenance} size="sm" />
                </div>
              </div>

              <p className="text-xs text-spaceText-primary font-medium leading-relaxed">
                {alert.observation}
              </p>

              {alert.baselineComparisonNote && (
                <div className="font-mono text-[11px] text-spaceText-secondary bg-habitat-panel/80 p-2 rounded border border-habitat-border/50">
                  <span className="text-spaceText-muted">Reference Context:</span> {alert.baselineComparisonNote}
                </div>
              )}

              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-spaceText-muted border-t border-habitat-border/40">
                <span>Rationale: {alert.rationale}</span>
                <span>NASA HRP UTMB Campaign 1</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ObservationAlerts;
