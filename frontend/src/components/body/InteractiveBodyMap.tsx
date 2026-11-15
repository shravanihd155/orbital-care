import React, { useState } from 'react';
import { Participant } from '../../types';
import { getBodyRegions } from '../../data/bodyRegions';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { ShieldCheck, Info, Crosshair, Sparkles } from 'lucide-react';

interface InteractiveBodyMapProps {
  participant: Participant;
}

export const InteractiveBodyMap: React.FC<InteractiveBodyMapProps> = ({ participant }) => {
  const avgDur = participant.summary.meanDurationHours
    ? `${participant.summary.meanDurationHours}`
    : undefined;
  const avgEff = participant.summary.meanEfficiencyPercent
    ? `${participant.summary.meanEfficiencyPercent}`
    : undefined;

  const regions = getBodyRegions(avgDur, avgEff);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('wrist');
  const selectedRegion = regions.find((r) => r.id === selectedRegionId) ?? regions[0];

  return (
    <div className="bg-habitat-panel rounded-lg border border-habitat-border p-6 shadow-instrument space-y-6">
      {/* Header with Mandatory Empirical Disclosure */}
      <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-habitat-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crosshair className="w-4 h-4 text-mission-orange" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-spaceText-secondary">
              Physiological Telemetry & Sensor Map
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-spaceText-primary">
            Interactive Crew Biomap
          </h3>
          <p className="text-xs text-spaceText-secondary mt-0.5">
            Select an anatomical region to inspect sensor configuration, measurement modalities, and empirical data boundaries.
          </p>
        </div>

        <div className="p-2.5 rounded bg-mission-orangeSubtle/50 border border-mission-orange/40 text-[11px] font-mono text-spaceText-secondary max-w-sm">
          <div className="flex items-center gap-1.5 text-mission-orange font-bold mb-0.5">
            <Info className="w-3.5 h-3.5" />
            <span>RESEARCH DATA BOUNDARY NOTICE</span>
          </div>
          NASA UTMB dataset contains <strong className="text-spaceText-primary">wrist actigraphy only</strong>. Non-wrist channels represent simulated or unmonitored sensors for habitat OS design.
        </div>
      </div>

      {/* Main Interactive Stage: Body Vector SVG (Left) + Detail Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Vector Anatomical Silhouette (Col 1-5) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-habitat-elevated/60 rounded-lg border border-habitat-border relative overflow-hidden">
          {/* Subtle Grid Coordinate Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#16181C_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* SVG Human Figure with Aerospace Instrument Styling */}
          <svg
            className="w-48 h-80 drop-shadow-sm"
            viewBox="0 0 200 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Structural Body Outline */}
            <g stroke="#585E6D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
              {/* Head / Cranium */}
              <circle cx="100" cy="42" r="22" fill="#FCFAF6" stroke="#22252C" strokeWidth="2" />
              {/* Neck */}
              <path d="M94 64V76M106 64V76" />
              {/* Torso & Shoulders */}
              <path d="M72 82C80 76 120 76 128 82L138 108L132 186H68L62 108L72 82Z" fill="#F5F2EB" />
              {/* Left Arm (Viewer's Left) */}
              <path d="M62 108L46 168L36 216" strokeWidth="2" />
              {/* Right Arm (Wrist Actigraph side - Viewer's Right) */}
              <path d="M138 108L154 168L164 216" strokeWidth="2" />
              {/* Pelvis / Hips */}
              <path d="M68 186L76 220H124L132 186" />
              {/* Left Leg */}
              <path d="M78 220L72 290L68 344" strokeWidth="2.5" />
              {/* Right Leg */}
              <path d="M122 220L128 290L132 344" strokeWidth="2.5" />
            </g>

            {/* Target Ring: Right Wrist (Actigraphy - VERIFIED RESEARCH DATA) */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => setSelectedRegionId('wrist')}
            >
              <circle
                cx="164"
                cy="216"
                r={selectedRegionId === 'wrist' ? '12' : '8'}
                fill="#689F00"
                fillOpacity="0.25"
                stroke="#689F00"
                strokeWidth={selectedRegionId === 'wrist' ? '2.5' : '1.5'}
              />
              <circle cx="164" cy="216" r="3.5" fill="#689F00" />
              {selectedRegionId === 'wrist' && (
                <circle cx="164" cy="216" r="16" stroke="#689F00" strokeDasharray="3 3" className="animate-spin" />
              )}
            </g>

            {/* Target Ring: Cranial / Neuro (SIMULATED) */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => setSelectedRegionId('neuro')}
            >
              <circle
                cx="100"
                cy="42"
                r={selectedRegionId === 'neuro' ? '10' : '6'}
                fill="#E65100"
                fillOpacity="0.2"
                stroke="#E65100"
                strokeWidth={selectedRegionId === 'neuro' ? '2' : '1'}
              />
              <circle cx="100" cy="42" r="2.5" fill="#E65100" />
            </g>

            {/* Target Ring: Cardiovascular (SIMULATED) */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => setSelectedRegionId('cardio')}
            >
              <circle
                cx="94"
                cy="114"
                r={selectedRegionId === 'cardio' ? '10' : '6'}
                fill="#E65100"
                fillOpacity="0.2"
                stroke="#E65100"
                strokeWidth={selectedRegionId === 'cardio' ? '2' : '1'}
              />
              <circle cx="94" cy="114" r="2.5" fill="#E65100" />
            </g>

            {/* Target Ring: Core Thermoregulation (SIMULATED) */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => setSelectedRegionId('core')}
            >
              <circle
                cx="100"
                cy="156"
                r={selectedRegionId === 'core' ? '10' : '6'}
                fill="#E65100"
                fillOpacity="0.2"
                stroke="#E65100"
                strokeWidth={selectedRegionId === 'core' ? '2' : '1'}
              />
              <circle cx="100" cy="156" r="2.5" fill="#E65100" />
            </g>

            {/* Target Ring: Musculoskeletal / Calf (UNAVAILABLE) */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => setSelectedRegionId('musculoskeletal')}
            >
              <circle
                cx="128"
                cy="290"
                r={selectedRegionId === 'musculoskeletal' ? '10' : '6'}
                fill="#8A91A0"
                fillOpacity="0.2"
                stroke="#8A91A0"
                strokeWidth={selectedRegionId === 'musculoskeletal' ? '2' : '1'}
              />
              <circle cx="128" cy="290" r="2.5" fill="#8A91A0" />
            </g>
          </svg>

          {/* Region selector quick buttons under figure */}
          <div className="mt-4 flex flex-wrap justify-center gap-1.5 w-full">
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegionId(reg.id)}
                className={`text-[11px] font-mono px-2 py-1 rounded transition-colors ${
                  selectedRegionId === reg.id
                    ? 'bg-habitat-graphite text-white font-bold'
                    : 'bg-habitat-panel text-spaceText-secondary border border-habitat-border hover:bg-white'
                }`}
              >
                {reg.id === 'wrist' ? '● Wrist Actigraph' : reg.id}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Sensor Region Dossier (Col 6-12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-lg bg-habitat-elevated border border-habitat-border space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-spaceText-muted">
                  Anatomical Target: {selectedRegion.anatomicalTarget}
                </span>
                <h4 className="text-lg font-bold text-spaceText-primary flex items-center gap-2">
                  <span>{selectedRegion.name}</span>
                  {selectedRegion.isEmpiricalResearch && (
                    <Sparkles className="w-4 h-4 text-mission-lime" />
                  )}
                </h4>
              </div>
              <ProvenanceBadge provenance={selectedRegion.provenance} size="md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-habitat-panel rounded border border-habitat-border">
                <div className="text-spaceText-muted text-[10px]">SENSOR DEVICE</div>
                <div className="font-bold text-spaceText-primary mt-0.5">
                  {selectedRegion.sensorDevice}
                </div>
              </div>

              <div className="p-3 bg-habitat-panel rounded border border-habitat-border">
                <div className="text-spaceText-muted text-[10px]">MEASUREMENT MODALITY</div>
                <div className="font-bold text-spaceText-primary mt-0.5">
                  {selectedRegion.measurementType}
                </div>
              </div>
            </div>

            <div className="p-3 bg-habitat-panel rounded border border-habitat-border">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-spaceText-muted text-[10px]">ACTIVE READOUT</span>
                <span className="text-spaceText-secondary font-medium">Unit: {selectedRegion.unit}</span>
              </div>
              <div className="text-base font-bold text-spaceText-primary font-mono mt-1">
                {selectedRegion.currentValue}
              </div>
            </div>

            <p className="text-xs text-spaceText-secondary leading-relaxed">
              {selectedRegion.description}
            </p>

            {selectedRegion.isEmpiricalResearch ? (
              <div className="p-3 rounded bg-habitat-graphite text-mission-lime font-mono text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>
                  Validated Research Channel: UTMB Bedrest Campaign 1 Actigraphy records active for subject {participant.id}.
                </span>
              </div>
            ) : (
              <div className="p-2.5 rounded bg-habitat-panel border border-dashed border-habitat-border font-mono text-[11px] text-spaceText-muted">
                NOTICE: This channel is an interface concept for comprehensive habitat telemedicine. It is not part of the empirical actigraphy dataset.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveBodyMap;
