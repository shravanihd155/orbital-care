# ORBITAL CARE — PROJECT STATUS
**NASA Space Apps Challenge 2026 // Frontend Track**
**Current Branch:** `frontend`
**Milestone Completed:** Milestone 2 (Main Space Habitat OS Dashboard & Real Actigraphy Analytics)
**Timestamp:** 2026-11-15 14:02 IST

---

## 1. Executive Summary

Milestone 2 has been completed with 100% adherence to all project constraints and aerospace design guidelines. The full interactive **SPACE HABITAT OS** dashboard is now operational on top of the verified NASA Human Research Program UTMB Bedrest Campaign 1 Actigraphy dataset.

All health telemetry components strictly enforce data provenance disclosures, separating empirical NASA research data from simulated telemetry and offline channels. Zero arbitrary scoring formulas or unsupported clinical cutoffs are introduced. 18 automated unit tests pass with zero errors, and the production build compiles cleanly.

---

## 2. Completed Features in Milestone 2

### 2.1 Main Dashboard & Space Habitat OS Navigation
- **`TopBar.tsx`:** Tactical flight deck navigation bar featuring:
  - Live ticking Mission Elapsed Time (MET) counter (`DDD:HH:MM:SS`).
  - Active habitat module tag (`GATEWAY / HAB-03 [ILLUSTRATIVE]`).
  - Empirical NASA HRP telemetry sync beacon.
  - Interactive participant selector pills switching smoothly between `C1G0001`, `C1G0002`, and `C1G0003` with immediate baseline status dot indicators.
- **`AstronautProfile.tsx`:** Crew station profile panel featuring:
  - Custom vector space helmet avatar with live bio-sync pulse.
  - Crew role (`Commander / Crew Medical Officer`), mission sol (`Sol 142 of 360`), and expedition insignia.
  - Prominent badge: `[ILLUSTRATIVE DEMO PROFILE]`.
  - Onboard ECLSS environmental mini-strip (`Cabin PCO2: 0.8 mmHg`, `Pressure: 14.7 psi`, `Temperature: 21.5 °C`) explicitly labeled `[SIMULATED DATA]`.

### 2.2 Interactive Vector-Based Human Body Visualization
- **`InteractiveBodyMap.tsx`:** Anatomical telemetry model with interactive target rings and HUD coordinate framing:
  - **Selectable Regions:**
    1. *Right Wrist:* **VERIFIED_NASA_RESEARCH_DATA** (Cole-Brandt Validated Wrist Actigraph). Displays real empirical sleep duration and efficiency.
    2. *Cranial / Neurological:* **SIMULATED_DATA** (Simulated Hab-EEG Headband).
    3. *Cardiovascular:* **SIMULATED_DATA** (Simulated PPG/ECG Bio-Harness).
    4. *Core Thermoregulation:* **SIMULATED_DATA** (Simulated Ingestible Thermistor Pill).
    5. *Musculoskeletal / Calf:* **UNAVAILABLE_DATA** (Surface EMG Channel Offline).
  - **Strict Research Boundary Notice:** Explicit banner clarifies that the NASA dataset contains wrist actigraphy only; body-wide biometrics are simulated telemetry overlays for habitat telemedicine interface demonstration.

### 2.3 Real Sleep Analytics Components (Recharts + Verified Data)
- **`SleepSummary.tsx`:** 4-card metric overview with animated count-up effects and hover elevations:
  - *Mean Sleep Duration* ($7.1\text{ hrs}$ mean across 69 days for C1G0001).
  - *Mean Sleep Latency* ($10.5\text{ min}$ mean for C1G0001).
  - *Mean Sleep Efficiency* ($90.2\%$ mean for C1G0001).
  - *Telemetry Completeness & Missing Records Counter*.
  - *Participant Baseline Transparency Card* detailing baseline status and caveats.
