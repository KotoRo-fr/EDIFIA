"""
Package engine du DSL Réglementaire EDIFIA.
"""

from engine.compliance_engine import (
    ComplianceEngine,
    EvaluationReport,
    EvaluationResult,
    EvaluationSummary,
)
from engine.operators import REGISTRY
from engine.registry import RulesRegistry
from engine.resolver import resolve_reference

__all__ = [
    "ComplianceEngine",
    "EvaluationReport",
    "EvaluationResult",
    "EvaluationSummary",
    "REGISTRY",
    "RulesRegistry",
    "resolve_reference",
]
