"""
Tests unitaires du moteur d'évaluation.

Vérifie les opérateurs, le résolveur de références et l'applicabilité des règles.
"""

from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

import pytest
import yaml

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine.operators import lte, gte, eq, between, in_set, logic_and, logic_or, REGISTRY
from engine.resolver import resolve_reference
from engine.compliance_engine import ComplianceEngine
from engine.registry import RulesRegistry
from models.project_context import ProjectContext, Parcelle, PLU, Variante, Batiment
from models.rule import Rule, RuleInput, Formula, Applicability, Source, RuleStatus


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def compliant_context():
    """Contexte projet conforme — toutes les règles doivent passer."""
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
def non_compliant_context():
    """Contexte projet non conforme — certaines règles doivent échouer."""
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
            surface_au_sol=400.0,  # Dépasse COS (0.5 * 500 = 250)
            surface_habitable=150.0,
            hauteur=15.0,  # Dépasse hauteur max (12m)
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
def temp_rules_dir():
    """Répertoire temporaire avec quelques règles pour les tests."""
    with tempfile.TemporaryDirectory() as tmpdir:
        # Règle URB-COS-001 : surface_au_sol <= cos_max * surface_parcelle
        rule_cos = {
            "rule": {
                "code": "URB-COS-001",
                "name": "COS max",
                "description": "Vérifie le COS",
                "category": "urbanisme",
                "severity": "blocking",
                "applicability": {
                    "project_types": ["new_build"],
                    "zones": ["U"],
                },
                "formula": {
                    "type": "comparison",
                    "input": [
                        {"name": "surface_au_sol", "source": "variante.surface_au_sol"},
                        {"name": "cos_max", "source": "plu.cos_max"},
                        {"name": "surface_parcelle", "source": "parcelle.surface"},
                    ],
                    "operation": "lte",
                    "expression": "surface_au_sol <= cos_max * surface_parcelle",
                },
                "error_message": {"fr": "COS dépassé: {surface_au_sol} > {cos_max} * {surface_parcelle}"},
                "source": {"document": "PLU", "article": "Art 3"},
            }
        }
        # Règle URB-HT-001 : hauteur <= height_max
        rule_ht = {
            "rule": {
                "code": "URB-HT-001",
                "name": "Hauteur max",
                "description": "Vérifie la hauteur",
                "category": "urbanisme",
                "severity": "blocking",
                "applicability": {
                    "project_types": ["new_build"],
                    "zones": ["U"],
                },
                "formula": {
                    "type": "comparison",
                    "input": [
                        {"name": "hauteur", "source": "variante.hauteur"},
                        {"name": "height_max", "source": "plu.height_max"},
                    ],
                    "operation": "lte",
                    "expression": "hauteur <= height_max",
                },
                "error_message": {"fr": "Hauteur dépassée: {hauteur} > {height_max}"},
                "source": {"document": "PLU", "article": "Art 4"},
            }
        }
        for rule_data, name in [(rule_cos, "cos.yml"), (rule_ht, "ht.yml")]:
            filepath = Path(tmpdir) / name
            with open(filepath, "w", encoding="utf-8") as fh:
                yaml.dump(rule_data, fh, allow_unicode=True, sort_keys=False)
        yield tmpdir


# ---------------------------------------------------------------------------
# Tests des opérateurs
# ---------------------------------------------------------------------------

class TestOperators:
    """Tests des fonctions pures du module operators."""

    def test_lte_true(self):
        assert lte(5.0, 10.0) is True

    def test_lte_equal(self):
        assert lte(5.0, 5.0) is True

    def test_lte_false(self):
        assert lte(15.0, 10.0) is False

    def test_gte_true(self):
        assert gte(10.0, 5.0) is True

    def test_gte_false(self):
        assert gte(3.0, 5.0) is False

    def test_eq(self):
        assert eq("U", "U") is True
        assert eq("U", "AU") is False

    def test_between(self):
        assert between(5.0, 0.0, 10.0) is True
        assert between(0.0, 0.0, 10.0) is True
        assert between(10.0, 0.0, 10.0) is True
        assert between(-1.0, 0.0, 10.0) is False

    def test_in_set(self):
        assert in_set("U", ["U", "AU"]) is True
        assert in_set("A", ["U", "AU"]) is False

    def test_logic_and(self):
        assert logic_and([True, True, True]) is True
        assert logic_and([True, False, True]) is False
        assert logic_and([]) is True  # neutre

    def test_logic_or(self):
        assert logic_or([False, False, True]) is True
        assert logic_or([False, False]) is False
        assert logic_or([]) is False  # neutre

    def test_registry_completeness(self):
        """Le REGISTRY doit contenir tous les opérateurs."""
        expected = {"lte", "gte", "eq", "between", "in", "and", "or"}
        assert set(REGISTRY.keys()) == expected


