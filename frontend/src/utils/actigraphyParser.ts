/**
 * ORBITAL CARE — Actigraphy Parsing & Baseline Calculation Utilities
 * NASA Space Apps Challenge 2026 // SPACE HABITAT OS
 *
 * Strict Rules Enforced:
 * 1. Missing values (NA, "No Data", empty) are preserved as null. NEVER converted to zero.
 * 2. Real values (including genuine 0:00 latency) are accurately parsed.
 * 3. Individual baselines are derived strictly from PRE_TEST records.
 * 4. Insufficient/missing PRE_TEST records explicitly mark baselines as unavailable.
 */

import {
  DataProvenance,
  Participant,
  ParticipantBaseline,
  SleepRecord,
  SleepSummary,
  StudyPhase,
} from '../types';

export const DATA_PROVENANCE_NASA: DataProvenance = 'VERIFIED_NASA_RESEARCH_DATA';
export const DATA_SOURCE_NAME = 'NASA HRP UTMB Bedrest Campaign 1 Actigraphy';

/**
 * Checks if a raw string represents a missing or invalid value.
 */
export function isMissingValue(raw: string | null | undefined): boolean {
  if (raw === null || raw === undefined) return true;
  const trimmed = raw.trim().toUpperCase();
  return (
    trimmed === '' ||
    trimmed === 'NA' ||
    trimmed === 'N/A' ||
    trimmed === 'NO DATA' ||
    trimmed === 'NULL' ||
    trimmed === 'NONE'
  );
}

/**
 * Parses latency string in "HH:mm" or "H:mm" format into numeric minutes.
 * Returns null if missing. Preserves genuine 0:00 as 0.
 */
export function parseLatencyToMinutes(raw: string | null | undefined): number | null {
  if (isMissingValue(raw)) return null;
  const str = raw!.trim();
  const parts = str.split(':');
  if (parts.length < 2) return null;

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes >= 60) {
    return null;
  }

  return hours * 60 + minutes;
}

/**
 * Converts latency minutes to decimal hours rounded to 4 decimals.
 * Returns null if input is null.
 */
export function latencyMinutesToHours(minutes: number | null): number | null {
  if (minutes === null) return null;
  return Number((minutes / 60).toFixed(4));
}

/**
 * Parses duration string in "HH:mm:ss" or "HH:mm" format into total minutes.
 * Returns null if missing.
 */
export function parseDurationToMinutes(raw: string | null | undefined): number | null {
  if (isMissingValue(raw)) return null;
  const str = raw!.trim();
  const parts = str.split(':');
  if (parts.length < 2) return null;

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parts.length >= 3 ? parseInt(parts[2], 10) : 0;

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    isNaN(seconds) ||
    hours < 0 ||
    minutes < 0 ||
    minutes >= 60 ||
    seconds < 0 ||
    seconds >= 60
  ) {
    return null;
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return Math.round(totalSeconds / 60);
}

/**
 * Converts total duration minutes to decimal hours rounded to 4 decimals.
 * Returns null if input is null.
 */
export function durationMinutesToHours(minutes: number | null): number | null {
  if (minutes === null) return null;
  return Number((minutes / 60).toFixed(4));
}

/**
 * Parses efficiency percentage (0 to 100).
 * Returns null if missing or invalid.
 */
export function parseEfficiencyPercent(raw: string | null | undefined): number | null {
  if (isMissingValue(raw)) return null;
  const val = parseFloat(raw!.trim());
  if (isNaN(val) || val < 0 || val > 100) return null;
  return Number(val.toFixed(2));
}

/**
 * Parses a single raw CSV row into a typed SleepRecord.
 */
export function parseSleepRecordRow(
  row: {
    ID: string | number;
    Subject: string;
    Test_Phase: string;
    BR_Day: string | number;
    Date: string;
    'Sleep Latency (hours)'?: string;
    'Sleep Duration (hours)'?: string;
    'Sleep Efficiency (%)'?: string;
    Notes?: string;
  }
): SleepRecord {
  const rawLatency = row['Sleep Latency (hours)'] ?? '';
  const rawDuration = row['Sleep Duration (hours)'] ?? '';
  const rawEfficiency = row['Sleep Efficiency (%)'] ?? '';

  const latencyMins = parseLatencyToMinutes(rawLatency);
  const durationMins = parseDurationToMinutes(rawDuration);
  const efficiency = parseEfficiencyPercent(rawEfficiency);

  // Normalize study phase
  let phase: StudyPhase = 'IN_TEST';
  const rawPhase = (row.Test_Phase ?? '').trim().toUpperCase();
  if (rawPhase === 'PRE_TEST') phase = 'PRE_TEST';
  else if (rawPhase === 'POST_TEST') phase = 'POST_TEST';

  const notesVal = (row.Notes ?? '').trim();
  const notes = isMissingValue(notesVal) ? null : notesVal;

  return {
    id: typeof row.ID === 'number' ? row.ID : parseInt(row.ID, 10),
    subjectId: (row.Subject ?? '').trim(),
    testPhase: phase,
    bedrestDay: typeof row.BR_Day === 'number' ? row.BR_Day : parseInt(row.BR_Day, 10),
    date: (row.Date ?? '').trim(),
    rawLatency,
    rawDuration,
    latencyMinutes: latencyMins,
    latencyHours: latencyMinutesToHours(latencyMins),
    durationMinutes: durationMins,
    durationHours: durationMinutesToHours(durationMins),
    efficiencyPercent: efficiency,
    notes,
    provenance: DATA_PROVENANCE_NASA,
    dataSource: DATA_SOURCE_NAME,
  };
}

