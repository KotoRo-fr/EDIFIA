"""Router Site Intelligence v2 - API de donnees terrain EDIFIA."""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

router = APIRouter(prefix="/api/v2/site", tags=["Site Intelligence"])


# ---------------------------------------------------------------------------
# Modeles Pydantic
# ---------------------------------------------------------------------------

class Coordinates(BaseModel):
    lat: float
    lng: float


class Parcelle(BaseModel):
    cadastre_id: str
    section: str
    numero: str
    surface: float
    geometry: Optional[Dict[str, Any]] = None


class Commune(BaseModel):
    code: str
    name: str


class GeocodeResponse(BaseModel):
    address: str
    coordinates: Coordinates
    parcelle: Parcelle
    commune: Commune


class PLUData(BaseModel):
    zone: str
    cos: float
    hauteur_max: float
    reculs_voirie: float
    reculs_limitrophe: float
    emprise_max: float


class Risques(BaseModel):
    gaspar: List[str]
    pprn: Optional[str]
    sismicite: str


class SiteIntelResponse(BaseModel):
    project_id: str
    parcelle: Parcelle
    plu: PLUData
    risques: Risques
    dvf: Optional[Dict[str, Any]] = None


# ---------------------------------------------------------------------------
# Donnees de demo - 10 communes pilotes
# ---------------------------------------------------------------------------

_PLU_DATA = {
    "93073": {"zone": "U", "cos": 0.5, "hauteur_max": 12.0, "reculs_voirie": 3.0, "reculs_limitrophe": 1.5, "emprise_max": 375.0},
    "93005": {"zone": "U", "cos": 0.6, "hauteur_max": 15.0, "reculs_voirie": 3.0, "reculs_limitrophe": 1.5, "emprise_max": 450.0},
    "93071": {"zone": "U/AU", "cos": 0.5, "hauteur_max": 10.0, "reculs_voirie": 3.0, "reculs_limitrophe": 1.5, "emprise_max": 300.0},
    "93046": {"zone": "U", "cos": 0.5, "hauteur_max": 12.0, "reculs_voirie": 3.0, "reculs_limitrophe": 1.5, "emprise_max": 375.0},
    "93007": {"zone": "U", "cos": 0.7, "hauteur_max": 15.0, "reculs_voirie": 3.0, "reculs_limitrophe": 1.5, "emprise_max": 525.0},
    "93078": {"zone": "U", "cos": 0.5, "hauteur_max": 10.0, "reculs_voirie": 3.0, "reculs_limitrophe": 1.5, "emprise_max": 300.0},
    "95277": {"zone": "AU/U", "cos": 0.4, "hauteur_max": 8.0, "reculs_voirie": 3.0, "reculs_limitrophe": 1.5, "emprise_max": 250.0},
    "95527": {"zone": "AU", "cos": 0.3, "hauteur_max": 8.0, "reculs_voirie": 3.0, "reculs_limitrophe": 1.5, "emprise_max": 200.0},
    "77294": {"zone": "U", "cos": 0.5, "hauteur_max": 12.0, "reculs_voirie": 3.0, "reculs_limitrophe": 1.5, "emprise_max": 375.0},
    "77508": {"zone": "U", "cos": 0.6, "hauteur_max": 12.0, "reculs_voirie": 3.0, "reculs_limitrophe": 1.5, "emprise_max": 450.0},
}

_COMMUNES = {
    "93073": "Tremblay-en-France",
    "93005": "Aulnay-sous-Bois",
    "93071": "Sevran",
    "93046": "Livry-Gargan",
    "93007": "Le Blanc-Mesnil",
    "93078": "Villepinte",
    "95277": "Gonesse",
    "95527": "Roissy-en-France",
    "77294": "Mitry-Mory",
    "77508": "Villeparisis",
}

_DEFAULT_PLU = {"zone": "U", "cos": 0.5, "hauteur_max": 12.0, "reculs_voirie": 3.0, "reculs_limitrophe": 1.5, "emprise_max": 375.0}


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/geocode", response_model=GeocodeResponse)
def geocode_address(address: str = Query(..., description="Adresse a geocoder")):
    """Geocode une adresse et retourne les coordonnees + parcelle cadastre."""
    # Mock BAN - on retourne Tremblay par defaut
    return GeocodeResponse(
        address=f"{address}, Tremblay-en-France",
        coordinates=Coordinates(lat=48.9896, lng=2.5701),
        parcelle=Parcelle(
            cadastre_id="93073-000-AB-0123",
            section="AB",
            numero="0123",
            surface=750.0,
            geometry={
                "type": "Polygon",
                "coordinates": [[
                    [2.5698, 48.9894],
                    [2.5705, 48.9894],
                    [2.5705, 48.9899],
                    [2.5698, 48.9899],
                    [2.5698, 48.9894],
                ]],
            },
        ),
        commune=Commune(code="93073", name="Tremblay-en-France"),
    )


@router.get("/intel/{project_id}", response_model=SiteIntelResponse)
def get_site_intel(project_id: str):
    """Retourne les donnees terrain agregees pour un projet."""
    # Extraire le code commune du project_id pour determiner la commune
    commune_code = "93073"  # default

    # Si project_id contient un code commune connu, l'utiliser
    for code in _PLU_DATA:
        if code in project_id:
            commune_code = code
            break

    plu_data = _PLU_DATA.get(commune_code, _DEFAULT_PLU)
    commune_name = _COMMUNES.get(commune_code, "Inconnue")

    return SiteIntelResponse(
        project_id=project_id,
        parcelle=Parcelle(
            cadastre_id=f"{commune_code}-000-AB-0123",
            section="AB",
            numero="0123",
            surface=750.0,
            geometry={
                "type": "Polygon",
                "coordinates": [[
                    [2.5698, 48.9894],
                    [2.5705, 48.9894],
                    [2.5705, 48.9899],
                    [2.5698, 48.9899],
                    [2.5698, 48.9894],
                ]],
            },
        ),
        plu=PLUData(**plu_data),
        risques=Risques(
            gaspar=["inondation", "secheresse"],
            pprn="PPRN-93-01",
            sismicite="1 - tres faible",
        ),
        dvf={"prix_m2_moyen": 3850.0, "prix_m2_med": 3600.0, "annee": 2025},
    )


@router.get("/plu/{commune_code}", response_model=PLUData)
def get_plu(commune_code: str):
    """Retourne les regles PLU pour une commune."""
    plu = _PLU_DATA.get(commune_code, _DEFAULT_PLU)
    return PLUData(**plu)
