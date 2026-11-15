from __future__ import annotations

import re
from pathlib import Path
from statistics import mean, stdev

import json5
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "frontend" / "src" / "data" / "utmbBedrestActigraphy.ts"

DATASET_NAME = "NASA UTMB Bedrest Campaign 1 Actigraphy"
DATA_SOURCE = "NASA Human Research Program (HRP) / UTMB"
DISCLAIMER = (
    "Terrestrial 60-day 6-degree head-down tilt bedrest microgravity analog. "
    "Not in-flight astronaut telemetry. Decision support only, not a medical diagnosis."
)
PROVENANCE = "VERIFIED_NASA_RESEARCH_DATA"
ALERT_DISCLAIMER = "DECISION SUPPORT ONLY - NOT A MEDICAL DIAGNOSIS."


def load_raw_records():
    if not DATA_FILE.exists():
        raise RuntimeError(f"Research dataset not found: {DATA_FILE}")

    source = DATA_FILE.read_text(encoding="utf-8-sig")
    match = re.search(
        r"export\s+const\s+RAW_ACTIGRAPHY_DATA\s*=\s*(\[.*?\])\s*;",
        source,
        re.DOTALL,
    )
    if not match:
        raise RuntimeError("Could not locate RAW_ACTIGRAPHY_DATA in TypeScript file.")

    records = json5.loads(match.group(1))
    if not isinstance(records, list) or not records:
        raise RuntimeError("Research dataset is empty or invalid.")
    return records


def missing(value):
    if value is None:
        return True
    return str(value).strip().upper() in ("", "NA", "N/A", "NO DATA", "NULL", "NONE")


def parse_clock(value, duration=False):
    if missing(value):
        return None
    parts = str(value).strip().split(":")
    if len(parts) < 2 or len(parts) > 3:
        return None
    try:
        hours, minutes = int(parts[0]), int(parts[1])
        seconds = int(parts[2]) if len(parts) == 3 else 0
    except ValueError:
        return None
    if hours < 0 or not 0 <= minutes < 60 or not 0 <= seconds < 60:
        return None
    return hours * 60 + minutes + (seconds / 60 if duration else 0)


def parse_records():
    parsed = []
    for raw in load_raw_records():
        latency = parse_clock(raw.get("Sleep Latency (hours)"))
        duration = parse_clock(raw.get("Sleep Duration (hours)"), duration=True)
        efficiency_raw = raw.get("Sleep Efficiency (%)")
        try:
            efficiency = None if missing(efficiency_raw) else float(efficiency_raw)
            if efficiency is not None and not 0 <= efficiency <= 100:
                efficiency = None
        except (ValueError, TypeError):
            efficiency = None

        phase = str(raw.get("Test_Phase", "IN_TEST")).strip().upper()
        if phase not in ("PRE_TEST", "IN_TEST", "POST_TEST"):
            phase = "IN_TEST"

        parsed.append({
            "id": int(raw["ID"]),
            "subjectId": str(raw["Subject"]).strip(),
            "testPhase": phase,
            "bedrestDay": int(raw["BR_Day"]),
            "date": str(raw.get("Date", "")).strip(),
            "rawLatency": raw.get("Sleep Latency (hours)", ""),
            "rawDuration": raw.get("Sleep Duration (hours)", ""),
            "latencyMinutes": latency,
            "latencyHours": round(latency / 60, 4) if latency is not None else None,
            "durationMinutes": round(duration) if duration is not None else None,
            "durationHours": round(duration / 60, 4) if duration is not None else None,
            "efficiencyPercent": round(efficiency, 2) if efficiency is not None else None,
            "notes": None if missing(raw.get("Notes")) else raw.get("Notes"),
            "provenance": PROVENANCE,
            "dataSource": DATASET_NAME,
        })
    return parsed


RECORDS = parse_records()
PARTICIPANT_IDS = sorted({r["subjectId"] for r in RECORDS})


