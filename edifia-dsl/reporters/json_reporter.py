"""
Générateur de rapport JSON pour le moteur de conformité EDIFIA.
"""

from __future__ import annotations

from typing import Any

from engine.compliance_engine import EvaluationReport


def generate_json_report(report: EvaluationReport) -> dict[str, Any]:
    """Génère un rapport JSON à partir d'un EvaluationReport.

    Args:
        report: Rapport d'évaluation.

    Returns:
        Dictionnaire sérialisable représentant le rapport.
    """
    return {
        "project_id": report.project_id,
        "evaluated_at": report.evaluated_at,
        "summary": {
            "total_rules": report.summary.total_rules,
            "passed": report.summary.passed,
            "failed": report.summary.failed,
            "warnings": report.summary.warnings,
            "not_applicable": report.summary.not_applicable,
            "compliance_rate": report.summary.compliance_rate,
            "evaluation_time_ms": report.summary.evaluation_time_ms,
            "blocking_count": report.summary.blocking_count,
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
            for r in report.results
        ],
        "blocking_issues": [
            {
                "rule_code": r.rule_code,
                "message": r.message,
                "severity": r.severity,
            }
            for r in report.blocking_issues
        ],
    }
