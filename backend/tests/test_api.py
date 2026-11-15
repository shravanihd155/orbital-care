from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["datasetRecords"] == 207
    assert response.json()["participants"] == 3


def test_dataset_metadata():
    response = client.get("/api/dataset")
    assert response.status_code == 200
    assert response.json()["provenance"] == "VERIFIED_NASA_RESEARCH_DATA"


def test_all_participants():
    response = client.get("/api/participants")
    assert response.status_code == 200
    assert response.json()["count"] == 3


def test_participant_records():
    response = client.get("/api/participants/C1G0001")
    assert response.status_code == 200
    data = response.json()
    assert data["totalRecords"] == 69
    assert data["baseline"]["isAvailable"] is True
    assert len(data["records"]) == 69


def test_missing_baselines_are_not_fabricated():
    for subject in ("C1G0002", "C1G0003"):
        response = client.get(f"/api/participants/{subject}")
        assert response.status_code == 200
        assert response.json()["baseline"]["isAvailable"] is False
        assert response.json()["baseline"]["meanDurationHours"] is None


def test_missing_records_remain_null():
    response = client.get("/api/participants/C1G0002/records")
    assert response.status_code == 200
    records = response.json()["records"]
    assert any(r["durationMinutes"] is None for r in records)


def test_observations_have_disclaimer():
    response = client.get("/api/participants/C1G0001/observations")
    assert response.status_code == 200
    for alert in response.json()["observations"]:
        assert "NOT A MEDICAL DIAGNOSIS" in alert["disclaimer"]


def test_unknown_participant():
    response = client.get("/api/participants/UNKNOWN")
    assert response.status_code == 404


def test_phase_filter():
    response = client.get("/api/participants/C1G0001/records?phase=IN_TEST")
    assert response.status_code == 200
    assert response.json()["count"] == 60
    assert all(r["testPhase"] == "IN_TEST" for r in response.json()["records"])
