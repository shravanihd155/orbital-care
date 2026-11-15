import React from 'react';
import { Participant } from '../../types';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { UserCheck, Compass, MapPin, Wind, Thermometer, Gauge } from 'lucide-react';

interface AstronautProfileProps {
  participant: Participant;
}

export const AstronautProfile: React.FC<AstronautProfileProps> = ({ participant }) => {
  return (
    <div className="bg-habitat-panel rounded-lg border border-habitat-border p-6 shadow-instrument space-y-5">
      {/* Top Banner with Illustrative Notice */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-habitat-border">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-mission-orange" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-spaceText-primary">
            Crew Station Profile
          </span>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-mission-orangeSubtle text-mission-orange border border-mission-orange/30 font-semibold">
          [ILLUSTRATIVE DEMO PROFILE]
        </span>
      </div>

      {/* Astronaut Avatar & Information */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Vector Space Helmet / Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-habitat-elevated border-2 border-habitat-border flex items-center justify-center shadow-inner overflow-hidden">
            <svg
              className="w-16 h-16 text-spaceText-primary"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Astronaut Helmet Visor */}
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2.5" />
              <rect
                x="14"
                y="18"
                width="36"
                height="24"
                rx="12"
                fill="#22252C"
                stroke="#E65100"
                strokeWidth="1.5"
              />
              {/* Visor Glare & Reflection */}
              <path
                d="M18 24C22 20 28 19 34 20"
                stroke="#689F00"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Neck Ring */}
              <rect x="22" y="44" width="20" height="5" rx="2" fill="currentColor" />
              <path d="M12 56C12 48 20 47 32 47C44 47 52 48 52 56" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          {/* Active Bio-Sync Dot */}
          <div
            className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-habitat-graphite border-2 border-habitat-panel flex items-center justify-center"
            title="Bio-Monitor Link Active"
          >
            <span className="w-2 h-2 rounded-full bg-mission-lime" />
          </div>
        </div>

        {/* Text Dossier */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold tracking-tight text-spaceText-primary">
              CDR Sarah Lindqvist
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-habitat-elevated text-spaceText-secondary border border-habitat-border font-medium">
              EXP-74 / GATEWAY HAB
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-spaceText-secondary">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-mission-lime" />
              <span>Role: Crew Medical Officer (CMO)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-mission-orange" />
              <span>Mission Sol: 142 of 360</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-spaceText-muted" />
              <span>Module: Hab-Deck B // Bay-04</span>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-2 font-mono text-xs">
            <span className="text-spaceText-muted">Assigned NASA Research Subject:</span>
            <span className="font-bold text-spaceText-primary bg-habitat-elevated px-2 py-0.5 rounded border border-habitat-border">
              {participant.id}
            </span>
            <span className="text-[11px] text-spaceText-secondary">
              ({participant.studyName})
            </span>
          </div>
        </div>
      </div>

      {/* Simulated Environmental Subsystem Strip */}
      <div className="mt-4 pt-3 border-t border-habitat-border/70 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-spaceText-secondary uppercase tracking-wider font-semibold">
            Onboard Environmental ECLSS Mini-Strip
          </span>
          <ProvenanceBadge provenance="SIMULATED_DATA" size="sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded bg-habitat-elevated border border-habitat-border flex items-center gap-2.5">
            <Wind className="w-4 h-4 text-spaceText-secondary" />
            <div>
              <div className="text-[10px] text-spaceText-muted">CABIN PCO2</div>
              <div className="font-bold text-spaceText-primary">0.8 mmHg</div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-habitat-elevated border border-habitat-border flex items-center gap-2.5">
            <Gauge className="w-4 h-4 text-spaceText-secondary" />
            <div>
              <div className="text-[10px] text-spaceText-muted">CABIN PRESSURE</div>
              <div className="font-bold text-spaceText-primary">14.7 psi</div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-habitat-elevated border border-habitat-border flex items-center gap-2.5">
            <Thermometer className="w-4 h-4 text-spaceText-secondary" />
            <div>
              <div className="text-[10px] text-spaceText-muted">TEMPERATURE</div>
              <div className="font-bold text-spaceText-primary">21.5 °C</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstronautProfile;
