"""Router Design v2 - API de conception generative EDIFIA."""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone

router = APIRouter(prefix="/api/v2/design", tags=["Design"])


# ---------------------------------------------------------------------------
# Modeles Pydantic
# ---------------------------------------------------------------------------

class GenerateVariantsRequest(BaseModel):
    strategy_count: Optional[int] = 4


# ---------------------------------------------------------------------------
# Strategies predefinies
# ---------------------------------------------------------------------------

_STRATEGIES = [
    {
        "strategy": "max_surface",
        "name": "Maximisation surface",
        "description": "Maximise la surface habitable au detriment des espaces communs.",
        "label": "Surface++",
    },
    {
        "strategy": "max_sun",
        "name": "Maximisation ensoleillement",
        "description": "Oriente toutes les pieces vers le sud pour maximiser l'ensoleillement.",
        "label": "Soleil++",
    },
    {
        "strategy": "min_cost",
        "name": "Minimisation cout",
        "description": "Optimise le cout de construction en reduisant les surfaces.",
        "label": "Cout--",
    },
    {
        "strategy": "aesthetics",
        "name": "Maximisation esthetique",
        "description": "Privilegie l'esthetique et l'harmonie des espaces.",
        "label": "Design++",
    },
]


def _build_floor_plan() -> Dict[str, Any]:
    """Construit un floor plan de demonstration."""
    return {
        "rooms": [
            {"id": "r1", "name": "Salon", "type": "salon", "surface": 25.0, "x": 0, "y": 0, "width": 5.0, "height": 5.0},
            {"id": "r2", "name": "Cuisine", "type": "cuisine", "surface": 10.0, "x": 5, "y": 0, "width": 3.33, "height": 3.0},
            {"id": "r3", "name": "Chambre", "type": "chambre", "surface": 12.0, "x": 0, "y": 5, "width": 3.46, "height": 3.46},
        ],
        "walls": [
            {"x1": 0, "y1": 0, "x2": 8.33, "y2": 0},
            {"x1": 8.33, "y1": 0, "x2": 8.33, "y2": 5},
            {"x1": 8.33, "y1": 5, "x2": 0, "y2": 5},
            {"x1": 0, "y1": 5, "x2": 0, "y2": 0},
        ],
        "doors": [
            {"x1": 5, "y1": 0, "x2": 6, "y2": 0},
        ],
    }


def _build_variant(strategy_idx: int, project_id: str) -> Dict[str, Any]:
    """Construit une variante selon la strategie."""
    strat = _STRATEGIES[strategy_idx % len(_STRATEGIES)]
    variant_id = f"{project_id}-v{strategy_idx + 1}"

    if strat["strategy"] == "max_surface":
        scores = {"surface": 95, "sunExposure": 70, "costEfficiency": 60, "aesthetics": 65, "overall": 75}
    elif strat["strategy"] == "max_sun":
        scores = {"surface": 65, "sunExposure": 95, "costEfficiency": 70, "aesthetics": 72, "overall": 78}
    elif strat["strategy"] == "min_cost":
        scores = {"surface": 60, "sunExposure": 65, "costEfficiency": 95, "aesthetics": 58, "overall": 72}
    elif strat["strategy"] == "aesthetics":
        scores = {"surface": 70, "sunExposure": 72, "costEfficiency": 55, "aesthetics": 95, "overall": 76}
    else:
        scores = {"surface": 75, "sunExposure": 75, "costEfficiency": 75, "aesthetics": 75, "overall": 75}

    # Conformity score entre 65 et 95
    base = hash(f"{project_id}-{strategy_idx}") % 1000
    conformity = 65 + (base % 31)

    return {
        "id": variant_id,
        "name": strat["name"],
        "strategy": strat["strategy"],
        "description": strat["description"],
        "label": strat["label"],
        "scores": scores,
        "conformityScore": conformity,
        "is_selected": False,
        "floor_plan": _build_floor_plan(),
    }


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/generate/{project_id}")
def generate_variants(project_id: str, body: GenerateVariantsRequest):
    """Genere des variantes de conception pour un projet."""
    count = min(body.strategy_count or 4, 4)

    variants = []
    for i in range(count):
        variants.append(_build_variant(i, project_id))

    return {
        "project_id": project_id,
        "total": count,
        "variants": variants,
    }


@router.get("/{project_id}")
def list_variants(project_id: str):
    """Liste les variantes de conception pour un projet."""
    return {
        "project_id": project_id,
        "total": 0,
        "variants": [],
    }


@router.post("/select/{project_id}/{variant_id}")
def select_variant(project_id: str, variant_id: str):
    """Selectionne une variante comme retenue pour le projet."""
    return {
        "project_id": project_id,
        "variant_id": variant_id,
        "selected": True,
    }
