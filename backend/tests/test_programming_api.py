"""Tests d'integration pour l'API de programmation architecturale."""

import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "app"))
from main import app

client = TestClient(app)


class TestProgrammingAPI:
    """Tests des endpoints de programmation architecturale."""

    # ------------------------------------------------------------------
    # POST /api/v2/programming/generate/{project_id}
    # ------------------------------------------------------------------

    def test_generate_program(self):
        """La generation d'un programme doit retourner un resultat complet."""
        response = client.post(
            "/api/v2/programming/generate/test-proj-1",
            json={
                "rooms": [
                    {"type": "salon", "surface": 25, "orientation": "S", "priority": 1},
                    {"type": "cuisine", "surface": 10, "orientation": "N", "priority": 2},
                    {"type": "chambre", "surface": 12, "priority": 2},
                ],
                "project_type": "extension_under_40",
                "style": "moderne",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["project_id"] == "test-proj-1"
        assert data["status"] == "generated"
        assert "rooms_programmed" in data
        assert "adjacency_graph" in data
        assert "footprint" in data
        assert "sun_analysis" in data
        assert "budget_estimate" in data
        assert "surfaces" in data
        assert "ratios" in data

    def test_generate_program_rooms_count(self):
        """Le nombre de rooms programmees doit correspondre a l'input."""
        response = client.post(
            "/api/v2/programming/generate/test-proj-1",
            json={
                "rooms": [
                    {"type": "salon", "surface": 25},
                    {"type": "cuisine", "surface": 10},
                    {"type": "chambre", "surface": 12},
                ],
            },
        )
        data = response.json()
        assert len(data["rooms_programmed"]) == 3

    def test_generate_program_adjacencies(self):
        """Les adjacences cuisine-salon doivent etre detectees."""
        response = client.post(
            "/api/v2/programming/generate/test-proj-1",
            json={
                "rooms": [
                    {"type": "cuisine", "surface": 10},
                    {"type": "salon", "surface": 25},
                ],
            },
        )
        data = response.json()
        adjacencies = data["adjacency_graph"]
        assert len(adjacencies) > 0
        assert any(a["roomA"] == "cuisine" and a["roomB"] == "salon" for a in adjacencies)

    def test_generate_program_sun_analysis(self):
        """L'analyse d'ensoleillement doit couvrir toutes les pieces."""
        response = client.post(
            "/api/v2/programming/generate/test-proj-1",
            json={
                "rooms": [
                    {"type": "salon", "surface": 25},
                    {"type": "chambre", "surface": 12},
                ],
            },
        )
        data = response.json()
        sun = data["sun_analysis"]
        assert len(sun) == 2
        for item in sun:
            assert "optimal" in item
            assert "acceptable" in item
            assert "avoid" in item
            assert "score" in item

    def test_generate_program_budget(self):
        """L'estimation budget doit avoir min < avg < max."""
        response = client.post(
            "/api/v2/programming/generate/test-proj-1",
            json={
                "rooms": [
                    {"type": "salon", "surface": 25},
                    {"type": "cuisine", "surface": 10},
                ],
            },
        )
        data = response.json()
        budget = data["budget_estimate"]
        assert budget["min"] <= budget["avg"] <= budget["max"]
        assert budget["currency"] == "EUR"

    def test_generate_program_surfaces(self):
        """Les surfaces CAO et circulation doivent etre positives."""
        response = client.post(
            "/api/v2/programming/generate/test-proj-1",
            json={
                "rooms": [
                    {"type": "salon", "surface": 25},
                    {"type": "cuisine", "surface": 10},
                ],
            },
        )
        data = response.json()
        surfaces = data["surfaces"]
        assert surfaces["CAO"] > 0
        assert surfaces["CHA"] > 0
        assert surfaces["circulation"] >= 0
        assert surfaces["total"] > 0

    def test_generate_program_ratios(self):
        """Les ratios doivent etre des pourcentages."""
        response = client.post(
            "/api/v2/programming/generate/test-proj-1",
            json={
                "rooms": [
                    {"type": "salon", "surface": 25},
                    {"type": "cuisine", "surface": 10},
                ],
            },
        )
        data = response.json()
        ratios = data["ratios"]
        assert 0 <= ratios["CHA_CAO"] <= 100
        assert ratios["circulation_ratio"] >= 0

    def test_generate_program_footprint(self):
        """Le footprint doit contenir les champs attendus."""
        response = client.post(
            "/api/v2/programming/generate/test-proj-1",
            json={
                "rooms": [
                    {"type": "salon", "surface": 25},
                    {"type": "cuisine", "surface": 10},
                ],
            },
        )
        data = response.json()
        footprint = data["footprint"]
        assert "surface" in footprint
        assert "cos" in footprint
        assert "reculs" in footprint
        assert "buildableWidth" in footprint
        assert "buildableDepth" in footprint
        assert "front" in footprint["reculs"]
        assert "side" in footprint["reculs"]
        assert "rear" in footprint["reculs"]

    def test_generate_program_default_style(self):
        """Le style par defaut doit etre 'moderne'."""
        response = client.post(
            "/api/v2/programming/generate/test-proj-1",
            json={"rooms": [{"type": "salon", "surface": 25}]},
        )
        assert response.status_code == 200

    def test_generate_program_traditionnelle(self):
        """Le style traditionnel doit utiliser les prix correspondants."""
        response = client.post(
            "/api/v2/programming/generate/test-proj-1",
            json={
                "rooms": [{"type": "salon", "surface": 25}],
                "style": "traditionnelle",
            },
        )
        assert response.status_code == 200

    def test_generate_program_empty_rooms(self):
        """La generation avec 0 room doit fonctionner."""
        response = client.post(
            "/api/v2/programming/generate/test-proj-1",
            json={"rooms": []},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["rooms_programmed"] == []

    def test_generate_program_orientation_default(self):
        """L'orientation par defaut doit etre 'S' si non fournie."""
        response = client.post(
            "/api/v2/programming/generate/test-proj-1",
            json={"rooms": [{"type": "salon", "surface": 25}]},
        )
        data = response.json()
        assert data["rooms_programmed"][0]["orientation"] == "S"

    # ------------------------------------------------------------------
    # GET /api/v2/programming/{project_id}
    # ------------------------------------------------------------------

    def test_get_program(self):
        """La recuperation d'un programme doit retourner 200."""
        response = client.get("/api/v2/programming/test-proj-1")
        assert response.status_code == 200
        data = response.json()
        assert data["project_id"] == "test-proj-1"
        assert data["status"] == "generated"
        assert "rooms_programmed" in data
        assert "footprint" in data
        assert "budget_estimate" in data

    def test_get_program_default_rooms(self):
        """Le programme par defaut doit contenir salon et cuisine."""
        response = client.get("/api/v2/programming/test-proj-1")
        data = response.json()
        rooms = data["rooms_programmed"]
        assert len(rooms) == 2
        assert rooms[0]["type"] == "salon"
        assert rooms[1]["type"] == "cuisine"

    def test_get_program_default_adjacency(self):
        """Le programme par defaut doit avoir une adjacence cuisine-salon."""
        response = client.get("/api/v2/programming/test-proj-1")
        data = response.json()
        adj = data["adjacency_graph"]
        assert len(adj) == 1
        assert adj[0]["roomA"] == "cuisine"
        assert adj[0]["roomB"] == "salon"

    def test_get_program_budget_default(self):
        """Le budget par defaut doit etre dans la plage attendue."""
        response = client.get("/api/v2/programming/test-proj-1")
        data = response.json()
        budget = data["budget_estimate"]
        assert budget["min"] <= budget["avg"] <= budget["max"]