def participant_data(subject_id):
    records = sorted(
        [r for r in RECORDS if r["subjectId"] == subject_id],
        key=lambda r: r["id"],
    )
    if not records:
        raise HTTPException(status_code=404, detail="Participant not found.")

    pre = [r for r in records if r["testPhase"] == "PRE_TEST"]
    valid_pre = [
        r for r in pre
        if r["durationMinutes"] is not None and r["efficiencyPercent"] is not None
    ]
    baseline_available = len(valid_pre) >= 2

    if baseline_available:
        baseline_duration = round(mean(r["durationMinutes"] for r in valid_pre))
        baseline_latency_values = [
            r["latencyMinutes"] for r in valid_pre if r["latencyMinutes"] is not None
        ]
        baseline_latency = (
            round(mean(baseline_latency_values), 1) if baseline_latency_values else None
        )
        baseline_efficiency = round(
            mean(r["efficiencyPercent"] for r in valid_pre), 2
        )
        baseline = {
            "subjectId": subject_id,
            "isAvailable": True,
            "validPreTestRecordCount": len(valid_pre),
            "totalPreTestRecordCount": len(pre),
            "baselineQuality": "PRELIMINARY_LIMITED",
            "baselineLabel": "LIMITED / PRELIMINARY BASELINE (N=2)",
            "baselineCaveat": (
                "Derived from N=2 pre-bedrest observations. Reference only; "
                "not a statistically reliable population norm."
            ),
            "meanDurationMinutes": baseline_duration,
            "meanDurationHours": round(baseline_duration / 60, 4),
            "meanLatencyMinutes": baseline_latency,
            "meanEfficiencyPercent": baseline_efficiency,
            "provenance": PROVENANCE,
            "dataSource": DATASET_NAME,
        }
    else:
        baseline_duration = baseline_latency = baseline_efficiency = None
        baseline = {
            "subjectId": subject_id,
            "isAvailable": False,
            "validPreTestRecordCount": len(valid_pre),
            "totalPreTestRecordCount": len(pre),
            "baselineQuality": "UNAVAILABLE",
            "baselineLabel": "BASELINE UNAVAILABLE",
            "baselineCaveat": "Insufficient valid PRE_TEST records. Deviations are suppressed.",
            "unavailabilityReason": f"Only {len(valid_pre)} valid PRE_TEST records; 2 required.",
            "meanDurationMinutes": None,
            "meanDurationHours": None,
            "meanLatencyMinutes": None,
            "meanEfficiencyPercent": None,
            "provenance": "UNAVAILABLE_DATA",
            "dataSource": DATASET_NAME,
        }

    valid = [
        r for r in records
        if r["durationMinutes"] is not None and r["efficiencyPercent"] is not None
    ]
    durations = [r["durationHours"] for r in valid]
    efficiencies = [r["efficiencyPercent"] for r in valid]
    latencies = [r["latencyMinutes"] for r in valid if r["latencyMinutes"] is not None]
    phases = {
        phase: sum(r["testPhase"] == phase for r in records)
        for phase in ("PRE_TEST", "IN_TEST", "POST_TEST")
    }

    summary = {
        "subjectId": subject_id,
        "totalRecords": len(records),
        "validRecordsCount": len(valid),
        "missingRecordsCount": len(records) - len(valid),
        "meanDurationHours": round(mean(durations), 4) if durations else None,
        "meanDurationMinutes": round(mean(r["durationMinutes"] for r in valid)) if valid else None,
        "meanLatencyMinutes": round(mean(latencies), 1) if latencies else None,
        "meanEfficiencyPercent": round(mean(efficiencies), 2) if efficiencies else None,
        "minDurationHours": min(durations) if durations else None,
        "maxDurationHours": max(durations) if durations else None,
        "minEfficiencyPercent": min(efficiencies) if efficiencies else None,
        "maxEfficiencyPercent": max(efficiencies) if efficiencies else None,
        "phaseCounts": phases,
        "provenance": PROVENANCE,
        "dataSource": DATASET_NAME,
    }

    return {
        "id": subject_id,
        "studyName": DATASET_NAME,
        "studyContext": "Terrestrial 6-degree Head-Down Tilt Bedrest (Microgravity Analog)",
        "isSpaceflightAnalog": True,
        "totalRecords": len(records),
        "baseline": baseline,
        "summary": summary,
        "records": records,
    }


