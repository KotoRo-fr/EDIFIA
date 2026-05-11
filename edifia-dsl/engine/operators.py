"""
Opérateurs de comparaison pour le moteur de conformité EDIFIA.

Fonctions pures implémentant les opérations mathématiques et logiques
utilisées dans les formules de règles réglementaires.
"""

from __future__ import annotations

from typing import Any


def lte(a: float, b: float) -> bool:
    """Lower than or equal : a <= b."""
    return float(a) <= float(b)


def gte(a: float, b: float) -> bool:
    """Greater than or equal : a >= b."""
    return float(a) >= float(b)


def eq(a: Any, b: Any) -> bool:
    """Equal : a == b."""
    return a == b


def between(value: float, min_val: float, max_val: float) -> bool:
    """Vérifie que value est entre min_val et max_val (inclus)."""
    return float(min_val) <= float(value) <= float(max_val)


def in_set(value: Any, allowed: list) -> bool:
    """Vérifie que value est dans la liste allowed."""
    return value in allowed


def logic_and(conditions: list[bool]) -> bool:
    """AND logique sur une liste de conditions."""
    if not conditions:
        return True  # neutre
    return all(conditions)


def logic_or(conditions: list[bool]) -> bool:
    """OR logique sur une liste de conditions."""
    if not conditions:
        return False  # neutre
    return any(conditions)


# Registre des opérateurs — les clés correspondent aux valeurs YAML d'opération
REGISTRY: dict[str, Any] = {
    "lte": lte,
    "gte": gte,
    "eq": eq,
    "between": between,
    "in": in_set,
    "and": logic_and,
    "or": logic_or,
}
