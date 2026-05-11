"""
Registre de regles reglementaires EDIFIA.
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from models.rule import Rule
from parser.yaml_parser import parse_rule_directory


class RulesRegistry:
    """Registre central des regles reglementaires."""

    def __init__(self) -> None:
        self.rules: dict[str, Rule] = {}

    def load_from_directory(self, directory: str | Path) -> int:
        """Charge toutes les regles YAML d'un repertoire."""
        rules = parse_rule_directory(directory)
        for rule in rules:
            self.rules[rule.code] = rule
        return len(rules)

    @classmethod
    def from_directory(cls, directory: str | Path) -> "RulesRegistry":
        """Cree un registre et charge toutes les regles YAML d'un repertoire."""
        registry = cls()
        registry.load_from_directory(directory)
        return registry

    def get(self, code: str) -> Optional[Rule]:
        """Retourne une regle par son code, ou None si non trouvee."""
        return self.rules.get(code)

    def get_by_code(self, code: str) -> Rule:
        """Retourne une regle par son code.

        Raises:
            KeyError: Si la regle n'existe pas.
        """
        if code not in self.rules:
            raise KeyError(f"Regle inconnue : {code}")
        return self.rules[code]

    def get_by_category(self, category: str) -> list[Rule]:
        """Retourne toutes les regles d'une categorie."""
        return [r for r in self.rules.values() if r.category == category]

    def get_applicable_rules(
        self, project_type: str, commune_code: str, zone: str
    ) -> list[Rule]:
        """Filtre les regles applicables selon le contexte."""
        results: list[Rule] = []
        for rule in self.rules.values():
            app = rule.applicability
            if app.project_types and project_type not in app.project_types:
                continue
            if app.zones and zone not in app.zones:
                continue
            if app.communes and commune_code not in app.communes:
                continue
            results.append(rule)
        return results

    def get_applicable(self, context: object) -> list[Rule]:
        """Filtre les regles applicables selon le contexte projet."""
        return self.get_applicable_rules(
            getattr(context, "project_type", ""),
            getattr(context, "commune_code", ""),
            getattr(getattr(context, "plu", None), "zone", ""),
        )

    def add(self, rule: Rule) -> None:
        """Ajoute une regle au registre."""
        self.rules[rule.code] = rule

    def clear(self) -> None:
        """Vide le registre."""
        self.rules.clear()

    def list_codes(self) -> list[str]:
        """Retourne la liste des codes de regles."""
        return list(self.rules.keys())

    def count(self) -> int:
        """Retourne le nombre de regles."""
        return len(self.rules)

    def __len__(self) -> int:
        return len(self.rules)
