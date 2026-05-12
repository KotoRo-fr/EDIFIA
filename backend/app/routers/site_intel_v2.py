"""Router Site Intelligence v2 - API de donnees terrain EDIFIA.

Integre les API geospatiales francaises officielles :
- API BAN (Base Adresse Nationale) : geocodage
- API Carto IGN : parcelles cadastrales
- API Géorisques : risques naturels et technologiques
- Donnees PLU : regles d'urbanisme par commune
"""

import logging
import os
from typing import Any, Dict, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

# Import du service geo (avec fallback si indisponible)
try:
    from services.geo_service import (
        geocode_address_ban,
        get_cadastre_parcels,
        get_full_site_intel,
        get_plu_rules,
        get_risques_georisques,
    )
    GEO_SERVICE_AVAILABLE = True
except ImportError:
    try:
        from app.services.geo_service import (
            geocode_address_ban,
            get_cadastre_parcels,
            get_full_site_intel,
            get_plu_rules,
            get_risques_georisques,
        )
        GEO_SERVICE_AVAILABLE = True
    except ImportError:
        GEO_SERVICE_AVAILABLE = False

logger = logging.getLogger(__name__)
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
    gaspar: list
    pprn: Optional[str] = None
    sismicite: str


class SiteIntelResponse(BaseModel):
    project_id: str
    parcelle: Parcelle
    plu: PLUData
    risques: Risques
    dvf: Optional[Dict[str, Any]] = None


# ---------------------------------------------------------------------------
# Donnees de demo — commune pilote Tremblay-en-France
# ---------------------------------------------------------------------------

_DEFAULT_ADDRESS = "12 rue de la Paix, Tremblay-en-France"
_DEFAULT_INSEE = "93073"
_DEFAULT_COORDS = {"lat": 48.9896, "lng": 2.5701}

_DEMO_PARCELLE = Parcelle(
    cadastre_id="93073-AB-0123",
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
)

