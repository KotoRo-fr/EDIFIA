"""Registre de regles reglementaires."""
from __future__ import annotations

import os
from pathlib import Path
from typing import Optional

import yaml

from models.rule import Rule, Applicability, Formula, Source


class RulesRegistry:
    """Registre central des regles reglementaires."""

    def __init__(self):
        self.rules: dict[str, Rule] = {}

    def register(self, rule: Rule) -> None:
        """Enregistre une regle dans le registre."""
        self.rules[rule.code] = rule

    def get(self, code: str) -> Optional[Rule]:
        """Recupere une regle par son code."""
        return self.rules.get(code)

    def get_by_code(self, code: str) -> Rule:
        """Recupere une regle par son code (leve KeyError si absente)."""
        if code not in self.rules:
            raise KeyError(f"Regle inconnue: {code}")
        return self.rules[code]

    def get_by_category(self, category: str) -> list[Rule]:
        """Recupere les regles d'une categorie."""
        return [r for r in self.rules.values() if r.category == category]

    def list_codes(self) -> list[str]:
        """Liste tous les codes de regles."""
        return list(self.rules.keys())

    def count(self) -> int:
        """Nombre total de regles."""
        return len(self.rules)

    def clear(self) -> None:
        """Vide le registre."""
        self.rules.clear()

    def load_from_directory(self, directory: str) -> int:
        """Charge toutes les regles YAML depuis un repertoire."""
        loaded = 0
        rules_path = Path(directory)
        if not rules_path.exists():
            return 0

        for yml_file in rules_path.rglob("*.yml"):
            try:
                with open(yml_file, "r", encoding="utf-8") as fh:
                    data = yaml.safe_load(fh)
                if data and "rule" in data:
                    rule = self._parse_rule(data["rule"])
                    self.register(rule)
                    loaded += 1
            except Exception:
                continue
        return loaded

    @classmethod
    def from_directory(cls, directory: str | Path) -> "RulesRegistry":
        """Cree un registre charge depuis un repertoire."""
        registry = cls()
        registry.load_from_directory(str(directory))
        return registry

    def get_applicable_rules(
        self, project_type: str, commune_code: str, zone: str
    ) -> list[Rule]:
        """Filtre les regles applicables selon le contexte."""
        applicable = []
        for rule in self.rules.values():
            app = rule.applicability
            # Si aucun filtre d'applicabilite, la regle s'applique
            if not app.project_types and not app.zones:
                applicable.append(rule)
                continue
            # Verifier le type de projet
            if app.project_types and project_type not in app.project_types:
                continue
            # Verifier la zone
            if app.zones and zone not in app.zones:
                continue
            applicable.append(rule)
        return applicable

    def _parse_rule(self, data: dict) -> Rule:
        """Parse un dictionnaire YAML en objet Rule."""
        applicability_data = data.get("applicability", {})
        applicability = Applicability(
            project_types=applicability_data.get("project_types", []),
            zones=applicability_data.get("zones", []),
        )

        formula_data = data.get("formula", {})
        formula = Formula(
            type=formula_data.get("type", "comparison"),
            input=formula_data.get("input", []),
            operation=formula_data.get("operation", "lte"),
            expression=formula_data.get("expression", ""),
        )

        source_data = data.get("source", {})
        source = Source(
            document=source_data.get("document", ""),
            article=source_data.get("article", ""),
        )

        error_message = data.get("error_message", {})
        if isinstance(error_message, str):
            error_message = {"fr": error_message}

        return Rule(
            code=data["code"],
            name=data["name"],
            category=data["category"],
            description=data.get("description", ""),
            severity=data.get("severity", "info"),
            applicability=applicability,
            formula=formula,
            error_message=error_message,
            source=source,
        )