/**
 * Calculates participant-specific baseline strictly from PRE_TEST records.
 * If fewer than minimum required valid records (default 2) exist, marks baseline as unavailable.
 */
export function calculateParticipantBaseline(
  subjectId: string,
  records: SleepRecord[],
  minRequiredRecords: number = 2
): ParticipantBaseline {
  const preTestRecords = records.filter(
    (r) => r.subjectId === subjectId && r.testPhase === 'PRE_TEST'
  );

  const totalPreTestRecordCount = preTestRecords.length;
  const validRecords = preTestRecords.filter(
    (r) => r.durationMinutes !== null && r.efficiencyPercent !== null
  );
  const validCount = validRecords.length;

  if (validCount === 0) {
    return {
      subjectId,
      isAvailable: false,
      validPreTestRecordCount: 0,
      totalPreTestRecordCount,
      unavailabilityReason: `Baseline unavailable: 0 valid PRE_TEST records found for participant ${subjectId} (records marked 'No Data').`,
      baselineQuality: 'UNAVAILABLE',
      baselineLabel: 'BASELINE UNAVAILABLE',
      baselineCaveat: 'No valid pre-bedrest observations exist in dataset. Deviations cannot be calculated.',
      meanDurationHours: null,
      meanDurationMinutes: null,
      meanLatencyMinutes: null,
      meanEfficiencyPercent: null,
      stdDevDurationMinutes: null,
      stdDevEfficiencyPercent: null,
      provenance: 'UNAVAILABLE_DATA',
      dataSource: DATA_SOURCE_NAME,
    };
  }

  if (validCount < minRequiredRecords) {
    return {
      subjectId,
      isAvailable: false,
      validPreTestRecordCount: validCount,
      totalPreTestRecordCount,
      unavailabilityReason: `Baseline unavailable: Only ${validCount} valid PRE_TEST record(s) exist; minimum ${minRequiredRecords} required for baseline stability.`,
      baselineQuality: 'UNAVAILABLE',
      baselineLabel: 'BASELINE INSUFFICIENT',
      baselineCaveat: `Fewer than ${minRequiredRecords} records available.`,
      meanDurationHours: null,
      meanDurationMinutes: null,
      meanLatencyMinutes: null,
      meanEfficiencyPercent: null,
      stdDevDurationMinutes: null,
      stdDevEfficiencyPercent: null,
      provenance: 'UNAVAILABLE_DATA',
      dataSource: DATA_SOURCE_NAME,
    };
  }

  // Calculate means
  const durationSum = validRecords.reduce((acc, r) => acc + (r.durationMinutes ?? 0), 0);
  const meanDurationMinutes = Math.round(durationSum / validCount);
  const meanDurationHours = Number((meanDurationMinutes / 60).toFixed(4));

  const validLatency = validRecords.filter((r) => r.latencyMinutes !== null);
  const meanLatencyMinutes =
    validLatency.length > 0
      ? Number(
          (
            validLatency.reduce((acc, r) => acc + (r.latencyMinutes ?? 0), 0) /
            validLatency.length
          ).toFixed(1)
        )
      : null;

  const efficiencySum = validRecords.reduce(
    (acc, r) => acc + (r.efficiencyPercent ?? 0),
    0
  );
  const meanEfficiencyPercent = Number((efficiencySum / validCount).toFixed(2));

  // Calculate sample standard deviation
  let stdDevDurationMinutes: number | null = null;
  let stdDevEfficiencyPercent: number | null = null;

  if (validCount > 1) {
    const durVariance =
      validRecords.reduce(
        (acc, r) => acc + Math.pow((r.durationMinutes ?? 0) - meanDurationMinutes, 2),
        0
      ) /
      (validCount - 1);
    stdDevDurationMinutes = Number(Math.sqrt(durVariance).toFixed(2));

    const effVariance =
      validRecords.reduce(
        (acc, r) => acc + Math.pow((r.efficiencyPercent ?? 0) - meanEfficiencyPercent, 2),
        0
      ) /
      (validCount - 1);
    stdDevEfficiencyPercent = Number(Math.sqrt(effVariance).toFixed(2));
  }

  return {
    subjectId,
    isAvailable: true,
    validPreTestRecordCount: validCount,
    totalPreTestRecordCount,
    baselineQuality: 'PRELIMINARY_LIMITED',
    baselineLabel: 'LIMITED / PRELIMINARY BASELINE (N=2)',
    baselineCaveat:
      'Derived strictly from N=2 pre-bedrest observations. Reference only; not a statistically reliable population norm.',
    meanDurationHours,
    meanDurationMinutes,
    meanLatencyMinutes,
    meanEfficiencyPercent,
    stdDevDurationMinutes,
    stdDevEfficiencyPercent,
    provenance: DATA_PROVENANCE_NASA,
    dataSource: DATA_SOURCE_NAME,
  };
}