_PLU_DATA_DEMO = {
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


def _extract_insee_from_project_id(project_id: str) -> str:
    """Extrait le code INSEE du project_id s'il est present."""
    for code in _PLU_DATA_DEMO:
        if code in project_id:
            return code
    return _DEFAULT_INSEE


def _build_parcelle_from_geo(geo_data: Dict[str, Any]) -> Parcelle:
    """Construit un objet Parcelle depuis les donnees geo_service."""
    p = geo_data.get("parcelle", {})
    return Parcelle(
        cadastre_id=p.get("cadastre_id", "93073-AB-0123"),
        section=p.get("section", "AB"),
        numero=p.get("numero", "0123"),
        surface=float(p.get("surface", 750.0)),
        geometry=p.get("geometry", _DEMO_PARCELLE.geometry),
    )


def _build_plu_from_geo(geo_data: Dict[str, Any]) -> PLUData:
    """Construit un objet PLUData depuis les donnees geo_service."""
    plu = geo_data.get("plu", {})
    return PLUData(
        zone=plu.get("zone", "U"),
        cos=float(plu.get("cos", 0.5)),
        hauteur_max=float(plu.get("hauteur_max", 12.0)),
        reculs_voirie=float(plu.get("recul_voie", plu.get("reculs_voirie", 3.0))),
        reculs_limitrophe=float(plu.get("recul_lateral", plu.get("reculs_limitrophe", 1.5))),
        emprise_max=float(plu.get("emprise_max", 375.0)),
    )


def _build_risques_from_geo(geo_data: Dict[str, Any]) -> Risques:
    """Construit un objet Risques depuis les donnees geo_service."""
    risques = geo_data.get("risques", {})
    # Format gaspar : liste pour compatibilite ancienne API
    gaspar_data = risques.get("gaspar", {})
    gaspar_list = [gaspar_data.get("niveau", "vert")]
    sismicite = risques.get("sismicite", {})
    inondation = risques.get("inondation", {})
    pprn = "PPRN-93-01" if inondation.get("statut") == "zone" else None
    return Risques(
        gaspar=gaspar_list,
        pprn=pprn,
        sismicite=sismicite.get("libelle", "1 - très faible"),
    )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/geocode", response_model=GeocodeResponse)
def geocode_address(
    address: str = Query(..., description="Adresse a geocoder"),
    real: bool = Query(False, description="Utiliser l'API BAN (true) ou mock (false)"),
):
    """Geocode une adresse et retourne les coordonnees + parcelle cadastre.

    Si `real=true` (defaut), interroge l'API BAN (Base Adresse Nationale).
    Sinon retourne les donnees de demo pour Tremblay-en-France.
    """
    if real and GEO_SERVICE_AVAILABLE:
        try:
            geo = geocode_address_ban(address)
            if geo:
                insee = geo.get("insee_code", _DEFAULT_INSEE)
                city = geo.get("city", "Tremblay-en-France")
                # Essayer de recuperer le cadastre pour enrichir la parcelle
                cadastre = get_cadastre_parcels(insee)
                if cadastre.get("parcels"):
                    first = cadastre["parcels"][0]
                    parcelle = Parcelle(
                        cadastre_id=f"{insee}-{first.get('section', 'AB')}-{first.get('numero', '0123')}",
                        section=first.get("section", "AB"),
                        numero=first.get("numero", "0123"),
                        surface=float(first.get("contenance", 750.0)),
                        geometry=first.get("geometry", _DEMO_PARCELLE.geometry),
                    )
                else:
                    parcelle = _DEMO_PARCELLE
                return GeocodeResponse(
                    address=geo.get("address", address),
                    coordinates=Coordinates(
                        lat=geo["coordinates"]["lat"],
                        lng=geo["coordinates"]["lng"],
                    ),
                    parcelle=parcelle,
                    commune=Commune(
                        code=insee,
                        name=city,
                    ),
                )
        except Exception as exc:
            logger.warning("BAN geocoding failed for '%s': %s", address, exc)

    # Fallback demo — Tremblay-en-France
    return GeocodeResponse(
        address=f"{address}, {_COMMUNES[_DEFAULT_INSEE]}",
        coordinates=Coordinates(**_DEFAULT_COORDS),
        parcelle=_DEMO_PARCELLE,
        commune=Commune(code=_DEFAULT_INSEE, name=_COMMUNES[_DEFAULT_INSEE]),
    )


@router.get("/geocode/ban")
def geocode_ban_raw(
    address: str = Query(..., description="Adresse a geocoder"),
):
    """Geocodage brut via API BAN — retourne la reponse complete."""
    if not GEO_SERVICE_AVAILABLE:
        return {"error": "Service geo non disponible"}
    try:
        return geocode_address_ban(address)
    except Exception as exc:
        logger.warning("BAN raw geocoding failed: %s", exc)
        return {"error": str(exc)}


@router.get("/intel/{project_id}", response_model=SiteIntelResponse)
def get_site_intel(
    project_id: str,
    address: Optional[str] = Query(None, description="Adresse pour donnees reelles (optionnel)"),
    real: bool = Query(False, description="Activer les API reelles (defaut: mock — passer a true pour donnees reelles)"),
):
    """Retourne les donnees terrain agregees pour un projet.

    Si `address` est fourni et `real=true`, interroge les API BAN + Carto +
    Géorisques pour des donnees reelles. Sinon utilise les donnees de demo.
    """
    # Mode API reelles
    if real and address and GEO_SERVICE_AVAILABLE:
        try:
            intel = get_full_site_intel(address)
            if "error" in intel:
                logger.warning("get_full_site_intel error: %s", intel["error"])
            else:
                return SiteIntelResponse(
                    project_id=project_id,
                    parcelle=_build_parcelle_from_geo(intel),
                    plu=_build_plu_from_geo(intel),
                    risques=_build_risques_from_geo(intel),
                    dvf={"prix_m2_moyen": 3850.0, "prix_m2_med": 3600.0, "annee": 2025},
                )
        except Exception as exc:
            logger.warning("Real data failed for '%s': %s", address, exc)

    # Mode demo / fallback
    insee = _extract_insee_from_project_id(project_id)
    plu_data = _PLU_DATA_DEMO.get(insee, _DEFAULT_PLU)
    commune_name = _COMMUNES.get(insee, "Inconnue")

    return SiteIntelResponse(
        project_id=project_id,
        parcelle=_DEMO_PARCELLE,
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
    # Essayer geo_service d'abord
    if GEO_SERVICE_AVAILABLE:
        try:
            plu = get_plu_rules(commune_code)
            if plu:
                return PLUData(
                    zone=plu.get("zone", "U"),
                    cos=float(plu.get("cos", 0.5)),
                    hauteur_max=float(plu.get("hauteur_max", 12.0)),
                    reculs_voirie=float(plu.get("recul_voie", plu.get("reculs_voirie", 3.0))),
                    reculs_limitrophe=float(plu.get("recul_lateral", plu.get("reculs_limitrophe", 1.5))),
                    emprise_max=float(plu.get("emprise_max", 375.0)),
                )
        except Exception as exc:
            logger.warning("geo_service PLU failed for %s: %s", commune_code, exc)

    # Fallback demo
    plu = _PLU_DATA_DEMO.get(commune_code, _DEFAULT_PLU)
    return PLUData(**plu)


@router.get("/cadastre/{insee_code}")
def get_cadastre_commune(
    insee_code: str,
    section: Optional[str] = Query(None, description="Section cadastrale (filtrage)"),
    numero: Optional[str] = Query(None, description="Numero de parcelle (filtrage)"),
):
    """Retourne les parcelles cadastrales d'une commune via API Carto IGN."""
    if not GEO_SERVICE_AVAILABLE:
        return {
            "type": "FeatureCollection",
            "total": 1,
            "features": [_DEMO_PARCELLE.geometry],
            "source": "demo",
        }
    try:
        result = get_cadastre_parcels(insee_code)
        features = []
        for p in result.get("parcels", []):
            geom = p.get("geometry")
            if not geom:
                continue
            if section and p.get("section") != section:
                continue
            if numero and p.get("numero") != numero:
                continue
            features.append({
                "type": "Feature",
                "properties": {
                    "section": p.get("section", ""),
                    "numero": p.get("numero", ""),
                    "contenance": p.get("contenance", 0),
                },
                "geometry": geom,
            })
        return {
            "type": "FeatureCollection",
            "total": len(features),
            "features": features,
            "source": "API Carto IGN" if features else "demo",
        }
    except Exception as exc:
        logger.warning("Cadastre failed for %s: %s", insee_code, exc)
        return {
            "type": "FeatureCollection",
            "total": 0,
            "features": [],
            "error": str(exc),
            "source": "error",
        }


@router.get("/risques/{insee_code}")
def get_risques_commune(insee_code: str):
    """Retourne les risques pour une commune via API Géorisques."""
    if not GEO_SERVICE_AVAILABLE:
        return {
            "gaspar": {"niveau": "vert", "libelle": "Aucun risque identifie"},
            "sismicite": {"zone": "1", "libelle": "Zone 1 (faible)"},
            "inondation": {"statut": "hors_zone", "libelle": "Hors zone inondable"},
            "radon": {"classe": "2", "libelle": "Categorie 2"},
            "argile": {"risque": "faible", "libelle": "Risque faible"},
            "source": "demo",
        }
    try:
        return get_risques_georisques(insee_code)
    except Exception as exc:
        logger.warning("Risques failed for %s: %s", insee_code, exc)
        return {
            "gaspar": {"niveau": "vert", "libelle": "Aucun risque identifie"},
            "sismicite": {"zone": "1", "libelle": "Zone 1 (faible)"},
            "inondation": {"statut": "hors_zone", "libelle": "Hors zone inondable"},
            "radon": {"classe": "2", "libelle": "Categorie 2"},
            "argile": {"risque": "faible", "libelle": "Risque faible"},
            "error": str(exc),
        }
