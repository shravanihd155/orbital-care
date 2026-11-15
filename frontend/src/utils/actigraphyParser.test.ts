import { describe, it, expect } from 'vitest';
import {
  isMissingValue,
  parseLatencyToMinutes,
  latencyMinutesToHours,
  parseDurationToMinutes,
  durationMinutesToHours,
  parseEfficiencyPercent,
  parseSleepRecordRow,
  calculateParticipantBaseline,
  calculateSleepSummary,
} from './actigraphyParser';
import {
  getVerifiedSleepRecords,
  getParticipants,
  getParticipantIds,
  DATASET_METADATA,
} from '../data/utmbBedrestActigraphy';

describe('Actigraphy Time & Metric Conversion Utilities', () => {
  it('correctly identifies missing values and edge cases', () => {
    expect(isMissingValue('NA')).toBe(true);
    expect(isMissingValue('N/A')).toBe(true);
    expect(isMissingValue('No Data')).toBe(true);
    expect(isMissingValue('')).toBe(true);
    expect(isMissingValue('   ')).toBe(true);
    expect(isMissingValue(null)).toBe(true);
    expect(isMissingValue(undefined)).toBe(true);

    // Valid values should not be marked as missing
    expect(isMissingValue('0:14')).toBe(false);
    expect(isMissingValue('0:00')).toBe(false);
    expect(isMissingValue('7:44:00')).toBe(false);
    expect(isMissingValue('92.1')).toBe(false);
  });

  it('parses sleep latency into numeric minutes and decimal hours', () => {
    // Standard HH:mm formats
    expect(parseLatencyToMinutes('0:14')).toBe(14);
    expect(latencyMinutesToHours(14)).toBe(0.2333);

    expect(parseLatencyToMinutes('0:06')).toBe(6);
    expect(latencyMinutesToHours(6)).toBe(0.1);

    expect(parseLatencyToMinutes('1:48')).toBe(108);
    expect(latencyMinutesToHours(108)).toBe(1.8);

    // Genuine 0:00 latency must be parsed as 0 (not null)
    expect(parseLatencyToMinutes('0:00')).toBe(0);
    expect(latencyMinutesToHours(0)).toBe(0);

    // Missing values must return null, NEVER 0
    expect(parseLatencyToMinutes('NA')).toBeNull();
    expect(parseLatencyToMinutes('No Data')).toBeNull();
    expect(parseLatencyToMinutes('')).toBeNull();
    expect(parseLatencyToMinutes(null)).toBeNull();
    expect(latencyMinutesToHours(null)).toBeNull();
  });

  it('parses sleep duration into numeric minutes and decimal hours', () => {
    // HH:mm:ss format
    expect(parseDurationToMinutes('7:44:00')).toBe(464);
    expect(durationMinutesToHours(464)).toBe(7.7333);

    expect(parseDurationToMinutes('7:50:00')).toBe(470);
    expect(durationMinutesToHours(470)).toBe(7.8333);

    // HH:mm format
    expect(parseDurationToMinutes('7:20')).toBe(440);
    expect(durationMinutesToHours(440)).toBe(7.3333);

    // Missing values must return null, NEVER 0
    expect(parseDurationToMinutes('NA')).toBeNull();
    expect(parseDurationToMinutes('No Data')).toBeNull();
    expect(parseDurationToMinutes('')).toBeNull();
    expect(durationMinutesToHours(null)).toBeNull();
  });

  it('parses sleep efficiency percentages correctly', () => {
    expect(parseEfficiencyPercent('92.1')).toBe(92.1);
    expect(parseEfficiencyPercent('95.8')).toBe(95.8);
    expect(parseEfficiencyPercent('100.0')).toBe(100.0);
    expect(parseEfficiencyPercent('0.0')).toBe(0.0);

    // Missing or invalid values
    expect(parseEfficiencyPercent('NA')).toBeNull();
    expect(parseEfficiencyPercent('No Data')).toBeNull();
    expect(parseEfficiencyPercent('')).toBeNull();
    expect(parseEfficiencyPercent('-5')).toBeNull();
    expect(parseEfficiencyPercent('105')).toBeNull();
  });
});

