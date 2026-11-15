/**
 * ORBITAL CARE — Telemetry & Actigraphy Type Definitions
 * NASA Space Apps Challenge 2026 // SPACE HABITAT OS
 */

/**
 * Explicit Data Provenance states required across all metrics and visualizations.
 */
export type DataProvenance =
  | 'VERIFIED_NASA_RESEARCH_DATA'
  | 'SIMULATED_DATA'
  | 'UNAVAILABLE_DATA';

/**
 * Study test phases within the NASA UTMB Bedrest Campaign 1 study.
 * PRE_TEST: Pre-bedrest ambulatory baseline period.
 * IN_TEST: 6-degree head-down tilt bedrest simulation period.
 * POST_TEST: Ambulatory reconditioning and recovery period.
 */
export type StudyPhase = 'PRE_TEST' | 'IN_TEST' | 'POST_TEST';

/**
 * Individual actigraphy sleep record parsed from verified NASA research data.
 * All missing values MUST be preserved as null, never converted to zero.
 */
export interface SleepRecord {
  id: number;
  subjectId: string;
  testPhase: StudyPhase;
  bedrestDay: number;
  date: string; // e.g. "9/7/2004"
  rawLatency: string; // original raw string ("0:14", "NA")
  rawDuration: string; // original raw string ("7:44:00", "NA")
  latencyMinutes: number | null; // Total onset latency in minutes, or null
  latencyHours: number | null; // Onset latency in decimal hours, or null
  durationMinutes: number | null; // Total sleep duration in minutes, or null
  durationHours: number | null; // Total sleep duration in decimal hours, or null
  efficiencyPercent: number | null; // Sleep efficiency percentage (0-100), or null
  notes: string | null;
  provenance: DataProvenance;
  dataSource: string;
}

/**
 * Baseline statistics computed strictly from a participant's PRE_TEST records.
 * Only calculated when sufficient valid records exist; otherwise marked unavailable.
 */
export interface ParticipantBaseline {
  subjectId: string;
  isAvailable: boolean;
  validPreTestRecordCount: number;
  totalPreTestRecordCount: number;
  unavailabilityReason?: string;
  baselineQuality?: 'PRELIMINARY_LIMITED' | 'UNAVAILABLE' | 'SUFFICIENT';
  baselineLabel?: string;
  baselineCaveat?: string;
  meanDurationHours: number | null;
  meanDurationMinutes: number | null;
  meanLatencyMinutes: number | null;
  meanEfficiencyPercent: number | null;
  stdDevDurationMinutes?: number | null;
  stdDevEfficiencyPercent?: number | null;
  provenance: DataProvenance;
  dataSource: string;
}

/**
 * Urgency classification for explainable decision support observations.
 * Note: These represent operational attention tiers, NOT diagnostic medical severity.
 */
export type ObservationUrgency = 'ADVISORY' | 'CAUTION' | 'INFO';

/**
 * Transparent observation model derived strictly from verified data deltas.
 */
export interface ObservationAlert {
  id: string;
  subjectId: string;
  urgency: ObservationUrgency;
  title: string;
  observation: string;
  baselineComparisonNote?: string;
  provenance: DataProvenance;
  studyDay?: number;
  studyPhase?: StudyPhase;
  date?: string;
  metricKey: 'duration' | 'latency' | 'efficiency' | 'data_integrity';
  rationale: string;
  disclaimer: string;
}

/**
 * Interactive anatomical region for the human body visualization.
 */
export interface BodyRegion {
  id: string;
  name: string;
  anatomicalTarget: string;
  sensorDevice: string;
  measurementType: string;
  unit: string;
  currentValue: string;
  provenance: DataProvenance;
  status: 'ACTIVE_TELEMETRY' | 'SIMULATED_STREAM' | 'UNAVAILABLE';
  description: string;
  isEmpiricalResearch: boolean;
}

/**
 * Summary metrics for a participant across their study records.
 */
export interface SleepSummary {
  subjectId: string;
  totalRecords: number;
  validRecordsCount: number;
  missingRecordsCount: number;
  meanDurationHours: number | null;
  meanDurationMinutes: number | null;
  meanLatencyMinutes: number | null;
  meanEfficiencyPercent: number | null;
  minDurationHours: number | null;
  maxDurationHours: number | null;
  minEfficiencyPercent: number | null;
  maxEfficiencyPercent: number | null;
  phaseCounts: Record<StudyPhase, number>;
  provenance: DataProvenance;
  dataSource: string;
}

/**
 * Complete participant model encapsulating records, baseline, and summary.
 */
export interface Participant {
  id: string; // e.g. 'C1G0001', 'C1G0002', 'C1G0003'
  studyName: string;
  studyContext: string;
  isSpaceflightAnalog: boolean;
  totalRecords: number;
  baseline: ParticipantBaseline;
  summary: SleepSummary;
  records: SleepRecord[];
}

/**
 * Dataset metadata and research provenance disclosure.
 */
export interface DatasetMetadata {
  datasetName: string;
  campaign: string;
  sourceInstitution: string;
  studyDesign: string;
  analogsUsed: string;
  actigraphyDevice: string;
  disclaimer: string;
  totalRecords: number;
  participantsCount: number;
  provenance: DataProvenance;
}