# ---------------------------------------------------------------------------
# Tests du resolver
# ---------------------------------------------------------------------------

class TestResolver:
    """Tests de resolve_reference."""

    def test_resolve_variante_surface(self, compliant_context):
        val = resolve_reference("variante.surface_au_sol", compliant_context)
        assert val == 200.0

    def test_resolve_plu_cos_max(self, compliant_context):
        val = resolve_reference("plu.cos_max", compliant_context)
        assert val == 0.5

    def test_resolve_parcelle_zone(self, compliant_context):
        val = resolve_reference("parcelle.zone", compliant_context)
        assert val == "U"

    def test_resolve_invalid_ref(self, compliant_context):
        with pytest.raises(ValueError) as exc_info:
            resolve_reference("inexistant.champ", compliant_context)
        assert "inconnue" in str(exc_info.value)

    def test_resolve_malformed_ref(self, compliant_context):
        with pytest.raises(ValueError):
            resolve_reference("variante", compliant_context)


# ---------------------------------------------------------------------------
# Tests du ComplianceEngine
# ---------------------------------------------------------------------------

class TestComplianceEngine:
    """Tests de ComplianceEngine."""

    def test_evaluate_pass(self, compliant_context, temp_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(temp_rules_dir)
        engine = ComplianceEngine(registry)

        report = engine.evaluate_project(compliant_context)

        assert report.summary.total_rules == 2
        assert report.summary.passed == 2
        assert report.summary.failed == 0
        assert report.summary.compliance_rate == 1.0

    def test_evaluate_fail(self, non_compliant_context, temp_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(temp_rules_dir)
        engine = ComplianceEngine(registry)

        report = engine.evaluate_project(non_compliant_context)

        assert report.summary.total_rules == 2
        assert report.summary.failed == 2
        assert report.summary.passed == 0
        assert report.summary.compliance_rate == 0.0

    def test_is_applicable(self, compliant_context, temp_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(temp_rules_dir)
        engine = ComplianceEngine(registry)

        rule_cos = registry.get_by_code("URB-COS-001")
        assert engine._is_applicable(rule_cos, compliant_context) is True

        # Contexte avec zone non applicable
        from copy import deepcopy
        bad_context = deepcopy(compliant_context)
        bad_context.plu.zone = "N"  # Zone non constructible
        assert engine._is_applicable(rule_cos, bad_context) is False

    def test_not_applicable_project_type(self, compliant_context, temp_rules_dir):
        """Une règle pour 'new_build' ne s'applique pas à 'mob_under_150'."""
        registry = RulesRegistry()
        registry.load_from_directory(temp_rules_dir)
        engine = ComplianceEngine(registry)

        from copy import deepcopy
        mob_context = deepcopy(compliant_context)
        mob_context.project_type = "mob_under_150"

        report = engine.evaluate_project(mob_context)
        # Les règles du temp dir ne sont pas applicables à mob_under_150
        # car elles ont project_types: ["new_build"]
        assert report.summary.not_applicable == 2

    def test_report_contains_results(self, compliant_context, temp_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(temp_rules_dir)
        engine = ComplianceEngine(registry)

        report = engine.evaluate_project(compliant_context)

        assert len(report.results) == 2
        for result in report.results:
            assert result.status == RuleStatus.PASS
            assert result.evaluated_at != ""
            assert result.rule_code in ("URB-COS-001", "URB-HT-001")