describe('Missing Value Preservation in Records', () => {
  it('preserves NA and No Data as null in parsed SleepRecord', () => {
    const validRow = {
      ID: 1,
      Subject: 'C1G0001',
      Test_Phase: 'PRE_TEST',
      BR_Day: 2,
      Date: '9/7/2004',
      'Sleep Latency (hours)': '0:14',
      'Sleep Duration (hours)': '7:44:00',
      'Sleep Efficiency (%)': '92.1',
      Notes: 'NA',
    };
    const parsedValid = parseSleepRecordRow(validRow);
    expect(parsedValid.latencyMinutes).toBe(14);
    expect(parsedValid.durationMinutes).toBe(464);
    expect(parsedValid.efficiencyPercent).toBe(92.1);
    expect(parsedValid.notes).toBeNull(); // 'NA' note becomes null

    const missingRow = {
      ID: 70,
      Subject: 'C1G0002',
      Test_Phase: 'PRE_TEST',
      BR_Day: 2,
      Date: '9/7/2004',
      'Sleep Latency (hours)': 'NA',
      'Sleep Duration (hours)': 'NA',
      'Sleep Efficiency (%)': 'NA',
      Notes: 'No Data',
    };
    const parsedMissing = parseSleepRecordRow(missingRow);
    expect(parsedMissing.latencyMinutes).toBeNull();
    expect(parsedMissing.latencyHours).toBeNull();
    expect(parsedMissing.durationMinutes).toBeNull();
    expect(parsedMissing.durationHours).toBeNull();
    expect(parsedMissing.efficiencyPercent).toBeNull();
    expect(parsedMissing.notes).toBeNull();
  });
});

describe('Verified NASA Dataset Integrity & Statistics', () => {
  it('loads exactly 207 verified records across 3 participants', () => {
    const records = getVerifiedSleepRecords();
    expect(records.length).toBe(207);
    expect(DATASET_METADATA.totalRecords).toBe(207);

    const ids = getParticipantIds();
    expect(ids).toEqual(['C1G0001', 'C1G0002', 'C1G0003']);
  });

  it('verifies exact record distribution per participant and test phase', () => {
    const records = getVerifiedSleepRecords();
    const participants = getParticipants();

    // Exactly 69 records per subject (2 PRE_TEST + 60 IN_TEST + 7 POST_TEST)
    for (const id of ['C1G0001', 'C1G0002', 'C1G0003']) {
      const p = participants[id];
      expect(p.records.length).toBe(69);
      expect(p.summary.phaseCounts.PRE_TEST).toBe(2);
      expect(p.summary.phaseCounts.IN_TEST).toBe(60);
      expect(p.summary.phaseCounts.POST_TEST).toBe(7);
    }

    // Verify missing record counts:
    // C1G0001 has 0 missing records (all 69 are complete)
    expect(participants['C1G0001'].summary.missingRecordsCount).toBe(0);
    expect(participants['C1G0001'].summary.validRecordsCount).toBe(69);

    // C1G0002 has 7 missing records (2 PRE_TEST, and IN_TEST days 1, 26, 27, 28, 29)
    expect(participants['C1G0002'].summary.missingRecordsCount).toBe(7);
    expect(participants['C1G0002'].summary.validRecordsCount).toBe(62);

    // C1G0003 has 10 missing records (2 PRE_TEST, and IN_TEST days 1-8)
    expect(participants['C1G0003'].summary.missingRecordsCount).toBe(10);
    expect(participants['C1G0003'].summary.validRecordsCount).toBe(59);

    // Total missing across dataset = 17 records
    const allMissing = records.filter(
      (r) => r.durationMinutes === null || r.efficiencyPercent === null
    );
    expect(allMissing.length).toBe(17);
  });
});

