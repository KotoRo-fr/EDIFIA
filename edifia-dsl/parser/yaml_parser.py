"""
Parseur YAML pour les règles réglementaires EDIFIA.

Charge les fichiers YAML de règles et les transforme en objets Rule Python.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml

from models.rule import Applicability, Formula, Rule, RuleInput, Source


def parse_rule_file(filepath: str | Path) -> Rule:
    """Parse un fichier YAML de règle et retourne un objet Rule.

    Args:
        filepath: Chemin vers le fichier YAML.

    Returns:
        Un objet Rule initialisé.

    Raises:
        FileNotFoundError: Si le fichier n'existe pas.
        ValueError: Si le YAML est invalide ou mal structuré.
    """
    filepath = Path(filepath)
    if not filepath.exists():
        raise FileNotFoundError(f"Fichier non trouvé : {filepath}")

    try:
        with open(filepath, encoding="utf-8") as fh:
            data = yaml.safe_load(fh)
    except yaml.YAMLError as exc:
        raise ValueError(f"YAML invalide dans {filepath}: {exc}") from exc

    if data is None:
        raise ValueError(f"Fichier YAML vide ou invalide : {filepath}")

    rule_data = data.get("rule", {})
    if not rule_data:
        raise ValueError(f"Clé 'rule' manquante dans {filepath}")

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
    """Parse tous les fichiers YAML d'un répertoire (récursif).

    Args:
        directory: Chemin vers le répertoire contenant les règles.

    Returns:
        Liste des objets Rule trouvés, triés par code.

    Raises:
        FileNotFoundError: Si le répertoire n'existe pas.
    """
    directory = Path(directory)
    if not directory.exists():
        raise FileNotFoundError(f"Répertoire non trouvé : {directory}")

    rules: list[Rule] = []
    for filepath in sorted(directory.rglob("*.yml")):
        try:
            rule = parse_rule_file(filepath)
            if rule.code:  # Ignorer les fichiers vides
                rules.append(rule)
        except (ValueError, KeyError):
            # Ignorer les fichiers mal formés
            continue

    return sorted(rules, key=lambda r: r.code)
