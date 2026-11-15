import React from 'react';
import { DATASET_METADATA } from '../../data/utmbBedrestActigraphy';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { ShieldCheck, Database, Layers } from 'lucide-react';

export const ProvenanceLedger: React.FC = () => {
  const telemetryChannels = [
    {
      channel: 'Rest-Activity Cycles & Sleep Duration',
      source: 'NASA HRP UTMB Bedrest Campaign 1 Actigraphy',
      unit: 'Hours / Minutes (H:mm:ss)',
      frequency: 'Continuous 24h Epoch Actigraphy',
      provenance: 'VERIFIED_NASA_RESEARCH_DATA' as const,
      status: 'VERIFIED EMPIRICAL RESEARCH',
      notes: '60-Day Head-Down Tilt Bedrest microgravity analog study (3 subjects, 207 rows).',
    },
    {
      channel: 'Sleep Onset Latency',
      source: 'NASA HRP UTMB Bedrest Campaign 1 Actigraphy',
      unit: 'Minutes (H:mm)',
      frequency: 'Per Sleep Episode',
      provenance: 'VERIFIED_NASA_RESEARCH_DATA' as const,
      status: 'VERIFIED EMPIRICAL RESEARCH',
      notes: 'Recorded via Cole-Brandt validated wrist actigraphy algorithms.',
    },
    {
      channel: 'Sleep Efficiency',
      source: 'NASA HRP UTMB Bedrest Campaign 1 Actigraphy',
      unit: 'Percentage (%)',
      frequency: 'Per Sleep Episode',
      provenance: 'VERIFIED_NASA_RESEARCH_DATA' as const,
      status: 'VERIFIED EMPIRICAL RESEARCH',
      notes: 'Ratio of recorded sleep duration to total time in bed.',
    },
    {
      channel: 'Nocturnal Heart Rate & Parasympathetic HRV',
      source: 'Simulated Biosensor Stream (Model CARDIO-V2)',
      unit: 'BPM / ms RMSSD',
      frequency: '1 Hz Synthetic Telemetry',
      provenance: 'SIMULATED_DATA' as const,
      status: 'SIMULATED TELEMETRY',
      notes: 'Simulated for Space Habitat OS interface demonstration.',
    },
    {
      channel: 'Circadian Core Body Temperature',
      source: 'Simulated Thermistor Pill (Model THERMO-COR)',
      unit: 'Degrees Celsius (°C)',
      frequency: '0.1 Hz Synthetic Telemetry',
      provenance: 'SIMULATED_DATA' as const,
      status: 'SIMULATED TELEMETRY',
      notes: 'Simulated for circadian nadir monitoring display.',
    },
    {
      channel: 'Cabin ECLSS Environment (CO2, Pressure, Temp)',
      source: 'Simulated Life Support Subsystem (Model SIM-ECLSS-01)',
      unit: 'mmHg / psi / °C',
      frequency: 'Periodic Station Telemetry',
      provenance: 'SIMULATED_DATA' as const,
      status: 'SIMULATED TELEMETRY',
      notes: 'Simulated habitat cabin environmental metrics.',
    },
    {
      channel: 'Lower Extremity Surface EMG / Muscle Tone',
      source: 'Sensor Disconnected / Unmonitored Channel',
      unit: 'mV',
      frequency: '---',
      provenance: 'UNAVAILABLE_DATA' as const,
      status: 'CHANNEL UNAVAILABLE',
      notes: 'No hardware downlink connected. Displayed as unavailable.',
    },
  ];

  return (
    <div className="bg-habitat-panel rounded-lg border border-habitat-border p-6 shadow-instrument space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-habitat-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-mission-lime" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-spaceText-secondary">
              Data Integrity & Source Transparency Ledger
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-spaceText-primary">
            Master Telemetry Provenance Registry
          </h3>
          <p className="text-xs text-spaceText-secondary mt-0.5">
            Full disclosure of empirical NASA research datasets, simulated telemetry streams, and unavailable channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-spaceText-muted" />
          <span className="font-mono text-xs text-spaceText-secondary">
            Archive Citation: <strong className="text-spaceText-primary">{DATASET_METADATA.campaign}</strong>
          </span>
        </div>
      </div>

      {/* Provenance Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-habitat-border bg-habitat-elevated text-spaceText-secondary uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Telemetry Channel</th>
              <th className="py-2.5 px-3">Data Source</th>
              <th className="py-2.5 px-3">Unit</th>
              <th className="py-2.5 px-3">Sampling</th>
              <th className="py-2.5 px-3">Provenance State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-habitat-border/60">
            {telemetryChannels.map((item, index) => (
              <tr key={index} className="hover:bg-habitat-elevated/40 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-bold text-spaceText-primary font-sans">{item.channel}</div>
                  <div className="text-[10px] text-spaceText-muted">{item.notes}</div>
                </td>
                <td className="py-3 px-3 text-spaceText-secondary">{item.source}</td>
                <td className="py-3 px-3 text-spaceText-primary font-semibold">{item.unit}</td>
                <td className="py-3 px-3 text-spaceText-muted">{item.frequency}</td>
                <td className="py-3 px-3">
                  <ProvenanceBadge provenance={item.provenance} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Zero Fabrication Rule Reaffirmation */}
      <div className="p-3.5 rounded bg-habitat-elevated border border-habitat-border font-mono text-xs text-spaceText-secondary flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-mission-lime" />
          <span>
            <strong>Zero-Fabrication Policy Enforced:</strong> Unrecorded epochs are strictly preserved as gaps (`--- [UNAVAILABLE]`).
          </span>
        </div>
        <span className="text-[10px] text-spaceText-muted">
          NASA Space Apps Challenge 2026 Telemetry Protocol
        </span>
      </div>
    </div>
  );
};

export default ProvenanceLedger;
