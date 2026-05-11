"""
EDIFIA DSL - Domain Specific Language pour la conformite reglementaire.

Ce package fournit un moteur d'evaluation deterministe pour verifier la conformite
des projets de construction aux reglementations francaises (urbanisme, DTU, RE2020,
accessibilite PMR, securite incendie).

Architecture:
    - models/   : Dataclasses (Rule, ProjectContext, EvaluationReport)
    - parser/   : Parseur YAML et validateur
    - engine/   : Operateurs, resolver, moteur de compliance, registre
    - rules/    : Regles reglementaires en YAML (50 regles)
    - tests/    : Tests unitaires et d'integration

Philosophie:
    - 100% deterministe, zero LLM dans la conformite
    - Toute decision est mathematiquement prouvable et auditable
    - Traçabilite complete de chaque evaluation
"""

__version__ = "0.1.0"
__author__ = "EDIFIA Team"
