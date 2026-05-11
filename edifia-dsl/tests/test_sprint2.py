"""
Tests spécifiques au Sprint 2 — Extension DSL + Nouvelles Règles.

Vérifie :
- La méthode evaluate_project_detailed avec timing
- L'isolation des problèmes bloquants
- Les reporters JSON et HTML
- Le calcul du taux de conformité (exclut N/A)
- Le chargement des 70 règles
- Les nouvelles règles urbanisme (15) et DTU (15)
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine.compliance_engine import ComplianceEngine
from engine.registry import RulesRegistry
from engine.operators import lte, gte, eq, between, in_set, logic_and, logic_or, REGISTRY
from models.project_context import ProjectContext, Parcelle, PLU, Variante, Batiment
from models.rule import RuleStatus
from reporters.json_reporter import generate_json_report
from reporters.html_reporter import generate_html_report


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def compliant_context():
    """Contexte projet conforme — nouvelles règles incluses."""
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
            surface_au_sol=200.0,
            surface_habitable=150.0,
            hauteur=8.0,
            emprise=200.0,
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
    """Registre chargé avec toutes les règles du projet."""
    rules_path = Path(__file__).resolve().parent.parent / "rules"
    registry = RulesRegistry()
    if rules_path.exists():
        registry.load_from_directory(str(rules_path))
    yield registry


# ---------------------------------------------------------------------------
# Tests de evaluate_project_detailed
# ---------------------------------------------------------------------------

class TestEvaluateProjectDetailed:
    """Tests de la méthode evaluate_project_detailed."""

    def test_evaluate_project_detailed_timing(self, loaded_registry, compliant_context):
        """Le rapport détaillé doit contenir un temps d'évaluation > 0."""
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project_detailed(compliant_context)

        assert report.summary.evaluation_time_ms > 0.0
        assert report.summary.evaluation_time_ms < 5000.0  # < 5s
        assert report.summary.total_rules > 0

    def test_blocking_issues_isolated(self, loaded_registry, compliant_context):
        """Les problèmes bloquants doivent être correctement filtrés."""
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project_detailed(compliant_context)

        blocking = engine.get_blocking_issues_from_report(report)
        assert isinstance(blocking, list)
        # Pour un projet conforme, aucune règle bloquante ne devrait échouer
        for issue in blocking:
            assert "rule_code" in issue
            assert "message" in issue

    def test_compliance_rate_calculation(self, loaded_registry, compliant_context):
        """Le taux de conformité doit exclure les règles N/A."""
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project_detailed(compliant_context)

        s = report.summary
        applicable = s.total_rules - s.not_applicable
        if applicable > 0:
            expected_rate = round(s.passed / applicable * 100, 1)
            assert s.compliance_rate == pytest.approx(expected_rate, abs=0.1)
        assert 0.0 <= s.compliance_rate <= 100.0


# ---------------------------------------------------------------------------
# Tests des reporters
# ---------------------------------------------------------------------------

class TestJsonReporter:
    """Tests du générateur de rapport JSON."""

    def test_json_report_structure(self, loaded_registry, compliant_context):
        """Le rapport JSON doit avoir la structure attendue."""
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project_detailed(compliant_context)

        json_report = generate_json_report(report)

        assert "project_id" in json_report
        assert "evaluated_at" in json_report
        assert "summary" in json_report
        assert "results" in json_report
        assert "blocking_issues" in json_report

        summary = json_report["summary"]
        assert "total_rules" in summary
        assert "passed" in summary
        assert "failed" in summary
        assert "warnings" in summary
        assert "not_applicable" in summary
        assert "compliance_rate" in summary
        assert "evaluation_time_ms" in summary
        assert "blocking_count" in summary

        assert isinstance(json_report["results"], list)
        assert isinstance(json_report["blocking_issues"], list)


class TestHtmlReporter:
    """Tests du générateur de rapport HTML."""

    def test_html_report_contains_score(self, loaded_registry, compliant_context):
        """Le rapport HTML doit contenir le score de conformité."""
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project_detailed(compliant_context)

        html_report = generate_html_report(report)

        assert "<html" in html_report
        assert "</html>" in html_report
        assert str(report.summary.compliance_rate) in html_report
        assert "Taux de conformit" in html_report
        assert "Rapport de conformit" in html_report

    def test_html_report_contains_table(self, loaded_registry, compliant_context):
        """Le rapport HTML doit contenir une table de résultats."""
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project_detailed(compliant_context)

        html_report = generate_html_report(report)

        assert "<table>" in html_report
        assert "</table>" in html_report

    def test_html_report_contains_blocking_section(self, loaded_registry, compliant_context):
        """Le rapport HTML doit contenir une section problèmes bloquants."""
        engine = ComplianceEngine(loaded_registry)
        report = engine.evaluate_project_detailed(compliant_context)

        html_report = generate_html_report(report)

        assert "bloquant" in html_report.lower() or "blocking" in html_report.lower()


