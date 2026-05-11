"""Tests d'integration pour l'API de conformite."""

import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "app"))
from main import app

client = TestClient(app)


class TestComplianceAPI:
    """Tests des endpoints de conformite."""

    def test_health_check(self):
        """Le health check doit retourner 200 avec status ok."""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"

    def test_evaluate_project(self):
        """L'evaluation d'un projet doit retourner un rapport complet."""
        response = client.post("/api/v2/compliance/evaluate/test-proj-1", json={"variant_id": None})
        assert response.status_code == 200
        data = response.json()
        assert "summary" in data
        assert "results" in data
        assert "blocking_issues" in data
        assert isinstance(data["results"], list)
        assert len(data["results"]) > 0

    def test_evaluate_returns_summary(self):
        """Le resume doit contenir les champs attendus."""
        response = client.post("/api/v2/compliance/evaluate/test-proj-1", json={})
        data = response.json()
        summary = data["summary"]
        assert "total_rules" in summary
        assert "passed" in summary
        assert "failed" in summary
        assert "compliance_rate" in summary

    def test_evaluate_compliance_rate_bounds(self):
        """Le taux de conformite doit etre entre 0 et 100."""
        response = client.post("/api/v2/compliance/evaluate/test-proj-1", json={})
        data = response.json()
        rate = data["summary"]["compliance_rate"]
        assert 0.0 <= rate <= 100.0

    def test_evaluate_results_have_required_fields(self):
        """Chaque resultat doit avoir les champs requis."""
        response = client.post("/api/v2/compliance/evaluate/test-proj-1", json={})
        data = response.json()
        for result in data["results"]:
            assert "rule_code" in result
            assert "rule_name" in result
            assert "category" in result
            assert "status" in result
            assert "message" in result
            assert result["status"] in ("pass", "fail", "warning", "not_applicable")

    def test_get_report_existing(self):
        """Le rapport d'un projet existant doit retourner 200."""
        response = client.get("/api/v2/compliance/report/test-proj-1")
        assert response.status_code == 200
        data = response.json()
        assert "summary" in data
        assert "results" in data

    def test_get_report_not_found(self):
        """Un rapport inexistant doit retourner 404."""
        response = client.get("/api/v2/compliance/report/nonexistent")
        assert response.status_code == 404

    def test_list_rules(self):
        """La liste des regles doit etre paginee."""
        response = client.get("/api/v2/compliance/rules")
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "rules" in data
        assert isinstance(data["rules"], list)
        assert "page" in data
        assert "limit" in data

    def test_list_rules_default_pagination(self):
        """Par defaut, la pagination doit etre page=1."""
        response = client.get("/api/v2/compliance/rules")
        data = response.json()
        assert data["page"] == 1
        assert data["limit"] == 50

    def test_list_rules_total_count(self):
        """Le total doit etre 50 regles."""
        response = client.get("/api/v2/compliance/rules")
        data = response.json()
        assert data["total"] == 50

    def test_list_rules_with_category_filter(self):
        """Le filtre par categorie doit fonctionner."""
        response = client.get("/api/v2/compliance/rules?category=urbanisme")
        assert response.status_code == 200
        data = response.json()
        for rule in data["rules"]:
            assert rule["category"] == "urbanisme"

    def test_list_rules_with_limit(self):
        """Le parametre limit doit limiter les resultats."""
        response = client.get("/api/v2/compliance/rules?limit=5")
        data = response.json()
        assert len(data["rules"]) == 5

    def test_list_rules_with_pagination(self):
        """La pagination doit fonctionner correctement."""
        resp1 = client.get("/api/v2/compliance/rules?page=1&limit=10")
        resp2 = client.get("/api/v2/compliance/rules?page=2&limit=10")
        data1 = resp1.json()
        data2 = resp2.json()
        # Les regles de la page 2 doivent etre differentes de la page 1
        codes1 = {r["code"] for r in data1["rules"]}
        codes2 = {r["code"] for r in data2["rules"]}
        assert not codes1.intersection(codes2)

    def test_list_rules_unknown_category_returns_empty(self):
        """Une categorie inconnue doit retourner une liste vide."""
        response = client.get("/api/v2/compliance/rules?category=unknown")
        data = response.json()
        assert data["total"] == 0
        assert len(data["rules"]) == 0

    def test_get_rule_detail(self):
        """Le detail d'une regle doit contenir tous les champs."""
        # First list rules to get a code
        response = client.get("/api/v2/compliance/rules?limit=1")
        rules = response.json()["rules"]
        if rules:
            code = rules[0]["code"]
            detail = client.get(f"/api/v2/compliance/rules/{code}")
            assert detail.status_code == 200
            json_data = detail.json()
            assert json_data["code"] == code
            assert "name" in json_data
            assert "category" in json_data
            assert "description" in json_data
            assert "severity" in json_data
            assert "applicable_zones" in json_data
            assert "parameters" in json_data

    def test_get_rule_not_found(self):
        """Une regle inexistante doit retourner 404."""
        response = client.get("/api/v2/compliance/rules/NONEXISTENT")
        assert response.status_code == 404

    def test_evaluate_with_variant(self):
        """L'evaluation avec un variant_id doit etre acceptee."""
        response = client.post(
            "/api/v2/compliance/evaluate/test-proj-1",
            json={"variant_id": "variant-123"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["variant_id"] == "variant-123"

    def test_evaluate_empty_body(self):
        """L'evaluation avec un body vide doit fonctionner."""
        response = client.post("/api/v2/compliance/evaluate/test-proj-1", json={})
        assert response.status_code == 200

    def test_blocking_issues_only_fail(self):
        """Les blocking_issues ne doivent contenir que des echecs."""
        response = client.post("/api/v2/compliance/evaluate/test-proj-1", json={})
        data = response.json()
        for issue in data["blocking_issues"]:
            assert issue["severity"] == "blocking"

    def test_rules_categories_distinct(self):
        """Les regles doivent couvrir plusieurs categories."""
        response = client.get("/api/v2/compliance/rules")
        data = response.json()
        categories = {r["category"] for r in data["rules"]}
        assert len(categories) >= 3  # Au moins 3 categories differentes
