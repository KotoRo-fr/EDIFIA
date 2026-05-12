"""Router pour la conception generative (variants architecturaux)."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import random

router = APIRouter(prefix="/api/v2/design", tags=["design"])


class DesignGenerateRequest(BaseModel):
    strategy_count: int = 4


@router.post("/generate/{project_id}")
def generate_variants(project_id: str, request: DesignGenerateRequest):
    """Genere 2-4 variantes architecturales pour un projet."""
    strategies = [
        {"id": "A", "name": "Maximisation surface", "strategy": "max_surface", "description": "Maximise la surface habitable"},
        {"id": "B", "name": "Optimisation ensoleillement", "strategy": "max_sun", "description": "Priorise l'orientation sud/ouest"},
        {"id": "C", "name": "Minimisation cout", "strategy": "min_cost", "description": "Forme compacte, moins de murs"},
        {"id": "D", "name": "Esthetique", "strategy": "aesthetics", "description": "Proportions dorees"},
    ]

    selected = strategies[:min(request.strategy_count, 4)]
    variants = []

    for s in selected:
        if s["strategy"] == "max_surface":
            scores = {"surface": 95, "sunExposure": 70, "costEfficiency": 60, "aesthetics": 50, "overall": 72}
        elif s["strategy"] == "max_sun":
            scores = {"surface": 65, "sunExposure": 95, "costEfficiency": 70, "aesthetics": 65, "overall": 75}
        elif s["strategy"] == "min_cost":
            scores = {"surface": 70, "sunExposure": 60, "costEfficiency": 95, "aesthetics": 60, "overall": 73}
        else:
            scores = {"surface": 60, "sunExposure": 70, "costEfficiency": 55, "aesthetics": 95, "overall": 71}

        conformity = random.randint(65, 95)

        variants.append({
            "id": f"{project_id}-{s['id']}",
            "name": s["name"],
            "strategy": s["strategy"],
            "description": s["description"],
            "label": s["id"],
            "scores": scores,
            "conformityScore": conformity,
            "is_selected": False,
            "floor_plan": {
                "rooms": [
                    {"id": "r1", "name": "Salon", "type": "salon", "surface": 25, "x": 0, "y": 0, "width": 5, "height": 5},
                    {"id": "r2", "name": "Cuisine", "type": "cuisine", "surface": 10, "x": 5, "y": 0, "width": 3.3, "height": 3},
                ],
                "walls": [],
                "doors": [],
            },
        })

    return {
        "project_id": project_id,
        "variants": variants,
        "total": len(variants),
    }


@router.get("/{project_id}")
def list_variants(project_id: str):
    """Liste les variantes d'un projet."""
    return {
        "project_id": project_id,
        "variants": [],
        "total": 0,
    }


@router.post("/select/{project_id}/{variant_id}")
def select_variant(project_id: str, variant_id: str):
    """Selectionne une variante comme design retenu."""
    return {
        "project_id": project_id,
        "variant_id": variant_id,
        "selected": True,
    }