describe('Participant-Specific PRE_TEST Baseline Derivations', () => {
  it('correctly calculates PRE_TEST baseline for C1G0001 with sufficient valid records', () => {
    const participants = getParticipants();
    const c1 = participants['C1G0001'];
    const baseline = c1.baseline;

    expect(baseline.isAvailable).toBe(true);
    expect(baseline.validPreTestRecordCount).toBe(2);
    expect(baseline.totalPreTestRecordCount).toBe(2);
    expect(baseline.provenance).toBe('VERIFIED_NASA_RESEARCH_DATA');

    // Day 2 (7:44 = 464 mins), Day 1 (7:50 = 470 mins) -> mean = 467 mins = 7.7833 hrs
    expect(baseline.meanDurationMinutes).toBe(467);
    expect(baseline.meanDurationHours).toBe(7.7833);

    // Latencies: 14 mins and 6 mins -> mean = 10.0 mins
    expect(baseline.meanLatencyMinutes).toBe(10.0);

    // Efficiencies: 92.1% and 95.8% -> mean = 93.95%
    expect(baseline.meanEfficiencyPercent).toBe(93.95);
  });

  it('marks baseline unavailable for C1G0002 due to zero valid PRE_TEST records without inventing data', () => {
    const participants = getParticipants();
    const c2 = participants['C1G0002'];
    const baseline = c2.baseline;

    expect(baseline.isAvailable).toBe(false);
    expect(baseline.validPreTestRecordCount).toBe(0);
    expect(baseline.totalPreTestRecordCount).toBe(2);
    expect(baseline.provenance).toBe('UNAVAILABLE_DATA');
    expect(baseline.meanDurationHours).toBeNull();
    expect(baseline.meanDurationMinutes).toBeNull();
    expect(baseline.meanLatencyMinutes).toBeNull();
    expect(baseline.meanEfficiencyPercent).toBeNull();
    expect(baseline.unavailabilityReason).toContain('0 valid PRE_TEST records found');
  });

  it('marks baseline unavailable for C1G0003 due to zero valid PRE_TEST records without inventing data', () => {
    const participants = getParticipants();
    const c3 = participants['C1G0003'];
    const baseline = c3.baseline;

    expect(baseline.isAvailable).toBe(false);
    expect(baseline.validPreTestRecordCount).toBe(0);
    expect(baseline.totalPreTestRecordCount).toBe(2);
    expect(baseline.provenance).toBe('UNAVAILABLE_DATA');
    expect(baseline.meanDurationHours).toBeNull();
    expect(baseline.meanEfficiencyPercent).toBeNull();
    expect(baseline.unavailabilityReason).toContain('0 valid PRE_TEST records found');
  });

  it('marks baseline unavailable when fewer than required records exist', () => {
    const records = [
      parseSleepRecordRow({
        ID: 1,
        Subject: 'TEST_SUBJ',
        Test_Phase: 'PRE_TEST',
        BR_Day: 1,
        Date: '1/1/2026',
        'Sleep Latency (hours)': '0:10',
        'Sleep Duration (hours)': '8:00:00',
        'Sleep Efficiency (%)': '90.0',
      }),
    ];
    // Requires minimum 2 records for stability
    const baseline = calculateParticipantBaseline('TEST_SUBJ', records, 2);
    expect(baseline.isAvailable).toBe(false);
    expect(baseline.validPreTestRecordCount).toBe(1);
    expect(baseline.unavailabilityReason).toContain('minimum 2 required');
  });

  it('calculates overall sleep summary across all records', () => {
    const records = getVerifiedSleepRecords();
    const summary = calculateSleepSummary('C1G0001', records);
    expect(summary.totalRecords).toBe(69);
    expect(summary.validRecordsCount).toBe(69);
    expect(summary.missingRecordsCount).toBe(0);
    expect(summary.meanDurationHours).toBeGreaterThan(6);
    expect(summary.meanEfficiencyPercent).toBeGreaterThan(80);
    expect(summary.phaseCounts.IN_TEST).toBe(60);
  });
});

