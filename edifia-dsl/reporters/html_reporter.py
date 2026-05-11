"""
Générateur de rapport HTML pour le moteur de conformité EDIFIA.
"""

from __future__ import annotations

from engine.compliance_engine import EvaluationReport


def generate_html_report(report: EvaluationReport) -> str:
    """Génère un rapport HTML à partir d'un EvaluationReport.

    Args:
        report: Rapport d'évaluation.

    Returns:
        Chaîne HTML complète.
    """
    s = report.summary

    # Déterminer la classe CSS du score
    if s.compliance_rate >= 90:
        score_class = "success"
    elif s.compliance_rate >= 50:
        score_class = "warning"
    else:
        score_class = "danger"

    # Ligne de résultats
    result_rows = ""
    for r in report.results:
        status_class = {
            "pass": "success",
            "fail": "danger",
            "warning": "warning",
            "not_applicable": "muted",
        }.get(r.status, "muted")

        result_rows += f"""
        <tr>
            <td>{r.rule_code}</td>
            <td>{r.rule_name}</td>
            <td>{r.category}</td>
            <td class="{status_class}">{r.status}</td>
            <td>{r.message}</td>
            <td>{r.severity}</td>
        </tr>
        """

    # Section problèmes bloquants
    blocking_section = ""
    if report.blocking_issues:
        blocking_rows = ""
        for b in report.blocking_issues:
            blocking_rows += f"""
            <tr class="danger">
                <td>{b.rule_code}</td>
                <td>{b.message}</td>
                <td>{b.severity}</td>
            </tr>
            """
        blocking_section = f"""
        <h2>Problèmes bloquants</h2>
        <table>
            <thead>
                <tr>
                    <th>Code règle</th>
                    <th>Message</th>
                    <th>Sévérité</th>
                </tr>
            </thead>
            <tbody>
                {blocking_rows}
            </tbody>
        </table>
        """

    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport de conformité EDIFIA</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 2em; }}
        h1 {{ color: #333; }}
        .score {{ font-size: 2em; font-weight: bold; padding: 0.5em; border-radius: 8px; display: inline-block; }}
        .success {{ background-color: #d4edda; color: #155724; }}
        .warning {{ background-color: #fff3cd; color: #856404; }}
        .danger {{ background-color: #f8d7da; color: #721c24; }}
        .muted {{ color: #6c757d; }}
        table {{ border-collapse: collapse; width: 100%; margin-top: 1em; }}
        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
        th {{ background-color: #f2f2f2; }}
        tr:nth-child(even) {{ background-color: #f9f9f9; }}
    </style>
</head>
<body>
    <h1>Rapport de conformité réglementaire</h1>
    <p><strong>Projet :</strong> {report.project_id}</p>
    <p><strong>Évalué le :</strong> {report.evaluated_at}</p>

    <h2>Taux de conformité</h2>
    <div class="score {score_class}">{s.compliance_rate}%</div>

    <h2>Résumé</h2>
    <table>
        <tr><th>Total règles</th><td>{s.total_rules}</td></tr>
        <tr><th>Conformes</th><td class="success">{s.passed}</td></tr>
        <tr><th>Non conformes</th><td class="danger">{s.failed}</td></tr>
        <tr><th>Avertissements</th><td class="warning">{s.warnings}</td></tr>
        <tr><th>Non applicables</th><td class="muted">{s.not_applicable}</td></tr>
        <tr><th>Temps d'évaluation</th><td>{s.evaluation_time_ms:.1f} ms</td></tr>
        <tr><th>Problèmes bloquants</th><td class="danger">{s.blocking_count}</td></tr>
    </table>

    <h2>Détail des résultats</h2>
    <table>
        <thead>
            <tr>
                <th>Code</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Message</th>
                <th>Sévérité</th>
            </tr>
        </thead>
        <tbody>
            {result_rows}
        </tbody>
    </table>

    {blocking_section}
</body>
</html>"""
