"""Modeles de donnees pour les regles reglementaires."""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class RuleStatus(Enum):
    PASS = "pass"
    FAIL = "fail"
    WARNING = "warning"
    NOT_APPLICABLE = "not_applicable"


@dataclass
class RuleInput:
    name: str
    source: str


@dataclass
class Formula:
    type: str
    input: list[dict[str, str]]
    operation: str
    expression: str


@dataclass
class Applicability:
    project_types: list[str] = field(default_factory=list)
    zones: list[str] = field(default_factory=list)

    def __post_init__(self):
        if self.project_types is None:
            self.project_types = []
        if self.zones is None:
            self.zones = []


@dataclass
class Source:
    document: str
    article: str


@dataclass
class Rule:
    code: str
    name: str
    category: str
    description: str
    severity: str
    applicability: Applicability
    formula: Formula
    error_message: dict[str, str]
    source: Source


@dataclass
class EvaluationResult:
    rule_code: str
    status: RuleStatus
    message: str
    evaluated_at: str
    details: dict[str, Any] = field(default_factory=dict)


@dataclass
class EvaluationSummary:
    total_rules: int = 0
    passed: int = 0
    failed: int = 0
    warnings: int = 0
    not_applicable: int = 0
    compliance_rate: float = 0.0
    evaluation_time_ms: float = 0.0
    blocking_count: int = 0


@dataclass
class EvaluationReport:
    project_id: str
    evaluated_at: str
    summary: EvaluationSummary
    results: list[EvaluationResult]
    blocking_issues: list[EvaluationResult] = field(default_factory=list)
