"""
Modeles de contexte projet pour l'evaluation.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class Parcelle:
    """Caracteristiques de la parcelle."""

    surface: float
    zone: str
    cos_max: float
    height_max: float
    setbacks: dict[str, float] = field(default_factory=dict)


@dataclass
class PLU:
    """Reglement du PLU applicables."""

    zone: str
    cos_max: float
    height_max: float
    setbacks: dict[str, float] = field(default_factory=dict)


@dataclass
class Variante:
    """Variante de construction evaluee."""

    surface_au_sol: float
    surface_habitable: float
    hauteur: float
    emprise: float
    niveaux: int


@dataclass
class Batiment:
    """Caracteristiques du batiment."""

    type: str
    materiaux: str
    niveaux: int


@dataclass
class ProjectContext:
    """Contexte complet d'un projet de construction."""

    parcelle: Parcelle
    plu: PLU
    variante: Variante
    batiment: Batiment
    project_type: str
    commune_code: str = ""
