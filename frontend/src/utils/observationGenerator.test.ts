import { describe, it, expect } from 'vitest';
import {
  generateParticipantObservations,
  DECISION_SUPPORT_DISCLAIMER,
} from './observationGenerator';
import { getParticipants } from '../data/utmbBedrestActigraphy';
import { getBodyRegions } from '../data/bodyRegions';

describe('Observation Alerts & Decision Support Generator', () => {
  const participants = getParticipants();

  it('generates preliminary baseline observations for C1G0001 with N=2 caveat', () => {
    const c1 = participants['C1G0001'];
    const alerts = generateParticipantObservations(c1);

    expect(alerts.length).toBeGreaterThan(0);

    // Verify preliminary baseline notice
    const baselineNotice = alerts.find((a) => a.id.includes('baseline-notice'));
    expect(baselineNotice).toBeDefined();
    expect(baselineNotice?.baselineComparisonNote).toContain('LIMITED / PRELIMINARY BASELINE (N=2)');
    expect(baselineNotice?.provenance).toBe('VERIFIED_NASA_RESEARCH_DATA');

    // Every alert must contain the mandatory disclaimer
    for (const alert of alerts) {
      expect(alert.disclaimer).toBe(DECISION_SUPPORT_DISCLAIMER);
      expect(alert.disclaimer).toContain('DECISION SUPPORT ONLY — NOT A MEDICAL DIAGNOSIS');
    }
  });

  it('suppresses baseline deviations for C1G0002 and marks baseline as unavailable', () => {
    const c2 = participants['C1G0002'];
    const alerts = generateParticipantObservations(c2);

    const baselineAlert = alerts.find((a) => a.id.includes('baseline-unavailable'));
    expect(baselineAlert).toBeDefined();
    expect(baselineAlert?.provenance).toBe('UNAVAILABLE_DATA');
    expect(baselineAlert?.baselineComparisonNote).toContain('Deviations are NOT calculated');

    // Ensure no alert calculates a delta against an unavailable baseline
    for (const alert of alerts) {
      if (alert.baselineComparisonNote) {
        expect(alert.baselineComparisonNote).not.toContain('Evaluated against preliminary baseline of');
      }
    }
  });

  it('suppresses baseline deviations for C1G0003 and highlights initial 8-day telemetry dropout', () => {
    const c3 = participants['C1G0003'];
    const alerts = generateParticipantObservations(c3);

    const dropoutAlert = alerts.find((a) => a.id.includes('telemetry-dropouts'));
    expect(dropoutAlert).toBeDefined();
    expect(dropoutAlert?.observation).toContain('Days 1–8');
    expect(dropoutAlert?.provenance).toBe('UNAVAILABLE_DATA');
  });

  it('does not assert unsupported 85% clinical thresholds', () => {
    for (const id of ['C1G0001', 'C1G0002', 'C1G0003']) {
      const p = participants[id];
      const alerts = generateParticipantObservations(p);
      for (const alert of alerts) {
        expect(alert.observation).not.toContain('85% threshold');
        expect(alert.observation).not.toContain('clinical threshold');
        expect(alert.rationale).not.toContain('clinical threshold');
      }
    }
  });
});

describe('Anatomical Body Telemetry Regions', () => {
  it('strictly designates the wrist as verified empirical research data', () => {
    const regions = getBodyRegions('7.4', '92.1');
    const wrist = regions.find((r) => r.id === 'wrist');

    expect(wrist).toBeDefined();
    expect(wrist?.provenance).toBe('VERIFIED_NASA_RESEARCH_DATA');
    expect(wrist?.isEmpiricalResearch).toBe(true);
    expect(wrist?.sensorDevice).toContain('Cole-Brandt');
  });

  it('strictly designates non-wrist channels as simulated or unavailable', () => {
    const regions = getBodyRegions();
    const nonWrist = regions.filter((r) => r.id !== 'wrist');

    for (const r of nonWrist) {
      expect(r.isEmpiricalResearch).toBe(false);
      expect(r.provenance).not.toBe('VERIFIED_NASA_RESEARCH_DATA');
      expect(['SIMULATED_DATA', 'UNAVAILABLE_DATA']).toContain(r.provenance);
    }
  });
});