def observations_for(subject_id):
    person = participant_data(subject_id)
    baseline = person["baseline"]
    summary = person["summary"]
    records = person["records"]
    alerts = []

    if baseline["isAvailable"]:
        alerts.append({
            "id": f"{subject_id}-baseline-notice",
            "subjectId": subject_id,
            "urgency": "INFO",
            "title": "Preliminary Ambulatory Baseline Established",
            "observation": (
                f"Calculated from {baseline['validPreTestRecordCount']} valid PRE_TEST nights."
            ),
            "baselineComparisonNote": baseline["baselineCaveat"],
            "provenance": PROVENANCE,
            "metricKey": "data_integrity",
            "rationale": "Individual pre-bedrest reference; limited sample size.",
            "disclaimer": ALERT_DISCLAIMER,
        })

        base_duration = baseline["meanDurationMinutes"]
        drops = [
            r for r in records
            if r["testPhase"] == "IN_TEST"
            and r["durationMinutes"] is not None
            and base_duration - r["durationMinutes"] >= 120
        ]
        if drops:
            worst = min(drops, key=lambda r: r["durationMinutes"])
            delta = base_duration - worst["durationMinutes"]
            alerts.append({
                "id": f"{subject_id}-acute-duration-drop",
                "subjectId": subject_id,
                "urgency": "CAUTION",
                "title": f"[DEMO HEURISTIC] Sleep duration reduction on day {worst['bedrestDay']}",
                "observation": (
                    f"Recorded duration {worst['durationHours']} hours, "
                    f"{delta / 60:.1f} hours below preliminary baseline."
                ),
                "baselineComparisonNote": (
                    "The 2-hour difference is an experimental demonstration heuristic, "
                    "not a validated clinical or NASA operational cutoff."
                ),
                "provenance": PROVENANCE,
                "studyDay": worst["bedrestDay"],
                "studyPhase": "IN_TEST",
                "date": worst["date"],
                "metricKey": "duration",
                "rationale": f"{len(drops)} nights met this demonstration criterion.",
                "disclaimer": ALERT_DISCLAIMER,
            })

        base_latency = baseline["meanLatencyMinutes"]
        if base_latency is not None:
            prolonged = [
                r for r in records
                if r["testPhase"] == "IN_TEST"
                and r["latencyMinutes"] is not None
                and r["latencyMinutes"] - base_latency >= 25
            ]
            if prolonged:
                worst = max(prolonged, key=lambda r: r["latencyMinutes"])
                alerts.append({
                    "id": f"{subject_id}-prolonged-latency",
                    "subjectId": subject_id,
                    "urgency": "ADVISORY",
                    "title": f"[DEMO HEURISTIC] Prolonged sleep onset latency on day {worst['bedrestDay']}",
                    "observation": (
                        f"Latency was {worst['latencyMinutes']} minutes, "
                        f"{worst['latencyMinutes'] - base_latency:.1f} minutes above baseline."
                    ),
                    "baselineComparisonNote": (
                        "The 25-minute difference is an experimental demonstration heuristic, "
                        "not a validated clinical standard."
                    ),
                    "provenance": PROVENANCE,
                    "studyDay": worst["bedrestDay"],
                    "studyPhase": "IN_TEST",
                    "date": worst["date"],
                    "metricKey": "latency",
                    "rationale": "Descriptive comparison with a limited preliminary baseline.",
                    "disclaimer": ALERT_DISCLAIMER,
                })
    else:
        alerts.append({
            "id": f"{subject_id}-baseline-unavailable",
            "subjectId": subject_id,
            "urgency": "INFO",
            "title": "Ambulatory Baseline Unavailable",
            "observation": baseline["unavailabilityReason"],
            "baselineComparisonNote": "Baseline deviations are not calculated.",
            "provenance": "UNAVAILABLE_DATA",
            "metricKey": "data_integrity",
            "rationale": "No synthetic baseline is substituted.",
            "disclaimer": ALERT_DISCLAIMER,
        })

        if summary["missingRecordsCount"]:
            alerts.append({
                "id": f"{subject_id}-telemetry-gaps",
                "subjectId": subject_id,
                "urgency": "ADVISORY",
                "title": f"{summary['missingRecordsCount']} missing actigraphy records",
                "observation": "Some study records have no valid sleep measurements.",
                "provenance": "UNAVAILABLE_DATA",
                "metricKey": "data_integrity",
                "rationale": "Missing records remain null and are not treated as zero.",
                "disclaimer": ALERT_DISCLAIMER,
            })

    return alerts


app = FastAPI(
    title="ORBITAL CARE API",
    description=(
        "Research-grounded astronaut health decision-support prototype. "
        + DISCLAIMER
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "ORBITAL CARE API",
        "datasetRecords": len(RECORDS),
        "participants": len(PARTICIPANT_IDS),
    }


@app.get("/api/dataset")
def dataset():
    return {
        "datasetName": DATASET_NAME,
        "campaign": "Campaign 1",
        "sourceInstitution": DATA_SOURCE,
        "studyDesign": "60-day 6-degree Head-Down Tilt Bedrest",
        "analogsUsed": "Terrestrial microgravity analog",
        "actigraphyDevice": "Cole-Brandt Wrist Actigraph",
        "disclaimer": DISCLAIMER,
        "totalRecords": len(RECORDS),
        "participantsCount": len(PARTICIPANT_IDS),
        "provenance": PROVENANCE,
    }


@app.get("/api/participants")
def participants():
    return {
        "participants": [
            {
                "id": pid,
                "summary": participant_data(pid)["summary"],
                "baseline": participant_data(pid)["baseline"],
            }
            for pid in PARTICIPANT_IDS
        ],
        "count": len(PARTICIPANT_IDS),
    }


@app.get("/api/participants/{subject_id}")
def get_participant(subject_id: str):
    return participant_data(subject_id)


@app.get("/api/participants/{subject_id}/observations")
def get_observations(subject_id: str):
    return {"participantId": subject_id, "observations": observations_for(subject_id)}


@app.get("/api/participants/{subject_id}/records")
def get_records(subject_id: str, phase: str | None = None):
    person = participant_data(subject_id)
    records = person["records"]
    if phase:
        phase = phase.upper()
        if phase not in ("PRE_TEST", "IN_TEST", "POST_TEST"):
            raise HTTPException(status_code=400, detail="Invalid study phase.")
        records = [r for r in records if r["testPhase"] == phase]
    return {"participantId": subject_id, "records": records, "count": len(records)}
