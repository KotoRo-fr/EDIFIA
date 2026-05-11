"""
Tests unitaires du parseur YAML.

Vérifie le chargement et la validation des fichiers de règles réglementaires.
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

import pytest
import yaml

import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from parser.yaml_parser import parse_rule_file, parse_rule_directory
from models.rule import Rule, RuleInput, Formula, Applicability, Source


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

VALID_RULE_DICT = {
    "rule": {
        "code": "TEST-001",
        "name": "Règle de test",
        "description": "Une règle de test pour valider le parsing",
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
                {"name": "hauteur_max", "source": "plu.height_max"},
            ],
            "operation": "lte",
            "expression": "hauteur <= hauteur_max",
        },
        "error_message": {
            "fr": "La hauteur dépasse la limite autorisée",
        },
        "source": {
            "document": "PLU",
            "article": "Article test",
        },
    }
}


@pytest.fixture
def temp_rule_file():
    """Crée un fichier YAML de règle valide temporaire."""
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".yml", delete=False, encoding="utf-8"
    ) as fh:
        yaml.dump(VALID_RULE_DICT, fh, allow_unicode=True, sort_keys=False)
        path = fh.name
    yield path
    os.unlink(path)


@pytest.fixture
def temp_rules_dir():
    """Crée un répertoire temporaire avec 5 règles YAML."""
    with tempfile.TemporaryDirectory() as tmpdir:
        for i in range(1, 6):
            rule_data = {
                "rule": {
                    "code": f"TEST-{i:03d}",
                    "name": f"Règle test {i}",
                    "description": f"Description {i}",
                    "category": "urbanisme",
                    "severity": "blocking",
                    "applicability": {
                        "project_types": ["new_build"],
                        "zones": ["U"],
                    },
                    "formula": {
                        "type": "comparison",
                        "input": [
                            {"name": "val", "source": "variante.hauteur"},
                            {"name": "max", "source": "plu.height_max"},
                        ],
                        "operation": "lte",
                        "expression": "val <= max",
                    },
                    "error_message": {"fr": f"Erreur {i}"},
                    "source": {"document": "PLU", "article": f"Art {i}"},
                }
            }
            filepath = Path(tmpdir) / f"rule_{i}.yml"
            with open(filepath, "w", encoding="utf-8") as fh:
                yaml.dump(rule_data, fh, allow_unicode=True, sort_keys=False)
        yield tmpdir


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


class TestParseRuleFile:
    """Tests de parse_rule_file."""

    def test_parse_valid_rule(self, temp_rule_file):
        """Doit parser un fichier YAML valide et retourner une Rule."""
        rule = parse_rule_file(temp_rule_file)

        assert isinstance(rule, Rule)
        assert rule.code == "TEST-001"
        assert rule.name == "Règle de test"
        assert rule.category == "urbanisme"
        assert rule.severity == "blocking"
        assert rule.formula.type == "comparison"
        assert rule.formula.operation == "lte"
        assert len(rule.formula.inputs) == 2
        assert rule.formula.inputs[0].name == "hauteur"
        assert rule.formula.inputs[0].source == "variante.hauteur"
        assert rule.error_message["fr"] == "La hauteur dépasse la limite autorisée"
        assert rule.source.document == "PLU"

    def test_parse_nonexistent_file(self):
        """Doit lever FileNotFoundError si le fichier n'existe pas."""
        with pytest.raises(FileNotFoundError):
            parse_rule_file("/chemin/inexistant/regle.yml")

    def test_parse_invalid_yaml(self):
        """Doit lever ValueError si le YAML est invalide."""
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".yml", delete=False, encoding="utf-8"
        ) as fh:
            fh.write("ceci n'est pas du yaml ::: [[[")
            bad_path = fh.name
        try:
            with pytest.raises(ValueError):
                parse_rule_file(bad_path)
        finally:
            os.unlink(bad_path)

    def test_parse_missing_field(self):
        """Doit gérer un champ manquant dans la structure."""
        incomplete = {
            "rule": {
                "code": "TEST-BAD",
                # name manquant
                "description": "incomplete",
                "category": "urbanisme",
                "severity": "blocking",
                "applicability": {},
                "formula": {
                    "type": "comparison",
                    "input": [
                        {"name": "val", "source": "variante.hauteur"},
                    ],
                    "operation": "lte",
                    "expression": "val <= 10",
                },
                "error_message": {"fr": "erreur"},
                "source": {"document": "PLU", "article": "Art"},
            }
        }
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".yml", delete=False, encoding="utf-8"
        ) as fh:
            yaml.dump(incomplete, fh, allow_unicode=True)
            path = fh.name
        try:
            # Le parseur ne lève pas d'erreur sur name vide, il met une valeur par défaut
            rule = parse_rule_file(path)
            assert rule.name == ""  # Champ vide accepté
        finally:
            os.unlink(path)


class TestParseDirectory:
    """Tests de parse_rule_directory."""

    def test_parse_directory(self, temp_rules_dir):
        """Doit parser un répertoire et retourner la liste des règles."""
        rules = parse_rule_directory(temp_rules_dir)

        assert len(rules) == 5
        codes = [r.code for r in rules]
        assert codes == sorted(codes)
        assert "TEST-001" in codes
        assert "TEST-005" in codes

    def test_parse_empty_directory(self):
        """Doit retourner une liste vide pour un répertoire sans YAML."""
        with tempfile.TemporaryDirectory() as tmpdir:
            rules = parse_rule_directory(tmpdir)
            assert rules == []

    def test_parse_nonexistent_directory(self):
        """Doit lever FileNotFoundError pour un répertoire inexistant."""
        with pytest.raises(FileNotFoundError):
            parse_rule_directory("/chemin/inexistant/rules/")