# ---------------------------------------------------------------------------
# Tests de comptage de règles
# ---------------------------------------------------------------------------

class TestRulesCount:
    """Vérification du nombre total de règles chargées."""

    def test_70_rules_loaded(self, loaded_registry):
        """Le registre doit contenir exactement 70 règles."""
        assert loaded_registry.count() == 70

    def test_new_urbanisme_rules(self, loaded_registry):
        """Il doit y avoir exactement 15 règles urbanisme."""
        urbanisme_rules = loaded_registry.get_by_category("urbanisme")
        assert len(urbanisme_rules) == 15

    def test_new_dtu_rules(self, loaded_registry):
        """Il doit y avoir exactement 15 règles DTU."""
        dtu_rules = loaded_registry.get_by_category("dtu")
        assert len(dtu_rules) == 15

    def test_re2020_rules_count(self, loaded_registry):
        """Il doit y avoir exactement 15 règles RE2020."""
        re2020_rules = loaded_registry.get_by_category("re2020")
        assert len(re2020_rules) == 15

    def test_incendie_rules_count(self, loaded_registry):
        """Il doit y avoir exactement 15 règles incendie."""
        incendie_rules = loaded_registry.get_by_category("incendie")
        assert len(incendie_rules) == 15

    def test_pmr_rules_count(self, loaded_registry):
        """Il doit y avoir exactement 10 règles PMR."""
        pmr_rules = loaded_registry.get_by_category("pmr")
        assert len(pmr_rules) == 10

    def test_codes_are_unique(self, loaded_registry):
        """Tous les codes de règles doivent être uniques."""
        codes = loaded_registry.list_codes()
        assert len(codes) == len(set(codes))
        assert len(codes) == 70


# ---------------------------------------------------------------------------
# Tests des nouvelles règles spécifiques
# ---------------------------------------------------------------------------

class TestNewUrbanismeRules:
    """Tests des 5 nouvelles règles urbanisme avancées."""

    def test_urb_align_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("URB-ALIGN-001")
        assert rule.category == "urbanisme"
        assert rule.severity == "major"

    def test_urb_esp_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("URB-ESP-001")
        assert rule.category == "urbanisme"

    def test_urb_park_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("URB-PARK-001")
        assert rule.category == "urbanisme"

    def test_urb_vue_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("URB-VUE-001")
        assert rule.category == "urbanisme"
        assert rule.severity == "blocking"

    def test_urb_bruit_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("URB-BRUIT-001")
        assert rule.category == "urbanisme"


class TestNewDtuRules:
    """Tests des 5 nouvelles règles DTU spécifiques."""

    def test_dtu_vent_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("DTU-VENT-001")
        assert rule.category == "dtu"
        assert rule.severity == "blocking"

    def test_dtu_elec_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("DTU-ELEC-001")
        assert rule.category == "dtu"

    def test_dtu_asc_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("DTU-ASC-001")
        assert rule.category == "dtu"
        assert rule.severity == "blocking"

    def test_dtu_ecran_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("DTU-ECRAN-001")
        assert rule.category == "dtu"

    def test_dtu_radon_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("DTU-RADON-001")
        assert rule.category == "dtu"
        assert rule.severity == "blocking"


class TestNewRe2020Rules:
    """Tests des 5 nouvelles règles RE2020 approfondies."""

    def test_re2020_att_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("RE2020-ATT-001")
        assert rule.category == "re2020"

    def test_re2020_bio_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("RE2020-BIO-001")
        assert rule.category == "re2020"

    def test_re2020_recup_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("RE2020-RECUP-001")
        assert rule.category == "re2020"

    def test_re2020_pv_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("RE2020-PV-001")
        assert rule.category == "re2020"

    def test_re2020_qai_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("RE2020-QAI-001")
        assert rule.category == "re2020"


class TestNewIncendieRules:
    """Tests des 5 nouvelles règles incendie ERP."""

    def test_inc_erp_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("INC-ERP-001")
        assert rule.category == "incendie"
        assert rule.severity == "blocking"

    def test_inc_gaz_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("INC-GAZ-001")
        assert rule.category == "incendie"

    def test_inc_asc_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("INC-ASC-001")
        assert rule.category == "incendie"

    def test_inc_para_001_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("INC-PARA-001")
        assert rule.category == "incendie"

    def test_inc_asc_002_exists(self, loaded_registry):
        rule = loaded_registry.get_by_code("INC-ASC-002")
        assert rule.category == "incendie"
