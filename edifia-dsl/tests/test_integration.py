"""
Tests d'intégration du DSL Réglementaire EDIFIA.

Vérifie les flux complets : parsing → registre → moteur → rapport,
avec les vraies règles du projet.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine.compliance_engine import ComplianceEngine
from engine.registry import RulesRegistry
from models.project_context import ProjectContext, Parcelle, PLU, Variante, Batiment
from models.rule import RuleStatus


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def project_context_compliant():
    """Projet entièrement conforme aux règles urbanisme."""
    return ProjectContext(
        parcelle=Parcelle(
            surface=500.0,
            zone="U",
            cos_max=0.5,
            height_max=12.0,
            setbacks={"front": 5.0, "rear": 5.0, "side": 3.0},
        ),
        plu=PLU(
            zone="U",
            cos_max=0.5,
            height_max=12.0,
            setbacks={"front": 3.0, "rear": 3.0, "side": 2.0},
        ),
        variante=Variante(
            surface_au_sol=200.0,   # 200 <= 0.5 * 500 = 250 ✓
            surface_habitable=150.0,
            hauteur=8.0,            # 8 <= 12 ✓
            emprise=200.0,          # 200 <= 500 ✓
            niveaux=2,
        ),
        batiment=Batiment(
            type="maison_individuelle",
            materiaux="brique",
            niveaux=2,
        ),
        project_type="new_build",
        commune_code="74010",
    )


@pytest.fixture
def project_context_non_compliant():
    """Projet non conforme (COS et hauteur dépassés)."""
    return ProjectContext(
        parcelle=Parcelle(
            surface=500.0,
            zone="U",
            cos_max=0.5,
            height_max=12.0,
            setbacks={"front": 5.0, "rear": 5.0, "side": 3.0},
        ),
        plu=PLU(
            zone="U",
            cos_max=0.5,
            height_max=12.0,
            setbacks={"front": 3.0, "rear": 3.0, "side": 2.0},
        ),
        variante=Variante(
            surface_au_sol=400.0,   # 400 > 250 ✗
            surface_habitable=150.0,
            hauteur=15.0,           # 15 > 12 ✗
            emprise=400.0,
            niveaux=2,
        ),
        batiment=Batiment(
            type="maison_individuelle",
            materiaux="brique",
            niveaux=2,
        ),
        project_type="new_build",
        commune_code="74010",
    )


@pytest.fixture
def loaded_registry():
    """Registre chargé avec les vraies règles du projet."""
    rules_path = Path(__file__).resolve().parent.parent / "rules"
    registry = RulesRegistry()
    if rules_path.exists():
        registry.load_from_directory(str(rules_path))
    yield registry


# ---------------------------------------------------------------------------
# Tests d'intégration
# ---------------------------------------------------------------------------

class TestFullEvaluationFlow:
    """Flux complet : parsing → registre → engine → rapport."""

    def test_full_evaluation_compliant(self, loaded_registry, project_context_compliant):
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project(project_context_compliant)

        assert report.project_id == "74010"
        assert report.evaluated_at != ""
        assert report.summary.total_rules > 0
        assert report.summary.compliance_rate > 0.0

        # Vérifier que chaque résultat a les champs requis
        for result in report.results:
            assert result.rule_code != ""
            assert result.status in (
                RuleStatus.PASS,
                RuleStatus.FAIL,
                RuleStatus.WARNING,
                RuleStatus.NOT_APPLICABLE,
            )
            assert result.evaluated_at != ""

    def test_full_evaluation_non_compliant(self, loaded_registry, project_context_non_compliant):
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project(project_context_non_compliant)

        assert report.summary.total_rules > 0
        assert report.summary.failed > 0
        # Taux de conformité < 100% car il y a des échecs
        assert report.summary.compliance_rate < 1.0

    def test_report_structure(self, loaded_registry, project_context_compliant):
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project(project_context_compliant)

        dict_report = report.to_dict()
        assert "project_id" in dict_report
        assert "evaluated_at" in dict_report
        assert "summary" in dict_report
        assert "results" in dict_report
        assert "total_rules" in dict_report["summary"]
        assert "passed" in dict_report["summary"]
        assert "failed" in dict_report["summary"]
        assert "compliance_rate" in dict_report["summary"]


class TestUrbanismeRules:
    """Évaluation spécifique des règles d'urbanisme."""

    def test_urbanisme_rules_evaluated(self, loaded_registry, project_context_compliant):
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project(project_context_compliant)

        # Chercher les résultats des règles urbanisme
        urbanisme_results = [
            r for r in report.results if r.rule_code.startswith("URB-")
        ]
        assert len(urbanisme_results) > 0

        # Pour un projet conforme, les règles urbanisme devraient passer
        for result in urbanisme_results:
            assert result.status in (RuleStatus.PASS, RuleStatus.NOT_APPLICABLE)

    def test_cos_rule(self, loaded_registry, project_context_compliant):
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project(project_context_compliant)

        cos_result = [r for r in report.results if r.rule_code == "URB-COS-001"]
        if cos_result:
            assert cos_result[0].status == RuleStatus.PASS

    def test_ht_rule(self, loaded_registry, project_context_compliant):
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project(project_context_compliant)

        ht_result = [r for r in report.results if r.rule_code == "URB-HT-001"]
        if ht_result:
            assert ht_result[0].status == RuleStatus.PASS


class TestComplianceRate:
    """Vérification du calcul du taux de conformité."""

    def test_compliance_rate_perfect(self, loaded_registry, project_context_compliant):
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project(project_context_compliant)

        applicable = report.summary.total_rules - report.summary.not_applicable
        if applicable > 0:
            expected_rate = report.summary.passed / applicable
            assert report.summary.compliance_rate == pytest.approx(expected_rate)

    def test_compliance_rate_zero(self, loaded_registry, project_context_non_compliant):
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project(project_context_non_compliant)

        # S'il y a des échecs et 0 passes, le taux est 0
        if report.summary.passed == 0 and report.summary.failed > 0:
            assert report.summary.compliance_rate == 0.0

    def test_compliance_rate_bounds(self, loaded_registry, project_context_compliant):
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project(project_context_compliant)

        # Le taux doit être entre 0 et 1
        assert 0.0 <= report.summary.compliance_rate <= 1.0

    def test_summary_consistency(self, loaded_registry, project_context_compliant):
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project(project_context_compliant)

        s = report.summary
        # La somme doit être cohérente
        assert s.total_rules == s.passed + s.failed + s.warnings + s.not_applicable
