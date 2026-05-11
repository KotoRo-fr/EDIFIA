"""
Parseur YAML pour les regles reglementaires EDIFIA.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml

from models.rule import Applicability, Formula, Rule, RuleInput, Source


def parse_rule_file(filepath: str | Path) -> Rule:
    """Parse un fichier YAML de regle et retourne un objet Rule."""
    filepath = Path(filepath)
    if not filepath.exists():
        raise FileNotFoundError(f"Fichier non trouve : {filepath}")

    try:
        with open(filepath, encoding="utf-8") as fh:
            data = yaml.safe_load(fh)
    except yaml.YAMLError as exc:
        raise ValueError(f"YAML invalide dans {filepath}: {exc}") from exc

    if data is None:
        raise ValueError(f"Fichier YAML vide ou invalide : {filepath}")

    rule_data = data.get("rule", {})
    if not rule_data:
        raise ValueError(f"Cle 'rule' manquante dans {filepath}")

    # Parse inputs
    formula_data = rule_data.get("formula", {})
    input_list: list[RuleInput] = []
    for inp in formula_data.get("input", []):
        input_list.append(
            RuleInput(
                name=inp.get("name", ""),
                source=inp.get("source", ""),
            )
        )

    # Parse formula
    formula = Formula(
        type=formula_data.get("type", ""),
        inputs=input_list,
        operation=formula_data.get("operation", ""),
        expression=formula_data.get("expression", ""),
    )

    # Parse applicability
    app_data = rule_data.get("applicability", {})
    applicability = Applicability(
        project_types=app_data.get("project_types", []),
        zones=app_data.get("zones", []),
        communes=app_data.get("communes", []),
    )

    # Parse source
    src_data = rule_data.get("source", {})
    source = Source(
        document=src_data.get("document", ""),
        article=src_data.get("article", ""),
        reference=src_data.get("reference", ""),
    )

    # Parse error_message
    error_message = rule_data.get("error_message", {})
    if isinstance(error_message, str):
        error_message = {"fr": error_message}

    # Parse metadata
    metadata = rule_data.get("metadata", {})

    return Rule(
        code=rule_data.get("code", ""),
        name=rule_data.get("name", ""),
        description=rule_data.get("description", ""),
        category=rule_data.get("category", ""),
        severity=rule_data.get("severity", "info"),
        applicability=applicability,
        formula=formula,
        error_message=error_message,
        source=source,
        metadata=metadata,
    )


def parse_rule_directory(directory: str | Path) -> list[Rule]:
    """Parse tous les fichiers YAML d'un repertoire (recursif)."""
    directory = Path(directory)
    if not directory.exists():
        raise FileNotFoundError(f"Repertoire non trouve : {directory}")

    rules: list[Rule] = []
    for filepath in sorted(directory.rglob("*.yml")):
        try:
            rule = parse_rule_file(filepath)
            if rule.code:
                rules.append(rule)
        except (ValueError, KeyError):
            continue

    return sorted(rules, key=lambda r: r.code)
