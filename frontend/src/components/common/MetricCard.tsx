import React, { useEffect, useState } from 'react';
import { DataProvenance } from '../../types';
import { ProvenanceBadge } from './ProvenanceBadge';

interface MetricCardProps {
  label: string;
  value: number | string | null;
  unit: string;
  source: string;
  provenance: DataProvenance;
  subValue?: string;
  icon?: React.ReactNode;
  accentColor?: 'orange' | 'lime' | 'violet' | 'graphite';
  badgeNote?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  source,
  provenance,
  subValue,
  icon,
  accentColor = 'graphite',
  badgeNote,
  className = '',
}) => {
  // Direct telemetry display with smooth update transition
  const [displayValue, setDisplayValue] = useState<number | string>(() =>
    value !== null && value !== undefined ? value : '---'
  );

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(value ?? '---');
      return;
    }

    // Set immediate true value for telemetry accuracy
    setDisplayValue(Number.isInteger(value) ? value : Number(value.toFixed(1)));
  }, [value]);

  const borderAccent =
    accentColor === 'orange'
      ? 'hover:border-mission-orange/50'
      : accentColor === 'lime'
      ? 'hover:border-mission-lime/50'
      : accentColor === 'violet'
      ? 'hover:border-mission-violet/50'
      : 'hover:border-spaceText-primary/40';

  return (
    <div
      className={`group relative bg-habitat-panel rounded-lg border border-habitat-border p-4 shadow-instrument transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${borderAccent} ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-wider text-spaceText-secondary font-medium">
          {label}
        </span>
        {icon && (
          <div className="text-spaceText-secondary transition-colors group-hover:text-spaceText-primary">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-3xl font-bold tracking-tight text-spaceText-primary tabular-nums">
          {displayValue}
        </span>
        {unit && (
          <span className="font-mono text-xs text-spaceText-secondary font-medium">
            {unit}
          </span>
        )}
      </div>

      {subValue && (
        <div className="mt-1 font-mono text-xs text-spaceText-muted">
          {subValue}
        </div>
      )}

      {/* Metadata strip: Source & Provenance */}
      <div className="mt-4 pt-3 border-t border-habitat-border/60 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <ProvenanceBadge provenance={provenance} size="sm" />
          {badgeNote && (
            <span className="font-mono text-[10px] text-spaceText-muted">
              {badgeNote}
            </span>
          )}
        </div>
        <div className="font-mono text-[10px] text-spaceText-secondary truncate" title={`SOURCE: ${source}`}>
          <span className="text-spaceText-muted">SRC:</span> {source}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
