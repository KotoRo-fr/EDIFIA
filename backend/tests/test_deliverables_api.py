"""Tests pour l'API de livrables."""
import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "app"))
from main import app

client = TestClient(app)


class TestDeliverablesAPI:
    """Tests des endpoints livrables."""

    def test_list_deliverables(self):
        """La liste des livrables doit retourner 5 documents."""
        response = client.get("/api/v2/deliverables/test-proj")
        assert response.status_code == 200
        data = response.json()
        assert "project_id" in data
        assert "documents" in data
        assert len(data["documents"]) == 5
        assert data["total_count"] == 5
        assert data["generated_count"] == 5

    def test_list_deliverables_document_types(self):
        """Les 5 types de documents doivent etre presents."""
        response = client.get("/api/v2/deliverables/test-proj")
        data = response.json()
        types = [d["type"] for d in data["documents"]]
        assert "cerfa" in types
        assert "notice" in types
        assert "rapport" in types
        assert "plans" in types
        assert "pack" in types

    def test_generate_all(self):
        """La generation doit retourner le statut et 5 documents."""
        response = client.post("/api/v2/deliverables/generate/test-proj")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "generating"
        assert len(data["documents"]) == 5
        for doc in data["documents"]:
            assert doc["status"] == "generated"

    def test_get_cerfa(self):
        """Le CERFA doit contenir les champs attendus."""
        response = client.get("/api/v2/deliverables/test-proj/cerfa")
        assert response.status_code == 200
        data = response.json()
        assert data["form"] == "CERFA 13406*05"
        assert "identity" in data
        assert "parcelle" in data
        assert "projet" in data
        assert "description_travaux" in data

    def test_get_cerfa_identity(self):
        """L'identite doit contenir maitre d'oeuvre et SIRET."""
        response = client.get("/api/v2/deliverables/test-proj/cerfa")
        data = response.json()
        identity = data["identity"]
        assert "maitre_oeuvre" in identity
        assert "numero_siret" in identity

    def test_get_notice(self):
        """La notice doit contenir les sections attendues."""
        response = client.get("/api/v2/deliverables/test-proj/notice")
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        assert "structure" in data
        assert "thermique" in data
        assert "pmr" in data
        assert "incendie" in data

    def test_get_notice_structure(self):
        """La section structure doit contenir portee et conclusion."""
        response = client.get("/api/v2/deliverables/test-proj/notice")
        data = response.json()
        struct = data["structure"]
        assert "portee_max" in struct
        assert "conclusion" in struct

    def test_get_rapport(self):
        """Le rapport doit contenir les champs attendus."""
        response = client.get("/api/v2/deliverables/test-proj/rapport")
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        assert "executive_summary" in data
        assert "results_by_category" in data
        assert "conclusion" in data

    def test_get_rapport_summary(self):
        """Le resume executif doit contenir les metriques."""
        response = client.get("/api/v2/deliverables/test-proj/rapport")
        data = response.json()
        summary = data["executive_summary"]
        assert "total_rules" in summary
        assert "passed" in summary
        assert "compliance_rate" in summary

    def test_get_plans(self):
        """Les plans doivent contenir 5 plans et les metadonnees."""
        response = client.get("/api/v2/deliverables/test-proj/plans")
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        assert "plans" in data
        assert len(data["plans"]) == 5
        assert "legend" in data
        assert "dimensions" in data

    def test_get_plans_has_required_types(self):
        """Les plans doivent inclure les types obligatoires."""
        response = client.get("/api/v2/deliverables/test-proj/plans")
        data = response.json()
        plan_types = [p["type"] for p in data["plans"]]
        assert "Situation" in plan_types
        assert "Masse" in plan_types
        assert "RDC" in plan_types
        assert "Etage" in plan_types
        assert "Coupe" in plan_types

    def test_get_plans_dimensions(self):
        """Les dimensions doivent avoir un format et une unite."""
        response = client.get("/api/v2/deliverables/test-proj/plans")
        data = response.json()
        dims = data["dimensions"]
        assert "format" in dims
        assert "unite" in dims

    def test_documents_have_required_fields(self):
        """Chaque document de la liste doit avoir les champs requis."""
        response = client.get("/api/v2/deliverables/test-proj")
        data = response.json()
        for doc in data["documents"]:
            assert "type" in doc
            assert "name" in doc
            assert "status" in doc
            assert "generated_at" in doc

    def test_cerfa_parcelle_fields(self):
        """La parcelle CERFA doit contenir adresse et surface."""
        response = client.get("/api/v2/deliverables/test-proj/cerfa")
        data = response.json()
        parcelle = data["parcelle"]
        assert "adresse" in parcelle
        assert "section" in parcelle
        assert "numero" in parcelle
        assert "surface" in parcelle

    def test_notice_thermique_conclusion(self):
        """La section thermique doit avoir une conclusion."""
        response = client.get("/api/v2/deliverables/test-proj/notice")
        data = response.json()
        assert "conclusion" in data["thermique"]

    def test_rapport_categories_match_total(self):
        """Le total des regles par categorie doit correspondre au resume."""
        response = client.get("/api/v2/deliverables/test-proj/rapport")
        data = response.json()
        summary = data["executive_summary"]
        categories = data["results_by_category"]
        total_by_cat = sum(c["total"] for c in categories)
        assert total_by_cat == summary["total_rules"]

    def test_generate_different_project(self):
        """La generation pour un autre projet doit fonctionner."""
        response = client.post("/api/v2/deliverables/generate/autre-proj-456")
        assert response.status_code == 200
        data = response.json()
        assert data["project_id"] == "autre-proj-456"
        assert data["status"] == "generating"
