"""Modeles de contexte projet pour l'evaluation."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Parcelle:
    surface: float
    zone: str
    cos_max: float
    height_max: float
    setbacks: dict[str, float] = field(default_factory=dict)


@dataclass
class PLU:
    zone: str
    cos_max: float
    height_max: float
    setbacks: dict[str, float] = field(default_factory=dict)


@dataclass
class Variante:
    surface_au_sol: float
    surface_habitable: float
    hauteur: float
    emprise: float
    niveaux: int


@dataclass
class Batiment:
    type: str
    materiaux: str
    niveaux: int


@dataclass
class ProjectContext:
    parcelle: Parcelle
    plu: PLU
    variante: Variante
    batiment: Batiment
    project_type: str
    commune_code: str = ""
