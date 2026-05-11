"""
Moteur de conformité EDIFIA.

Évalue un projet de construction contre toutes les règles réglementaires
applicables et génère un rapport de conformité détaillé.
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from engine.operators import REGISTRY
from engine.registry import RulesRegistry
from engine.resolver import resolve_reference
from models.project_context import ProjectContext
from models.rule import Rule, RuleStatus


# ---------------------------------------------------------------------------
# Résultat d'évaluation
# ---------------------------------------------------------------------------


@dataclass
class EvaluationResult:
    """Résultat de l'évaluation d'une règle."""

    rule_code: str
    rule_name: str
    category: str
    status: str  # "pass", "fail", "warning", "not_applicable"
    message: str
    severity: str
    evaluated_values: dict[str, Any] = field(default_factory=dict)
    evaluated_at: str = ""


# ---------------------------------------------------------------------------
# Résumé
# ---------------------------------------------------------------------------


@dataclass
class EvaluationSummary:
    """Résumé statistique d'une évaluation."""

    total_rules: int = 0
    passed: int = 0
    failed: int = 0
    warnings: int = 0
    not_applicable: int = 0
    compliance_rate: float = 0.0
    evaluation_time_ms: float = 0.0
    blocking_count: int = 0


# ---------------------------------------------------------------------------
# Rapport d'évaluation
# ---------------------------------------------------------------------------


@dataclass
class EvaluationReport:
    """Rapport complet d'évaluation de conformité."""

    project_id: str
    evaluated_at: str
    summary: EvaluationSummary = field(default_factory=EvaluationSummary)
    results: list[EvaluationResult] = field(default_factory=list)
    blocking_issues: list[EvaluationResult] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        """Convertit le rapport en dictionnaire sérialisable."""
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


# ---------------------------------------------------------------------------
# Moteur
# ---------------------------------------------------------------------------


class ComplianceEngine:
    """Moteur d'évaluation de conformité réglementaire."""

    def __init__(self, registry: RulesRegistry) -> None:
        self.registry = registry

    # ------------------------------------------------------------------
    # Applicabilité
    # ------------------------------------------------------------------

    def _is_applicable(self, rule: Rule, context: ProjectContext) -> bool:
        """Vérifie si une règle est applicable au contexte projet."""
        app = rule.applicability

        if app.project_types and context.project_type not in app.project_types:
            return False
        if app.zones and context.plu.zone not in app.zones:
            return False
        if app.communes and context.commune_code not in app.communes:
            return False

        return True

    # ------------------------------------------------------------------
    # Évaluation d'une règle
    # ------------------------------------------------------------------

    def _evaluate_rule(
        self,
        rule: Rule,
        context: ProjectContext,
    ) -> EvaluationResult:
        """Évalue une seule règle contre le contexte projet."""
        now = datetime.now(timezone.utc).isoformat()

        # Vérifier l'applicabilité
        if not self._is_applicable(rule, context):
            return EvaluationResult(
                rule_code=rule.code,
                rule_name=rule.name,
                category=rule.category,
                status=RuleStatus.NOT_APPLICABLE,
                message=f"Règle non applicable : {rule.code}",
                severity=rule.severity,
                evaluated_values={},
                evaluated_at=now,
            )

        # Résoudre les inputs
        evaluated_values: dict[str, Any] = {}
        input_values: list[Any] = []

        for inp in rule.formula.inputs:
            try:
                value = resolve_reference(inp.source, context)
            except ValueError:
                value = None
            evaluated_values[inp.name] = value
            input_values.append(value)

        # Appliquer l'opérateur
        operation = rule.formula.operation
        op_func = REGISTRY.get(operation)

        if op_func is None:
            status = RuleStatus.WARNING
            message = f"Opérateur inconnu : {operation}"
        elif len(input_values) < 2 and operation in ("lte", "gte", "eq"):
            status = RuleStatus.WARNING
            message = "Nombre d'inputs insuffisant"
        else:
            try:
                if operation == "lte":
                    result = op_func(input_values[0], input_values[1])
                elif operation == "gte":
                    result = op_func(input_values[0], input_values[1])
                elif operation == "eq":
                    result = op_func(input_values[0], input_values[1])
                elif operation == "between":
                    result = op_func(input_values[0], input_values[1], input_values[2])
                elif operation == "in":
                    result = op_func(input_values[0], input_values[1:])
                else:
                    result = op_func(input_values)

                if result:
                    status = RuleStatus.PASS
                    message = f"Règle {rule.code} conforme"
                else:
                    status = RuleStatus.FAIL
                    # Formater le message d'erreur avec les valeurs
                    message = self._format_error_message(
                        rule.error_message.get("fr", "Non conforme"),
                        evaluated_values,
                    )
            except Exception as exc:
                status = RuleStatus.WARNING
                message = f"Erreur lors de l'évaluation : {exc}"

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
        """Formate un message d'erreur en remplaçant les placeholders."""
        try:
            return template.format(**values)
        except (KeyError, ValueError):
            return template

    # ------------------------------------------------------------------
    # Évaluation complète
    # ------------------------------------------------------------------

    def evaluate_project(
        self,
        context: ProjectContext,
    ) -> EvaluationReport:
        """Évalue un projet contre toutes les règles applicables.

        Retourne un rapport avec compliance_rate en ratio (0.0–1.0).

        Args:
            context: Contexte du projet à évaluer.

        Returns:
            Rapport d'évaluation.
        """
        now = datetime.now(timezone.utc).isoformat()
        project_id = context.commune_code or "test"

        rules = self.registry.get_applicable(context)
        results: list[EvaluationResult] = []

        passed = 0
        failed = 0
        warnings = 0
        not_applicable = 0

        for rule in rules:
            result = self._evaluate_rule(rule, context)
            results.append(result)

            if result.status == RuleStatus.PASS:
                passed += 1
            elif result.status == RuleStatus.FAIL:
                failed += 1
            elif result.status == RuleStatus.WARNING:
                warnings += 1
            elif result.status == RuleStatus.NOT_APPLICABLE:
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
        self,
        context: ProjectContext,
    ) -> EvaluationReport:
        """Évalue un projet avec mesure de temps et rapport détaillé.

        Retourne un rapport avec compliance_rate en pourcentage (0.0–100.0).

        Args:
            context: Contexte du projet à évaluer.

        Returns:
            Rapport d'évaluation détaillé.
        """
        start = time.perf_counter()
        now = datetime.now(timezone.utc).isoformat()
        project_id = context.commune_code or "test"

        # Récupérer TOUTES les règles (pas seulement applicables)
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

            if result.status == RuleStatus.PASS:
                passed += 1
            elif result.status == RuleStatus.FAIL:
                failed += 1
            elif result.status == RuleStatus.WARNING:
                warnings += 1
            elif result.status == RuleStatus.NOT_APPLICABLE:
                not_applicable += 1

        elapsed_ms = (time.perf_counter() - start) * 1000.0

        total = len(results)
        applicable = total - not_applicable
        compliance_rate = round((passed / applicable) * 100, 1) if applicable > 0 else 0.0

        blocking_issues = [
            r for r in results
            if r.severity == "blocking" and r.status == RuleStatus.FAIL
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

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def get_blocking_issues_from_report(
        self,
        report: EvaluationReport,
    ) -> list[dict[str, Any]]:
        """Extrait les problèmes bloquants d'un rapport.

        Args:
            report: Rapport d'évaluation.

        Returns:
            Liste des problèmes bloquants sous forme de dictionnaires.
        """
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
