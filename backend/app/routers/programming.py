"""Router pour la programmation architecturale."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/v2/programming", tags=["programming"])


class RoomInput(BaseModel):
    type: str
    surface: float
    orientation: Optional[str] = None
    priority: int = 1


class ProgrammingRequest(BaseModel):
    rooms: list[RoomInput]
    project_type: str = "extension_under_40"
    style: str = "moderne"


@router.post("/generate/{project_id}")
def generate_program(project_id: str, request: ProgrammingRequest):
    """Genere un programme architectural a partir du brief."""
    rooms = request.rooms
    total_cha = sum(r.surface for r in rooms)
    total_cao = total_cha * 1.18 if total_cha > 0 else 0.0
    circulation = total_cao - total_cha

    footprint_surface = total_cao * 1.2

    prices = {
        "extension_under_40_bois": (1800, 2500),
        "extension_under_40_traditionnelle": (2200, 3200),
    }
    key = f"{request.project_type}_{'bois' if request.style in ['moderne', 'contemporain'] else 'traditionnelle'}"
    price_min, price_max = prices.get(key, (2200, 3200))

    adjacency_rules = {
        "cuisine": ["salon", "sejour"],
        "chambre_parentale": ["salle_de_bain"],
        "salle_de_bain": ["chambre_parentale", "chambre"],
        "wc": ["couloir", "salle_de_bain"],
    }
    adjacencies = []
    for r in rooms:
        if r.type in adjacency_rules:
            for target_type in adjacency_rules[r.type]:
                target = next((t for t in rooms if t.type == target_type), None)
                if target:
                    adjacencies.append({"roomA": r.type, "roomB": target_type, "type": "direct"})

    sun_rules = {
        "salon": {"optimal": "Sud, Ouest", "acceptable": "Sud-Est, Sud-Ouest", "avoid": "Nord"},
        "sejour": {"optimal": "Sud, Ouest", "acceptable": "Sud-Est, Sud-Ouest", "avoid": "Nord"},
        "chambre": {"optimal": "Est", "acceptable": "Sud-Est, Nord-Est", "avoid": "Ouest"},
        "chambre_parentale": {"optimal": "Est, Sud", "acceptable": "Sud-Est", "avoid": "Nord"},
        "cuisine": {"optimal": "Nord, Est", "acceptable": "Nord-Est", "avoid": "Sud, Ouest"},
        "salle_de_bain": {"optimal": "Sud", "acceptable": "Sud-Est, Sud-Ouest", "avoid": "Nord"},
        "bureau": {"optimal": "Nord, Est", "acceptable": "Nord-Est, Nord-Ouest", "avoid": "Sud"},
    }
    sun_analysis = []
    for r in rooms:
        rule = sun_rules.get(r.type, {"optimal": "Sud", "acceptable": "Est, Ouest", "avoid": "Nord"})
        sun_analysis.append({"roomId": r.type, "roomType": r.type, **rule, "score": 80})

    return {
        "project_id": project_id,
        "status": "generated",
        "rooms_programmed": [
            {"type": r.type, "surface": r.surface, "orientation": r.orientation or "S", "priority": r.priority}
            for r in rooms
        ],
        "adjacency_graph": adjacencies,
        "footprint": {
            "surface": round(footprint_surface, 2),
            "cos": 0.5,
            "reculs": {"front": 3.0, "side": 1.5, "rear": 3.0},
            "buildableWidth": round((footprint_surface / 1.2) ** 0.5, 2) if footprint_surface > 0 else 0.0,
            "buildableDepth": round((footprint_surface / 1.2) ** 0.5 * 1.2, 2) if footprint_surface > 0 else 0.0,
        },
        "sun_analysis": sun_analysis,
        "budget_estimate": {
            "min": round(total_cha * price_min),
            "avg": round(total_cha * (price_min + price_max) / 2),
            "max": round(total_cha * price_max),
            "currency": "EUR",
        },
        "surfaces": {
            "CAO": round(total_cao, 2),
            "CHA": round(total_cha * 1.12, 2),
            "circulation": round(circulation, 2),
            "total": round(total_cao, 2),
        },
        "ratios": {
            "CHA_CAO": round((total_cha * 1.12 / total_cao) * 100) if total_cao > 0 else 0,
            "circulation_ratio": round((circulation / total_cha) * 100) if total_cha > 0 else 0,
        },
    }


@router.get("/{project_id}")
def get_program(project_id: str):
    """Recupere le programme d'un projet."""
    return {
        "project_id": project_id,
        "status": "generated",
        "rooms_programmed": [
            {"type": "salon", "surface": 25, "orientation": "S", "priority": 1},
            {"type": "cuisine", "surface": 10, "orientation": "N", "priority": 2},
        ],
        "adjacency_graph": [{"roomA": "cuisine", "roomB": "salon", "type": "direct"}],
        "footprint": {"surface": 50, "cos": 0.5, "reculs": {"front": 3, "side": 1.5, "rear": 3}},
        "sun_analysis": [],
        "budget_estimate": {"min": 50000, "avg": 75000, "max": 100000, "currency": "EUR"},
    }
