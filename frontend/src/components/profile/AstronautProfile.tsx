import React from 'react';
import { Participant } from '../../types';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import {
  UserCheck, Compass, Wind, Thermometer,
  Gauge, Activity, ShieldCheck, Orbit
} from 'lucide-react';

interface AstronautProfileProps {
  participant: Participant;
}

export const AstronautProfile: React.FC<AstronautProfileProps> = ({ participant }) => {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-habitat-border bg-habitat-panel shadow-instrument">
      <style>{`
        @keyframes astronautFloat {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-9px) rotate(1deg); }
        }
        @keyframes orbitalSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes telemetryPulse {
          0%,100% { opacity: .45; transform: scale(.92); }
          50% { opacity: 1; transform: scale(1.12); }
        }
        @keyframes visorGlow {
          0%,100% { opacity: .35; }
          50% { opacity: .8; }
        }
        .astronaut-float { animation: astronautFloat 5s ease-in-out infinite; }
        .orbital-spin { animation: orbitalSpin 24s linear infinite; }
        .telemetry-pulse { animation: telemetryPulse 2s ease-in-out infinite; }
        .visor-glow { animation: visorGlow 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .astronaut-float,.orbital-spin,.telemetry-pulse,.visor-glow {
            animation: none;
          }
        }
      `}</style>

      <div className="absolute -top-24 -right-20 w-64 h-64 rounded-full bg-mission-violet/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-20 w-56 h-56 rounded-full bg-mission-orange/10 blur-3xl pointer-events-none" />

      <div className="relative p-5 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-habitat-border pb-3">
          <div className="flex items-center gap-2">
            <Orbit className="w-4 h-4 text-mission-orange" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">
              Crew Station // 01
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-mission-orangeSubtle text-mission-orange border border-mission-orange/30">
            ILLUSTRATIVE DEMO PROFILE
          </span>
        </div>

        <div className="relative min-h-[225px] rounded-xl overflow-hidden bg-habitat-elevated border border-habitat-border flex items-center justify-center">
          <div className="absolute w-48 h-48 rounded-full border border-mission-violet/30 orbital-spin">
            <span className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-mission-orange shadow-lg" />
          </div>
          <div className="absolute w-36 h-36 rounded-full border border-dashed border-mission-orange/30" />
          <div className="absolute top-4 left-4 font-mono text-[9px] tracking-widest text-spaceText-muted">
            HABITAT / CREW VISUAL
          </div>
          <div className="absolute bottom-4 right-4 font-mono text-[9px] text-spaceText-muted">
            AVATAR // DEMO
          </div>

          <div className="astronaut-float relative z-10">
            <svg viewBox="0 0 220 230" className="w-48 h-52 drop-shadow-xl" role="img" aria-label="Illustrative astronaut in a spacesuit">
              <defs>
                <linearGradient id="suitGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f5eee2"/>
                  <stop offset="100%" stopColor="#a9a49e"/>
                </linearGradient>
                <linearGradient id="visorGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#66577f"/>
                  <stop offset="55%" stopColor="#26364c"/>
                  <stop offset="100%" stopColor="#111b2a"/>
                </linearGradient>
              </defs>
              <ellipse cx="110" cy="219" rx="68" ry="8" fill="#756b83" opacity=".18"/>
              <path d="M43 215 Q43 157 78 146 L142 146 Q177 157 177 215Z" fill="url(#suitGradient)" stroke="#817b75" strokeWidth="2"/>
              <path d="M78 149 L72 185 L148 185 L142 149" fill="#d5c9b9" stroke="#817b75" strokeWidth="2"/>
              <rect x="87" y="154" width="46" height="29" rx="6" fill="#33323a" stroke="#e47b37" strokeWidth="2"/>
              <rect x="96" y="161" width="28" height="5" rx="2" fill="#a8c9d0"/>
              <rect x="96" y="170" width="19" height="5" rx="2" fill="#b8a4d8"/>
              <path d="M58 163 L29 193 L42 207 L77 184" fill="url(#suitGradient)" stroke="#817b75" strokeWidth="3"/>
              <path d="M162 163 L191 193 L178 207 L143 184" fill="url(#suitGradient)" stroke="#817b75" strokeWidth="3"/>
              <path d="M70 207 L67 222 M150 207 L153 222" stroke="#817b75" strokeWidth="8" strokeLinecap="round"/>
              <path d="M78 82 Q78 39 110 39 Q142 39 142 82 L142 105 Q142 128 110 137 Q78 128 78 105Z" fill="#d9cbbb" stroke="#8d8178" strokeWidth="3"/>
              <path d="M67 81 Q67 26 110 26 Q153 26 153 81 L153 96 Q153 124 110 140 Q67 124 67 96Z" fill="url(#suitGradient)" stroke="#8c8177" strokeWidth="3"/>
              <path d="M76 77 Q76 43 110 43 Q144 43 144 77 L144 91 Q144 114 110 126 Q76 114 76 91Z" fill="url(#visorGradient)" stroke="#e47b37" strokeWidth="3"/>
              <path d="M84 67 Q104 49 128 55" stroke="#d5c5ec" strokeWidth="4" strokeLinecap="round" fill="none" className="visor-glow"/>
              <path d="M84 86 Q103 101 137 77" stroke="#77d4d2" strokeWidth="2" opacity=".6" fill="none"/>
              <circle cx="57" cy="151" r="13" fill="#e5d9c8" stroke="#8d8177" strokeWidth="2"/>
              <circle cx="163" cy="151" r="13" fill="#e5d9c8" stroke="#8d8177" strokeWidth="2"/>
              <circle cx="57" cy="151" r="6" fill="#81719b"/>
              <circle cx="163" cy="151" r="6" fill="#81719b"/>
              <path d="M85 133 Q110 146 135 133" fill="none" stroke="#8d8177" strokeWidth="5"/>
            </svg>
          </div>

          <div className="absolute top-1/2 right-5 -translate-y-1/2 flex flex-col gap-2">
            <span className="w-2 h-2 rounded-full bg-mission-lime telemetry-pulse"/>
            <span className="w-2 h-2 rounded-full bg-mission-orange telemetry-pulse"/>
            <span className="w-2 h-2 rounded-full bg-mission-violet telemetry-pulse"/>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-spaceText-muted">
              Selected research participant
            </div>
            <h2 className="text-2xl font-black tracking-tight text-spaceText-primary mt-1">
              {participant.id}
            </h2>
            <p className="text-xs text-spaceText-secondary mt-1">
              {participant.studyName}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-mission-lime/30 bg-mission-lime/10 px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-mission-lime telemetry-pulse"/>
            <span className="text-[10px] font-mono font-bold text-mission-lime">DATA LINK OK</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-habitat-elevated border border-habitat-border p-3">
            <div className="flex items-center gap-2 text-spaceText-muted text-[10px] uppercase font-mono">
              <UserCheck className="w-3.5 h-3.5"/> Study design
            </div>
            <div className="mt-2 text-sm font-semibold">60-day bedrest analog</div>
          </div>
          <div className="rounded-lg bg-habitat-elevated border border-habitat-border p-3">
            <div className="flex items-center gap-2 text-spaceText-muted text-[10px] uppercase font-mono">
              <Compass className="w-3.5 h-3.5"/> Study phase
            </div>
            <div className="mt-2 text-sm font-semibold">
              {participant.summary.phaseCounts.IN_TEST > 0 ? 'Bedrest study' : 'Study period'}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-habitat-border p-3 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-spaceText-secondary font-bold">
              Environmental subsystem // ECLSS
            </span>
            <ProvenanceBadge provenance="SIMULATED_DATA" size="sm"/>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Wind className="w-4 h-4 text-mission-violet"/>
              <div className="text-[9px] text-spaceText-muted font-mono">PCO2</div>
              <div className="font-bold text-sm">0.8 <span className="text-[9px] font-normal">mmHg</span></div>
            </div>
            <div className="space-y-1">
              <Gauge className="w-4 h-4 text-mission-orange"/>
              <div className="text-[9px] text-spaceText-muted font-mono">PRESSURE</div>
              <div className="font-bold text-sm">14.7 <span className="text-[9px] font-normal">psi</span></div>
            </div>
            <div className="space-y-1">
              <Thermometer className="w-4 h-4 text-mission-violet"/>
              <div className="text-[9px] text-spaceText-muted font-mono">TEMP</div>
              <div className="font-bold text-sm">21.5 <span className="text-[9px] font-normal">°C</span></div>
            </div>
          </div>
          <p className="text-[9px] leading-relaxed text-spaceText-muted">
            Illustrative habitat readings. Not measured astronaut telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-spaceText-muted font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-mission-lime"/>
          <span>NASA research participant data remains separately identified.</span>
          <Activity className="w-3.5 h-3.5 ml-auto text-mission-orange"/>
        </div>
      </div>
    </section>
  );
};

export default AstronautProfile;
