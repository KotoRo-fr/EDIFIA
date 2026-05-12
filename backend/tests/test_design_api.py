"""Tests d'integration pour l'API de conception generative."""

import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "app"))
from main import app

client = TestClient(app)


class TestDesignAPI:
    """Tests des endpoints de conception generative."""

    # ------------------------------------------------------------------
    # POST /api/v2/design/generate/{project_id}
    # ------------------------------------------------------------------

    def test_generate_variants(self):
        """La generation doit retourner des variantes."""
        response = client.post(
            "/api/v2/design/generate/test-proj-1",
            json={"strategy_count": 4},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["project_id"] == "test-proj-1"
        assert "variants" in data
        assert "total" in data
        assert data["total"] == 4
        assert len(data["variants"]) == 4

    def test_generate_variants_count_2(self):
        """La generation avec strategy_count=2 doit retourner 2 variantes."""
        response = client.post(
            "/api/v2/design/generate/test-proj-1",
            json={"strategy_count": 2},
        )
        data = response.json()
        assert data["total"] == 2
        assert len(data["variants"]) == 2

    def test_generate_variants_max_4(self):
        """La generation ne doit pas depasser 4 variantes."""
        response = client.post(
            "/api/v2/design/generate/test-proj-1",
            json={"strategy_count": 10},
        )
        data = response.json()
        assert data["total"] <= 4
        assert len(data["variants"]) <= 4

    def test_generate_variants_structure(self):
        """Chaque variante doit avoir la structure attendue."""
        response = client.post(
            "/api/v2/design/generate/test-proj-1",
            json={"strategy_count": 4},
        )
        data = response.json()
        for variant in data["variants"]:
            assert "id" in variant
            assert "name" in variant
            assert "strategy" in variant
            assert "description" in variant
            assert "label" in variant
            assert "scores" in variant
            assert "conformityScore" in variant
            assert "is_selected" in variant
            assert "floor_plan" in variant
            assert variant["is_selected"] is False

    def test_generate_variants_scores(self):
        """Les scores doivent etre entre 0 et 100."""
        response = client.post(
            "/api/v2/design/generate/test-proj-1",
            json={"strategy_count": 4},
        )
        data = response.json()
        for variant in data["variants"]:
            scores = variant["scores"]
            assert 0 <= scores["surface"] <= 100
            assert 0 <= scores["sunExposure"] <= 100
            assert 0 <= scores["costEfficiency"] <= 100
            assert 0 <= scores["aesthetics"] <= 100
            assert 0 <= scores["overall"] <= 100

    def test_generate_variants_conformity(self):
        """Le conformityScore doit etre entre 65 et 95."""
        response = client.post(
            "/api/v2/design/generate/test-proj-1",
            json={"strategy_count": 4},
        )
        data = response.json()
        for variant in data["variants"]:
            assert 65 <= variant["conformityScore"] <= 95

    def test_generate_variants_floor_plan(self):
        """Chaque variante doit avoir un floor_plan avec des rooms."""
        response = client.post(
            "/api/v2/design/generate/test-proj-1",
            json={"strategy_count": 1},
        )
        data = response.json()
        floor_plan = data["variants"][0]["floor_plan"]
        assert "rooms" in floor_plan
        assert "walls" in floor_plan
        assert "doors" in floor_plan
        assert len(floor_plan["rooms"]) > 0

    def test_generate_variants_floor_plan_room_fields(self):
        """Chaque room du floor_plan doit avoir les champs requis."""
        response = client.post(
            "/api/v2/design/generate/test-proj-1",
            json={"strategy_count": 1},
        )
        data = response.json()
        room = data["variants"][0]["floor_plan"]["rooms"][0]
        assert "id" in room
        assert "name" in room
        assert "type" in room
        assert "surface" in room
        assert "x" in room
        assert "y" in room
        assert "width" in room
        assert "height" in room

    def test_generate_variants_id_prefix(self):
        """L'ID de variante doit commencer par le project_id."""
        response = client.post(
            "/api/v2/design/generate/test-proj-1",
            json={"strategy_count": 4},
        )
        data = response.json()
        for variant in data["variants"]:
            assert variant["id"].startswith("test-proj-1-")

    def test_generate_variants_strategies(self):
        """Les strategies doivent etre distinctes."""
        response = client.post(
            "/api/v2/design/generate/test-proj-1",
            json={"strategy_count": 4},
        )
        data = response.json()
        strategies = [v["strategy"] for v in data["variants"]]
        assert len(strategies) == len(set(strategies))

    def test_generate_variants_default_count(self):
        """Le nombre par defaut de variantes doit etre 4."""
        response = client.post(
            "/api/v2/design/generate/test-proj-1",
            json={},
        )
        data = response.json()
        assert data["total"] == 4

    # ------------------------------------------------------------------
    # GET /api/v2/design/{project_id}
    # ------------------------------------------------------------------

    def test_list_variants(self):
        """La liste des variantes doit retourner une structure vide par defaut."""
        response = client.get("/api/v2/design/test-proj-1")
        assert response.status_code == 200
        data = response.json()
        assert data["project_id"] == "test-proj-1"
        assert "variants" in data
        assert "total" in data
        assert data["total"] == 0
        assert data["variants"] == []

    # ------------------------------------------------------------------
    # POST /api/v2/design/select/{project_id}/{variant_id}
    # ------------------------------------------------------------------

    def test_select_variant(self):
        """La selection d'une variante doit retourner selected=True."""
        response = client.post("/api/v2/design/select/test-proj-1/variant-A")
        assert response.status_code == 200
        data = response.json()
        assert data["project_id"] == "test-proj-1"
        assert data["variant_id"] == "variant-A"
        assert data["selected"] is True

    def test_select_different_variants(self):
        """La selection de variantes differentes doit fonctionner."""
        for v_id in ["v1", "v2", "v3"]:
            response = client.post(f"/api/v2/design/select/test-proj-1/{v_id}")
            assert response.status_code == 200
            assert response.json()["variant_id"] == v_id
            assert response.json()["selected"] is True
