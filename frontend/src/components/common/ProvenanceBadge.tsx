import React from 'react';
import { DataProvenance } from '../../types';
import { Cpu, AlertCircle } from 'lucide-react';

interface ProvenanceBadgeProps {
  provenance: DataProvenance;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  provenance,
  showIcon = true,
  size = 'sm',
  className = '',
}) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm
    ? 'text-[10px] px-2 py-0.5 tracking-wider'
    : 'text-xs px-2.5 py-1 tracking-widest';

  switch (provenance) {
    case 'VERIFIED_NASA_RESEARCH_DATA':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded bg-habitat-graphite text-mission-lime border border-mission-lime/30 shadow-sm ${sizeClasses} ${className}`}
          title="Empirical research record from NASA Human Research Program Data Archive"
        >
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-mission-lime animate-pulse" />}
          <span>● VERIFIED NASA RESEARCH DATA</span>
        </span>
      );

    case 'SIMULATED_DATA':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded bg-mission-orangeSubtle text-mission-orange border border-dashed border-mission-orange/50 ${sizeClasses} ${className}`}
          title="Simulated sensor stream generated for space habitat console evaluation"
        >
          {showIcon && <Cpu className="w-3 h-3" />}
          <span>⟐ SIMULATED DATA</span>
        </span>
      );

    case 'UNAVAILABLE_DATA':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded bg-habitat-elevated text-spaceText-muted border border-habitat-border ${sizeClasses} ${className}`}
          title="Sensor channel offline or measurement unrecorded in dataset"
        >
          {showIcon && <AlertCircle className="w-3 h-3 text-spaceText-muted" />}
          <span>✕ UNAVAILABLE DATA</span>
        </span>
      );
  }
};

export default ProvenanceBadge;
