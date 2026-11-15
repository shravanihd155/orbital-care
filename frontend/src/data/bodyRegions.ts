/**
 * ORBITAL CARE — Anatomical Telemetry Regions & Sensors
 * NASA Space Apps Challenge 2026 // SPACE HABITAT OS
 *
 * Strict Provenance Disclosure:
 * - Only the Wrist Actigraph is VERIFIED_NASA_RESEARCH_DATA from UTMB Campaign 1.
 * - Cranial, Cardiovascular, and Core regions are explicitly SIMULATED_DATA for habitat interface demonstration.
 * - Musculoskeletal is explicitly UNAVAILABLE_DATA.
 * - Body-wide physiological measurements are never implied to be part of the actigraphy dataset.
 */

import { BodyRegion } from '../types';

export function getBodyRegions(activeDuration?: string, activeEfficiency?: string): BodyRegion[] {
  return [
    {
      id: 'wrist',
      name: 'Right Wrist (Actigraphy Array)',
      anatomicalTarget: 'Right Distal Forearm / Wrist',
      sensorDevice: 'Cole-Brandt Validated Wrist Actigraph',
      measurementType: 'Sleep-Wake Motility, Sleep Duration, Latency & Efficiency',
      unit: 'Hours / Minutes / %',
      currentValue: activeDuration && activeEfficiency ? `${activeDuration} hrs (${activeEfficiency}%)` : 'Active Telemetry',
      provenance: 'VERIFIED_NASA_RESEARCH_DATA',
      status: 'ACTIVE_TELEMETRY',
      description:
        'Empirical NASA Human Research Program actigraphy measuring physical rest-activity cycles in a 60-day 6° head-down tilt bedrest spaceflight analog.',
      isEmpiricalResearch: true,
    },
    {
      id: 'neuro',
      name: 'Cranial / Neurological Sensor Array',
      anatomicalTarget: 'Prefrontal & Parietal Cortex',
      sensorDevice: 'Simulated Hab-EEG Headband (Model NEURO-SYNTH-1)',
      measurementType: 'Circadian Slow-Wave Synchrony & Sleep Onset Readiness',
      unit: 'µV / Stage Index',
      currentValue: '12.4 µV (Simulated Alpha/Theta Ratio)',
      provenance: 'SIMULATED_DATA',
      status: 'SIMULATED_STREAM',
      description:
        'Illustrative space habitat neural telemetry concept. The verified UTMB dataset contains actigraphy only; EEG sleep staging is synthetic.',
      isEmpiricalResearch: false,
    },
    {
      id: 'cardio',
      name: 'Cardiovascular & Autonomic Telemetry',
      anatomicalTarget: 'Thoracic / Precordial Field',
      sensorDevice: 'Simulated Bio-Harness PPG / ECG (Model CARDIO-V2)',
      measurementType: 'Resting Heart Rate & Parasympathetic HRV (RMSSD)',
      unit: 'BPM / ms',
      currentValue: '62 BPM / 54 ms RMSSD (Simulated)',
      provenance: 'SIMULATED_DATA',
      status: 'SIMULATED_STREAM',
      description:
        'Simulated telemetry stream for nocturnal autonomic monitoring. Not measured by the wrist actigraph.',
      isEmpiricalResearch: false,
    },
    {
      id: 'core',
      name: 'Core Thermoregulation Sensor',
      anatomicalTarget: 'Deep Body Core',
      sensorDevice: 'Simulated Ingestible Thermistor Pill (Model THERMO-COR)',
      measurementType: 'Core Body Temperature & Nadir Circadian Timing',
      unit: '°C',
      currentValue: '36.8 °C (Simulated Circadian Nadir)',
      provenance: 'SIMULATED_DATA',
      status: 'SIMULATED_STREAM',
      description:
        'Simulated circadian thermoregulation channel. Reflects physiological cooling during sleep episodes.',
      isEmpiricalResearch: false,
    },
    {
      id: 'musculoskeletal',
      name: 'Musculoskeletal / Lower Extremity Array',
      anatomicalTarget: 'Soleus & Gastrocnemius (Calf Musculature)',
      sensorDevice: 'Surface EMG Bio-Patch (Model EMG-LEG-04)',
      measurementType: 'Postural Tone & Cephalic Fluid Shift Adaptation',
      unit: 'mV',
      currentValue: '--- [UNAVAILABLE]',
      provenance: 'UNAVAILABLE_DATA',
      status: 'UNAVAILABLE',
      description:
        'Surface sensor offline / unmonitored. No telemetry received for this anatomical channel.',
      isEmpiricalResearch: false,
    },
  ];
}
