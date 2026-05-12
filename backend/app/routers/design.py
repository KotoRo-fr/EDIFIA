"""Router Design v2 - API de conception generative EDIFIA."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone

router = APIRouter(prefix="/api/v2/design", tags=["Design"])


# ---------------------------------------------------------------------------
# Modeles Pydantic
# ---------------------------------------------------------------------------

class GenerateVariantsRequest(BaseModel):
    strategy_count: Optional[int] = 4


class VariantScores(BaseModel):
    surface: float
    sunExposure: float
    costEfficiency: float
    aesthetics: float
    overall: float


class Variant(BaseModel):
    id: str
    name: str
    strategy: str
    scores: VariantScores
    conformityScore: float
    description: str


class GenerateVariantsResponse(BaseModel):
    project_id: str
    total: int
    variants: List[Variant]


# ---------------------------------------------------------------------------
# Strategies predefinies
# ---------------------------------------------------------------------------

_STRATEGIES = [
    {"id": "variant-A", "name": "Variante A - Max Surface", "strategy": "max_surface", "description": "Maximise la surface habitable"},
    {"id": "variant-B", "name": "Variante B - Max Ensoleillement", "strategy": "max_sun", "description": "Maximise l'exposition solaire"},
    {"id": "variant-C", "name": "Variante C - Min Cout", "strategy": "min_cost", "description": "Minimise le cout de construction"},
    {"id": "variant-D", "name": "Variante D - Esthetique", "strategy": "aesthetics", "description": "Privilegie l'esthetique architecturale"},
]


def _build_variant(strategy_idx: int, project_id: str) -> Variant:
    """Construit une variante selon la strategie."""
    strat = _STRATEGIES[strategy_idx % len(_STRATEGIES)]

    # Scores selon la strategie
    if strat["strategy"] == "max_surface":
        scores = VariantScores(surface=95.0, sunExposure=70.0, costEfficiency=75.0, aesthetics=60.0, overall=80.0)
    elif strat["strategy"] == "max_sun":
        scores = VariantScores(surface=70.0, sunExposure=95.0, costEfficiency=65.0, aesthetics=75.0, overall=78.0)
    elif strat["strategy"] == "min_cost":
        scores = VariantScores(surface=65.0, sunExposure=60.0, costEfficiency=95.0, aesthetics=55.0, overall=72.0)
    elif strat["strategy"] == "aesthetics":
        scores = VariantScores(surface=75.0, sunExposure=72.0, costEfficiency=60.0, aesthetics=95.0, overall=79.0)
    else:
        scores = VariantScores(surface=75.0, sunExposure=75.0, costEfficiency=75.0, aesthetics=75.0, overall=75.0)

    # Conformity score entre 0 et 100
    import random
    random.seed(hash(f"{project_id}-{strat['id']}") % 10000)
    conformity = round(random.uniform(75.0, 98.0), 1)

    return Variant(
        id=strat["id"],
        name=strat["name"],
        strategy=strat["strategy"],
        scores=scores,
        conformityScore=conformity,
        description=strat["description"],
    )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/generate/{project_id}", response_model=GenerateVariantsResponse)
def generate_variants(project_id: str, body: GenerateVariantsRequest):
    """Genere des variantes de conception pour un projet."""
    count = min(max(body.strategy_count or 4, 1), 8)

    variants = []
    for i in range(count):
        variant = _build_variant(i, project_id)
        # Si plus de 4 variantes, generer des IDs supplementaires
        if i >= 4:
            variant.id = f"variant-{chr(ord('A') + i)}"
            variant.name = f"Variante {chr(ord('A') + i)} - Personnalisee"
            variant.strategy = _STRATEGIES[i % 4]["strategy"]
            variant.description = f"Variante personnalisee {i + 1}"
        variants.append(variant)

    return GenerateVariantsResponse(
        project_id=project_id,
        total=count,
        variants=variants,
    )


@router.get("/{project_id}")
def list_variants(project_id: str):
    """Liste les variantes de conception pour un projet."""
    variants = []
    for i in range(4):
        variant = _build_variant(i, project_id)
        variants.append({
            "id": variant.id,
            "name": variant.name,
            "strategy": variant.strategy,
            "scores": variant.scores.model_dump(),
            "conformityScore": variant.conformityScore,
        })

    return {
        "project_id": project_id,
        "total": len(variants),
        "variants": variants,
    }


@router.post("/select/{project_id}/{variant_id}")
def select_variant(project_id: str, variant_id: str):
    """Selectionne une variante comme retenue pour le projet."""
    return {
        "project_id": project_id,
        "variant_id": variant_id,
        "selected": True,
        "selected_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