- **`SleepDurationChart.tsx`:** Recharts Bar chart rendering all 69 study days:
  - Color-codes study phases: Mission Orange for `PRE_TEST`, Dusty Violet for `IN_TEST` (60 bedrest days), and Orbital Lime for `POST_TEST`.
  - Missing readings rendered as true gaps (never zeroed).
  - For `C1G0001`: Renders preliminary baseline reference line ($7.78\text{ hrs}$, N=2).
  - For `C1G0002` & `C1G0003`: Baseline reference is cleanly suppressed.
- **`SleepLatencyChart.tsx`:** Recharts Line chart tracking daily sleep onset latency:
  - `connectNulls={false}` ensures missing records appear as visible gaps.
  - For `C1G0001`: Renders preliminary latency baseline ($10.0\text{ min}$, N=2).
  - Genuine `0:00` recorded latencies are preserved and rendered as `0 min`.
- **`SleepEfficiencyChart.tsx`:** Recharts Area chart tracking daily efficiency percentage:
  - Displays actual empirical ratio ($\text{Sleep Time} / \text{Time in Bed}$).
  - Strictly avoids unsupported 85% clinical threshold lines.
  - For `C1G0001`: Renders preliminary baseline reference line ($93.95\%$, N=2).

### 2.4 Baseline Caveats & Explainable Decision Support
- **`observationGenerator.ts` & `ObservationAlerts.tsx`:**
  - Mandatory Disclaimer Banner on every alert: **"DECISION SUPPORT ONLY — NOT A MEDICAL DIAGNOSIS."**
  - **`C1G0001`:** Shows its two valid `PRE_TEST` observations (Day 2: 7h 44m, 92.1%; Day 1: 7h 50m, 95.8%) and explicitly labels the baseline **"LIMITED / PRELIMINARY BASELINE (N=2; non-normative)"**.
  - **`C1G0002` & `C1G0003`:** Explicitly shows **"BASELINE UNAVAILABLE"** (both pre-test records marked `No Data`). Zero synthetic numbers are fabricated, and baseline deviation calculations are suppressed.
  - Transparent observations highlight acute single-night duration reductions ($>2\text{ hrs}$ below preliminary baseline) and prolonged onset latency ($\ge 25\text{ min}$ increase).

### 2.5 Master Telemetry Provenance Registry
- **`ProvenanceBadge.tsx` & `ProvenanceLedger.tsx`:**
  - Table disclosing every channel, sensor device, measurement unit, sampling rate, and status.
  - Standardizes the 3 explicit provenance states: `VERIFIED_NASA_RESEARCH_DATA`, `SIMULATED_DATA`, and `UNAVAILABLE_DATA`.
  - Reaffirms the zero-fabrication data policy.

---

## 3. Validation Results

### 3.1 Unit Test Suite (Vitest)
Ran 18 automated unit tests across 2 test suites:
- `src/utils/actigraphyParser.test.ts`: 12 tests passed (time conversion, missing value preservation, record distributions, baselines).
- `src/utils/observationGenerator.test.ts`: 6 tests passed (preliminary baseline caveats, baseline suppression for C1G0002/C1G0003, omission of unsupported 85% threshold, anatomical sensor provenance).
- **Result:** `18 passed (18), 0 failed` in `1.67s`.

### 3.2 Production Build (`tsc -b && vite build`)
- TypeScript compiler (`tsc -b`): **0 errors, 0 warnings**.
- Vite production bundle: **Built in 7.30s**.
  - `dist/index.html`: 0.91 kB
  - `dist/assets/index-*.css`: 21.23 kB
  - `dist/assets/index-*.js`: 673.48 kB

---

## 4. Remaining Tasks for Subsequent Phases

1. **Frontend-Backend Integration (When Backend is Developed):**
   - Connect client-side service adapter to live REST / WebSocket backend endpoints.
2. **Offline PWA Support:**
   - Add service worker caching for offline habitat workstation resilience.
3. **Red-Shift Night Mode Circadian Lighting Toggle:**
   - Implement header toggle switching tokens to deep carbon (`#121316`) and amber (`#E5A96E`) for low-blue-light habitat night shifts.
