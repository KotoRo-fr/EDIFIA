"""Router Programming v2 - API de programmation architecturale EDIFIA."""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone

router = APIRouter(prefix="/api/v2/programming", tags=["Programming"])


# ---------------------------------------------------------------------------
# Modeles Pydantic
# ---------------------------------------------------------------------------

class RoomInput(BaseModel):
    type: str
    surface: float
    orientation: Optional[str] = None
    priority: Optional[int] = None


class GenerateProgramRequest(BaseModel):
    rooms: List[RoomInput]
    project_type: Optional[str] = "extension_under_40"
    style: Optional[str] = "moderne"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _default_rooms() -> List[Dict[str, Any]]:
    return [
        {"type": "salon", "surface": 25, "orientation": "S"},
        {"type": "cuisine", "surface": 10, "orientation": "N"},
    ]


def _program_rooms(rooms: List[RoomInput], style: str) -> List[Dict[str, Any]]:
    """Programme les pieces avec dimensions recommandees."""
    if not rooms:
        return []

    programmed = []
    for room in rooms:
        width = (room.surface / 1.5) ** 0.5
        depth = room.surface / width
        programmed.append({
            "type": room.type,
            "surface": room.surface,
            "orientation": room.orientation or "S",
            "priority": room.priority,
            "recommended_dimensions": [round(width, 2), round(depth, 2)],
        })
    return programmed


def _compute_adjacencies(room_types: List[str]) -> List[Dict[str, str]]:
    """Calcule les adjacences recommandees entre pieces."""
    adjacencies = []
    if "cuisine" in room_types and "salon" in room_types:
        adjacencies.append({"roomA": "cuisine", "roomB": "salon", "type": "direct"})
    return adjacencies


def _compute_footprint(rooms: List[RoomInput], project_type: str) -> Dict[str, Any]:
    """Calcule l'empreinte au sol."""
    total_surface = sum(r.surface for r in rooms) if rooms else 35.0

    # Prix/m2 pour le COS
    price_map = {
        "extension_under_40": 0.5,
        "extension_over_40": 0.45,
        "new_build": 0.4,
        "renovation": 0.35,
    }
    cos = price_map.get(project_type, 0.5)

    width = (total_surface / 1.5) ** 0.5
    depth = total_surface / width if width > 0 else 10

    return {
        "surface": round(total_surface, 2),
        "cos": cos,
        "reculs": {
            "front": 3.0,
            "side": 1.5,
            "rear": 2.0,
        },
        "buildableWidth": round(width + 6, 2),  # + reculs
        "buildableDepth": round(depth + 5, 2),
    }


def _compute_sun_analysis(rooms: List[RoomInput]) -> List[Dict[str, Any]]:
    """Analyse l'ensoleillement piece par piece."""
    if not rooms:
        return []

    analysis = []
    for room in rooms:
        orientation = (room.orientation or "S").upper()
        if orientation in ("S", "SE", "SW"):
            score = 90.0
            optimal = "Sud"
            acceptable = "Sud-Est, Sud-Ouest"
            avoid = "Nord"
        elif orientation in ("E", "W"):
            score = 70.0
            optimal = orientation
            acceptable = "Sud-Est, Sud-Ouest" if orientation == "E" else "Sud-Ouest, Sud-Est"
            avoid = "Nord"
        else:
            score = 50.0
            optimal = "Sud"
            acceptable = "Est, Ouest"
            avoid = "Nord"

        analysis.append({
            "room_type": room.type,
            "optimal": optimal,
            "acceptable": acceptable,
            "avoid": avoid,
            "score": score,
        })
    return analysis


def _compute_budget(total_surface: float, style: str) -> Dict[str, Any]:
    """Estime le budget min/avg/max."""
    style_prices = {
        "moderne": 2500.0,
        "traditionnelle": 2200.0,
        "contemporain": 2800.0,
    }
    price = style_prices.get(style, 2500.0)
    avg = total_surface * price
    return {
        "currency": "EUR",
        "min": round(avg * 0.85, 2),
        "avg": round(avg, 2),
        "max": round(avg * 1.15, 2),
    }


def _compute_surfaces(rooms: List[RoomInput]) -> Dict[str, float]:
    """Calcule les surfaces (CAO, CHA, circulation)."""
    total_surface = sum(r.surface for r in rooms) if rooms else 35.0
    circulation = total_surface * 0.15
    cao = total_surface * 0.75  # Coefficient d'Occupation des Sols habitable
    cha = total_surface  # Surface habitable
    return {
        "CAO": round(cao, 2),
        "CHA": round(cha, 2),
        "circulation": round(circulation, 2),
        "total": round(total_surface + circulation, 2),
    }


def _compute_ratios(surfaces: Dict[str, float]) -> Dict[str, float]:
    """Calcule les ratios."""
    cha = surfaces.get("CHA", 35.0)
    cao = surfaces.get("CAO", 26.25)
    circulation = surfaces.get("circulation", 5.25)
    cha_cao = (cha / cao * 100) if cao > 0 else 100.0
    total = surfaces.get("total", cha + circulation)
    return {
        "CHA_CAO": round(min(cha_cao, 100), 2),
        "circulation_ratio": round(circulation / total * 100, 2) if total > 0 else 0,
    }


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/generate/{project_id}")
def generate_program(project_id: str, body: GenerateProgramRequest):
    """Genere un programme architectural pour un projet."""
    rooms = body.rooms if body.rooms else []
    style = body.style or "moderne"
    project_type = body.project_type or "extension_under_40"

    rooms_programmed = _program_rooms(rooms, style)
    adjacency_graph = _compute_adjacencies([r.type for r in rooms])
    footprint = _compute_footprint(rooms, project_type)
    sun_analysis = _compute_sun_analysis(rooms)

    total_surface = sum(r.surface for r in rooms)
    budget_estimate = _compute_budget(total_surface, style)
    surfaces = _compute_surfaces(rooms)
    ratios = _compute_ratios(surfaces)

    return {
        "project_id": project_id,
        "status": "generated",
        "rooms_programmed": rooms_programmed,
        "adjacency_graph": adjacency_graph,
        "footprint": footprint,
        "sun_analysis": sun_analysis,
        "budget_estimate": budget_estimate,
        "surfaces": surfaces,
        "ratios": ratios,
    }


@router.get("/{project_id}")
def get_program(project_id: str):
    """Retourne le programme architectural par defaut pour un projet."""
    rooms = _default_rooms()
    room_inputs = [RoomInput(**r) for r in rooms]

    rooms_programmed = _program_rooms(room_inputs, "moderne")
    adjacency_graph = _compute_adjacencies([r.type for r in room_inputs])
    footprint = _compute_footprint(room_inputs, "extension_under_40")
    sun_analysis = _compute_sun_analysis(room_inputs)
    budget_estimate = _compute_budget(35.0, "moderne")
    surfaces = _compute_surfaces(room_inputs)
    ratios = _compute_ratios(surfaces)

    return {
        "project_id": project_id,
        "status": "generated",
        "rooms_programmed": rooms_programmed,
        "adjacency_graph": adjacency_graph,
        "footprint": footprint,
        "sun_analysis": sun_analysis,
        "budget_estimate": budget_estimate,
        "surfaces": surfaces,
        "ratios": ratios,
    }