/**
 * Calculates overall summary statistics for a participant across all phases.
 */
export function calculateSleepSummary(
  subjectId: string,
  records: SleepRecord[]
): SleepSummary {
  const subjectRecords = records.filter((r) => r.subjectId === subjectId);
  const totalRecords = subjectRecords.length;

  const validRecords = subjectRecords.filter(
    (r) => r.durationMinutes !== null && r.efficiencyPercent !== null
  );
  const validCount = validRecords.length;
  const missingCount = totalRecords - validCount;

  const phaseCounts: Record<StudyPhase, number> = {
    PRE_TEST: subjectRecords.filter((r) => r.testPhase === 'PRE_TEST').length,
    IN_TEST: subjectRecords.filter((r) => r.testPhase === 'IN_TEST').length,
    POST_TEST: subjectRecords.filter((r) => r.testPhase === 'POST_TEST').length,
  };

  if (validCount === 0) {
    return {
      subjectId,
      totalRecords,
      validRecordsCount: 0,
      missingRecordsCount: missingCount,
      meanDurationHours: null,
      meanDurationMinutes: null,
      meanLatencyMinutes: null,
      meanEfficiencyPercent: null,
      minDurationHours: null,
      maxDurationHours: null,
      minEfficiencyPercent: null,
      maxEfficiencyPercent: null,
      phaseCounts,
      provenance: DATA_PROVENANCE_NASA,
      dataSource: DATA_SOURCE_NAME,
    };
  }

  const durationSum = validRecords.reduce((acc, r) => acc + (r.durationMinutes ?? 0), 0);
  const meanDurationMinutes = Math.round(durationSum / validCount);
  const meanDurationHours = Number((meanDurationMinutes / 60).toFixed(4));

  const validLatency = validRecords.filter((r) => r.latencyMinutes !== null);
  const meanLatencyMinutes =
    validLatency.length > 0
      ? Number(
          (
            validLatency.reduce((acc, r) => acc + (r.latencyMinutes ?? 0), 0) /
            validLatency.length
          ).toFixed(1)
        )
      : null;

  const efficiencySum = validRecords.reduce(
    (acc, r) => acc + (r.efficiencyPercent ?? 0),
    0
  );
  const meanEfficiencyPercent = Number((efficiencySum / validCount).toFixed(2));

  const durations = validRecords.map((r) => r.durationHours!).filter((d) => d !== null);
  const efficiencies = validRecords
    .map((r) => r.efficiencyPercent!)
    .filter((e) => e !== null);

  const minDurationHours = Math.min(...durations);
  const maxDurationHours = Math.max(...durations);
  const minEfficiencyPercent = Math.min(...efficiencies);
  const maxEfficiencyPercent = Math.max(...efficiencies);

  return {
    subjectId,
    totalRecords,
    validRecordsCount: validCount,
    missingRecordsCount: missingCount,
    meanDurationHours,
    meanDurationMinutes,
    meanLatencyMinutes,
    meanEfficiencyPercent,
    minDurationHours,
    maxDurationHours,
    minEfficiencyPercent,
    maxEfficiencyPercent,
    phaseCounts,
    provenance: DATA_PROVENANCE_NASA,
    dataSource: DATA_SOURCE_NAME,
  };
}

/**
 * Builds complete Participant object with baseline and summary.
 */
export function buildParticipant(
  subjectId: string,
  records: SleepRecord[],
  minBaselineRequired: number = 2
): Participant {
  const subjectRecords = records
    .filter((r) => r.subjectId === subjectId)
    .sort((a, b) => a.id - b.id);

  const baseline = calculateParticipantBaseline(
    subjectId,
    subjectRecords,
    minBaselineRequired
  );
  const summary = calculateSleepSummary(subjectId, subjectRecords);

  return {
    id: subjectId,
    studyName: 'NASA UTMB Bedrest Campaign 1',
    studyContext: 'Terrestrial 6° Head-Down Tilt Bedrest (Microgravity Analog)',
    isSpaceflightAnalog: true,
    totalRecords: subjectRecords.length,
    baseline,
    summary,
    records: subjectRecords,
  };
}
