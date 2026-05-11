"""
Moteur de conformite EDIFIA.
"""

from __future__ import annotations

import re
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from engine.operators import REGISTRY
from engine.registry import RulesRegistry
from engine.resolver import resolve_reference
from models.project_context import ProjectContext
from models.rule import Rule, RuleStatus


@dataclass
class EvaluationResult:
    """Resultat de l'evaluation d'une regle."""

    rule_code: str
    rule_name: str
    category: str
    status: str
    message: str
    severity: str
    evaluated_values: dict[str, Any] = field(default_factory=dict)
    evaluated_at: str = ""


@dataclass
class EvaluationSummary:
    """Resume statistique d'une evaluation."""

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
    """Rapport complet d'evaluation de conformite."""

    project_id: str
    evaluated_at: str
    summary: EvaluationSummary = field(default_factory=EvaluationSummary)
    results: list[EvaluationResult] = field(default_factory=list)
    blocking_issues: list[EvaluationResult] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        """Convertit le rapport en dictionnaire serialisable."""
        return {
            "project_id": self.project_id,
            "evaluated_at": self.evaluated_at,
            "summary": {
                "total_rules": self.summary.total_rules,
                "passed": self.summary.passed,
                "failed": self.summary.failed,
                "warnings": self.summary.warnings,
                "not_applicable": self.summary.not_applicable,
                "compliance_rate": self.summary.compliance_rate,
            },
            "results": [
                {
                    "rule_code": r.rule_code,
                    "rule_name": r.rule_name,
                    "category": r.category,
                    "status": r.status,
                    "message": r.message,
                    "severity": r.severity,
                    "evaluated_values": r.evaluated_values,
                    "evaluated_at": r.evaluated_at,
                }
                for r in self.results
            ],
            "blocking_issues": [
                {
                    "rule_code": r.rule_code,
                    "message": r.message,
                    "severity": r.severity,
                }
                for r in self.blocking_issues
            ],
        }


