import React, { useEffect, useState } from 'react';
import { ShieldCheck, Clock, Radio, Users } from 'lucide-react';
import { Participant } from '../../types';

interface TopBarProps {
  participants: Record<string, Participant>;
  selectedParticipantId: string;
  onSelectParticipant: (id: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  participants,
  selectedParticipantId,
  onSelectParticipant,
}) => {
  // Live Mission Elapsed Time ticker simulation (days:hours:minutes:seconds)
  const [metSeconds, setMetSeconds] = useState(48 * 86400 + 14 * 3600 + 32 * 60 + 5);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatMET = (totalSec: number) => {
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(days).padStart(3, '0')}:${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const participantIds = ['C1G0001', 'C1G0002', 'C1G0003'];

  return (
    <header className="border-b border-habitat-border bg-habitat-panel px-4 lg:px-8 py-3.5 sticky top-0 z-20 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Brand & Systems Ident */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-3.5 h-3.5 rounded-full bg-mission-lime" />
            <div className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-mission-lime animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-spaceText-secondary font-semibold">
                Space Habitat OS // Flight Deck
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-habitat-elevated text-spaceText-secondary border border-habitat-border">
                v2.0
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-spaceText-primary flex items-center gap-2">
              <span>ORBITAL CARE</span>
              <span className="text-xs font-mono font-normal text-spaceText-muted">
                [NASA Space Apps Challenge 2026]
              </span>
            </h1>
          </div>
        </div>

        {/* Tactical MET & Subsystem Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mission Elapsed Time */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-habitat-elevated border border-habitat-border font-mono text-xs shadow-inner"
            title="Simulated flight clock for UI demonstration; not an operational spacecraft downlink."
          >
            <Clock className="w-3.5 h-3.5 text-mission-orange" />
            <span className="text-spaceText-muted">MET:</span>
            <span className="font-bold tracking-wider text-spaceText-primary tabular-nums">
              {formatMET(metSeconds)}
            </span>
            <span className="text-[10px] text-spaceText-muted font-normal">[SIMULATED]</span>
          </div>

          {/* Habitat Environment Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-habitat-elevated border border-habitat-border font-mono text-xs">
            <Radio className="w-3.5 h-3.5 text-mission-lime" />
            <span className="text-spaceText-secondary">HAB-03</span>
            <span className="text-[10px] text-spaceText-muted">[ILLUSTRATIVE]</span>
          </div>

          {/* Data Provenance Badge (Clarifying Local Offline Archive) */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-habitat-graphite text-white font-mono text-xs shadow-sm border border-mission-lime/30"
            title="Local verified dataset active (NASA UTMB Bedrest Campaign 1). Offline research archive — not a live NASA downlink."
          >
            <ShieldCheck className="w-3.5 h-3.5 text-mission-lime" />
            <span className="text-mission-lime font-bold">LOCAL RESEARCH DATASET</span>
            <span className="text-[10px] text-spaceText-muted hidden md:inline">[OFFLINE ARCHIVE]</span>
          </div>
        </div>
      </div>

      {/* Participant Selector Strip */}
      <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-habitat-border/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-spaceText-secondary">
          <Users className="w-3.5 h-3.5" />
          <span className="font-semibold uppercase tracking-wider">UTMB Bedrest Cohort:</span>
        </div>

        <div className="flex items-center gap-2">
          {participantIds.map((id) => {
            const isSelected = id === selectedParticipantId;
            const p = participants[id];
            const hasBaseline = p?.baseline.isAvailable;

            return (
              <button
                key={id}
                onClick={() => onSelectParticipant(id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono text-xs transition-all duration-200 ${
                  isSelected
                    ? 'bg-habitat-graphite text-white font-bold shadow-sm ring-1 ring-habitat-graphite'
                    : 'bg-habitat-elevated text-spaceText-primary hover:bg-habitat-panel border border-habitat-border'
                }`}
              >
                <span>{id}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    hasBaseline ? 'bg-mission-lime' : 'bg-mission-orange'
                  }`}
                  title={
                    hasBaseline
                      ? 'Preliminary Baseline Available (N=2)'
                      : 'Baseline Unavailable (Zero PRE_TEST data)'
                  }
                />
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
