"""
Modeles de donnees pour les regles reglementaires EDIFIA.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class RuleStatus(str, Enum):
    """Statuts possibles pour le resultat d'evaluation d'une regle."""

    PASS = "pass"
    FAIL = "fail"
    WARNING = "warning"
    NOT_APPLICABLE = "not_applicable"


@dataclass
class RuleInput:
    """Un input de formule : nom et source dans le contexte projet."""

    name: str
    source: str


@dataclass
class Formula:
    """Formule de comparaison d'une regle."""

    type: str
    inputs: list[RuleInput]
    operation: str
    expression: str


@dataclass
class Applicability:
    """Conditions d'applicabilite d'une regle."""

    project_types: list[str] = field(default_factory=list)
    zones: list[str] = field(default_factory=list)
    communes: list[str] = field(default_factory=list)


@dataclass
class Source:
    """Source reglementaire d'une regle."""

    document: str
    article: str
    reference: str = ""


@dataclass
class Rule:
    """Regle reglementaire complete."""

    code: str
    name: str
    category: str
    description: str
    severity: str
    applicability: Applicability
    formula: Formula
    error_message: dict[str, str]
    source: Source
    metadata: dict[str, Any] = field(default_factory=dict)