class ComplianceEngine:
    """Moteur d'evaluation de conformite reglementaire."""

    def __init__(self, registry: RulesRegistry) -> None:
        self.registry = registry

    def _is_applicable(self, rule: Rule, context: ProjectContext) -> bool:
        """Verifie si une regle est applicable au contexte projet."""
        app = rule.applicability

        if app.project_types and context.project_type not in app.project_types:
            return False
        if app.zones and context.plu.zone not in app.zones:
            return False
        if app.communes and context.commune_code not in app.communes:
            return False

        return True

    @staticmethod
    def _evaluate_expression(expression: str, values: dict[str, Any]) -> Any:
        """Evalue une expression mathematique en remplacant les variables.

        Ex: "surface_au_sol <= cos_max * surface_parcelle"
        avec values = {"surface_au_sol": 200, "cos_max": 0.5, "surface_parcelle": 500}
        retourne True (200 <= 250).
        """
        # Remplacer les noms de variables par leurs valeurs
        expr = expression
        # Trier par longueur decroissante pour eviter les remplacements partiels
        for name in sorted(values.keys(), key=len, reverse=True):
            val = values[name]
            if val is None:
                val = "None"
            elif isinstance(val, str):
                val = repr(val)
            else:
                val = str(float(val))
            # Remplacer les occurrences entieres du nom (mot complet)
            expr = re.sub(r'\b' + re.escape(name) + r'\b', val, expr)

        # Supprimer les espaces pour un eval plus sur
        expr = expr.strip()
        if not expr:
            return None

        try:
            result = eval(expr, {"__builtins__": {}}, {})
            return result
        except Exception:
            return None

    def _evaluate_rule(
        self, rule: Rule, context: ProjectContext
    ) -> EvaluationResult:
        """Evalue une seule regle contre le contexte projet."""
        now = datetime.now(timezone.utc).isoformat()

        if not self._is_applicable(rule, context):
            return EvaluationResult(
                rule_code=rule.code,
                rule_name=rule.name,
                category=rule.category,
                status=RuleStatus.NOT_APPLICABLE.value,
                message=f"Regle non applicable : {rule.code}",
                severity=rule.severity,
                evaluated_values={},
                evaluated_at=now,
            )

        # Resoudre les inputs
        evaluated_values: dict[str, Any] = {}

        for inp in rule.formula.inputs:
            try:
                value = resolve_reference(inp.source, context)
            except ValueError:
                value = None
            evaluated_values[inp.name] = value

        # Evalue l'expression complete
        expression = rule.formula.expression
        if expression:
            result = self._evaluate_expression(expression, evaluated_values)
        else:
            # Fallback : utiliser l'operateur directement
            input_values = list(evaluated_values.values())
            operation = rule.formula.operation
            op_func = REGISTRY.get(operation)
            if op_func is None:
                result = None
            elif operation in ("lte", "gte", "eq"):
                result = op_func(input_values[0], input_values[1])
            elif operation == "between":
                result = op_func(input_values[0], input_values[1], input_values[2])
            elif operation == "in":
                result = op_func(input_values[0], input_values[1:])
            else:
                result = op_func(input_values)

        if result is None:
            status = RuleStatus.WARNING.value
            message = f"Erreur lors de l'evaluation de l'expression : {rule.formula.expression}"
        elif result:
            status = RuleStatus.PASS.value
            message = f"Regle {rule.code} conforme"
        else:
            status = RuleStatus.FAIL.value
            message = self._format_error_message(
                rule.error_message.get("fr", "Non conforme"),
                evaluated_values,
            )

        return EvaluationResult(
            rule_code=rule.code,
            rule_name=rule.name,
            category=rule.category,
            status=status,
            message=message,
            severity=rule.severity,
            evaluated_values=evaluated_values,
            evaluated_at=now,
        )

    @staticmethod
    def _format_error_message(template: str, values: dict[str, Any]) -> str:
        """Formate un message d'erreur en remplacant les placeholders."""
        try:
            return template.format(**values)
        except (KeyError, ValueError):
            return template

    def evaluate_project(self, context: ProjectContext) -> EvaluationReport:
        """Evalue un projet contre toutes les regles.

        Retourne un rapport avec compliance_rate en ratio (0.0-1.0).
        """
        now = datetime.now(timezone.utc).isoformat()
        project_id = context.commune_code or "test"

        # Evalue TOUTES les regles (pas seulement applicables)
        all_rules = []
        for code in self.registry.list_codes():
            rule = self.registry.get(code)
            if rule:
                all_rules.append(rule)

        results: list[EvaluationResult] = []
        passed = 0
        failed = 0
        warnings = 0
        not_applicable = 0

        for rule in all_rules:
            result = self._evaluate_rule(rule, context)
            results.append(result)

            if result.status == RuleStatus.PASS.value:
                passed += 1
            elif result.status == RuleStatus.FAIL.value:
                failed += 1
            elif result.status == RuleStatus.WARNING.value:
                warnings += 1
            elif result.status == RuleStatus.NOT_APPLICABLE.value:
                not_applicable += 1

        total = len(results)
        applicable = total - not_applicable
        compliance_rate = (passed / applicable) if applicable > 0 else 0.0

        summary = EvaluationSummary(
            total_rules=total,
            passed=passed,
            failed=failed,
            warnings=warnings,
            not_applicable=not_applicable,
            compliance_rate=compliance_rate,
        )

        return EvaluationReport(
            project_id=project_id,
            evaluated_at=now,
            summary=summary,
            results=results,
        )

    def evaluate_project_detailed(
        self, context: ProjectContext
    ) -> EvaluationReport:
        """Evalue un projet avec mesure de temps et rapport detaille.

        Retourne un rapport avec compliance_rate en pourcentage (0.0-100.0).
        """
        start = time.perf_counter()
        now = datetime.now(timezone.utc).isoformat()
        project_id = context.commune_code or "test"

        all_rules = []
        for code in self.registry.list_codes():
            rule = self.registry.get(code)
            if rule:
                all_rules.append(rule)

        results: list[EvaluationResult] = []
        passed = 0
        failed = 0
        warnings = 0
        not_applicable = 0

        for rule in all_rules:
            result = self._evaluate_rule(rule, context)
            results.append(result)

            if result.status == RuleStatus.PASS.value:
                passed += 1
            elif result.status == RuleStatus.FAIL.value:
                failed += 1
            elif result.status == RuleStatus.WARNING.value:
                warnings += 1
            elif result.status == RuleStatus.NOT_APPLICABLE.value:
                not_applicable += 1

        elapsed_ms = (time.perf_counter() - start) * 1000.0

        total = len(results)
        applicable = total - not_applicable
        compliance_rate = round((passed / applicable) * 100, 1) if applicable > 0 else 0.0

        blocking_issues = [
            r
            for r in results
            if r.severity == "blocking" and r.status == RuleStatus.FAIL.value
        ]

        summary = EvaluationSummary(
            total_rules=total,
            passed=passed,
            failed=failed,
            warnings=warnings,
            not_applicable=not_applicable,
            compliance_rate=compliance_rate,
            evaluation_time_ms=elapsed_ms,
            blocking_count=len(blocking_issues),
        )

        return EvaluationReport(
            project_id=project_id,
            evaluated_at=now,
            summary=summary,
            results=results,
            blocking_issues=blocking_issues,
        )

    def get_blocking_issues_from_report(
        self, report: EvaluationReport
    ) -> list[dict[str, Any]]:
        """Extrait les problemes bloquants d'un rapport."""
        return [
            {
                "rule_code": r.rule_code,
                "rule_name": r.rule_name,
                "message": r.message,
                "severity": r.severity,
                "evaluated_values": r.evaluated_values,
            }
            for r in report.blocking_issues
        ]
