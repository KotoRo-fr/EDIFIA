"""
Tests unitaires du registre de règles.

Vérifie le chargement, la recherche et le filtrage des règles réglementaires.
"""

from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

import pytest
import yaml

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine.registry import RulesRegistry
from models.rule import Rule


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def mixed_rules_dir():
    """Répertoire avec des règles de catégories variées."""
    with tempfile.TemporaryDirectory() as tmpdir:
        rules_data = [
            {
                "rule": {
                    "code": "URB-COS-001",
                    "name": "COS max",
                    "description": "Test",
                    "category": "urbanisme",
                    "severity": "blocking",
                    "applicability": {
                        "project_types": ["new_build"],
                        "zones": ["U", "AU"],
                    },
                    "formula": {
                        "type": "comparison",
                        "input": [{"name": "val", "source": "variante.hauteur"}],
                        "operation": "lte",
                        "expression": "val <= 10",
                    },
                    "error_message": {"fr": "erreur"},
                    "source": {"document": "PLU", "article": "Art 1"},
                }
            },
            {
                "rule": {
                    "code": "URB-HT-001",
                    "name": "Hauteur max",
                    "description": "Test",
                    "category": "urbanisme",
                    "severity": "blocking",
                    "applicability": {
                        "project_types": ["new_build"],
                        "zones": ["U"],
                    },
                    "formula": {
                        "type": "comparison",
                        "input": [{"name": "val", "source": "variante.hauteur"}],
                        "operation": "lte",
                        "expression": "val <= 12",
                    },
                    "error_message": {"fr": "erreur"},
                    "source": {"document": "PLU", "article": "Art 2"},
                }
            },
            {
                "rule": {
                    "code": "DTU-TEST-001",
                    "name": "Test DTU",
                    "description": "Test",
                    "category": "dtu",
                    "severity": "major",
                    "applicability": {
                        "project_types": ["new_build"],
                        "zones": ["U"],
                    },
                    "formula": {
                        "type": "comparison",
                        "input": [{"name": "val", "source": "variante.hauteur"}],
                        "operation": "gte",
                        "expression": "val >= 20",
                    },
                    "error_message": {"fr": "erreur"},
                    "source": {"document": "DTU", "article": "Art 1"},
                }
            },
        ]
        for i, data in enumerate(rules_data):
            subdir = Path(tmpdir) / data["rule"]["category"]
            subdir.mkdir(exist_ok=True)
            filepath = subdir / f"rule_{i}.yml"
            with open(filepath, "w", encoding="utf-8") as fh:
                yaml.dump(data, fh, allow_unicode=True, sort_keys=False)
        yield tmpdir


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

class TestLoadFromDirectory:
    """Tests de load_from_directory."""

    def test_load_all_rules(self, mixed_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(mixed_rules_dir)

        assert registry.count() == 3
        assert set(registry.list_codes()) == {
            "URB-COS-001",
            "URB-HT-001",
            "DTU-TEST-001",
        }

    def test_load_empty_directory(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            registry = RulesRegistry()
            registry.load_from_directory(tmpdir)
            assert registry.count() == 0

    def test_load_from_real_rules(self):
        """Charge le vrai répertoire de règles du projet."""
        rules_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "rules",
        )
        if os.path.exists(rules_path):
            registry = RulesRegistry()
            registry.load_from_directory(rules_path)
            assert registry.count() > 0


class TestGetByCode:
    """Tests de get_by_code."""

    def test_get_by_code(self, mixed_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(mixed_rules_dir)

        rule = registry.get_by_code("URB-COS-001")
        assert isinstance(rule, Rule)
        assert rule.code == "URB-COS-001"
        assert rule.category == "urbanisme"

    def test_get_by_code_unknown(self, mixed_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(mixed_rules_dir)

        with pytest.raises(KeyError):
            registry.get_by_code("INEXISTANT-001")


class TestGetByCategory:
    """Tests de get_by_category."""

    def test_get_by_category_urbanisme(self, mixed_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(mixed_rules_dir)

        rules = registry.get_by_category("urbanisme")
        assert len(rules) == 2
        assert all(r.category == "urbanisme" for r in rules)

    def test_get_by_category_dtu(self, mixed_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(mixed_rules_dir)

        rules = registry.get_by_category("dtu")
        assert len(rules) == 1
        assert rules[0].code == "DTU-TEST-001"

    def test_get_by_category_empty(self, mixed_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(mixed_rules_dir)

        rules = registry.get_by_category("incendie")
        assert rules == []


class TestGetApplicableRules:
    """Tests de get_applicable_rules."""

    def test_filter_by_zone(self, mixed_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(mixed_rules_dir)

        # Zone "U" → toutes les 3 règles
        rules = registry.get_applicable_rules("new_build", "74010", "U")
        assert len(rules) == 3

    def test_filter_by_zone_au(self, mixed_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(mixed_rules_dir)

        # Zone "AU" → seule URB-COS-001 a "AU" dans ses zones
        rules = registry.get_applicable_rules("new_build", "74010", "AU")
        codes = [r.code for r in rules]
        assert "URB-COS-001" in codes
        assert "URB-HT-001" not in codes  # URB-HT-001 n'a que "U"

    def test_filter_by_project_type(self, mixed_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(mixed_rules_dir)

        # "extension_under_40" → aucune règle ne l'a dans project_types
        rules = registry.get_applicable_rules("extension_under_40", "74010", "U")
        assert len(rules) == 0

    def test_filter_empty_criteria_match_all(self, mixed_rules_dir):
        """Si les critères d'applicabilité sont vides, la règle s'applique."""
        with tempfile.TemporaryDirectory() as tmpdir:
            rule_data = {
                "rule": {
                    "code": "OPEN-001",
                    "name": "Open rule",
                    "description": "No applicability filters",
                    "category": "urbanisme",
                    "severity": "info",
                    "applicability": {},  # Aucun filtre
                    "formula": {
                        "type": "comparison",
                        "input": [{"name": "val", "source": "variante.hauteur"}],
                        "operation": "lte",
                        "expression": "val <= 100",
                    },
                    "error_message": {"fr": "erreur"},
                    "source": {"document": "PLU", "article": "Art"},
                }
            }
            filepath = Path(tmpdir) / "open.yml"
            with open(filepath, "w", encoding="utf-8") as fh:
                yaml.dump(rule_data, fh, allow_unicode=True, sort_keys=False)

            registry = RulesRegistry()
            registry.load_from_directory(tmpdir)
            # Avec aucun filtre, la règle s'applique à tout
            rules = registry.get_applicable_rules("any_type", "99999", "ANY")
            assert len(rules) == 1
            assert rules[0].code == "OPEN-001"


class TestCount:
    """Tests de count."""

    def test_count(self, mixed_rules_dir):
        registry = RulesRegistry()
        assert registry.count() == 0

        registry.load_from_directory(mixed_rules_dir)
        assert registry.count() == 3

    def test_count_after_clear(self, mixed_rules_dir):
        registry = RulesRegistry()
        registry.load_from_directory(mixed_rules_dir)
        registry.clear()
        assert registry.count() == 0
