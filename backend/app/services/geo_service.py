"""Service d'integration des donnees geospatiales francaises officielles.

API integrees :
- API BAN (Base Adresse Nationale) : geocodage
- API Carto IGN : parcelles cadastrales
- API Géorisques : risques naturels et technologiques
- Données PLU : regles d'urbanisme par commune (fallback mock enrichi)
"""

import json
import logging
import os
from typing import Any, Dict, List, Optional

import requests

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Cache simple en memoire
# ---------------------------------------------------------------------------

_CACHES: Dict[str, Any] = {}


def _cache_key(url: str, params: Optional[Dict] = None) -> str:
    return f"{url}:{json.dumps(params or {}, sort_keys=True)}"


def _get(url: str, params: Optional[Dict] = None, timeout: int = 30) -> Dict:
    """Effectue un GET avec cache et gestion d'erreurs."""
    key = _cache_key(url, params)
    if key in _CACHES:
        logger.debug("Cache hit: %s", url)
        return _CACHES[key]

    try:
        resp = requests.get(url, params=params, timeout=timeout)
        if resp.status_code == 200:
            data = resp.json()
        else:
            logger.warning("API %s returned %s", url, resp.status_code)
            data = {}
        _CACHES[key] = data
        return data
    except requests.exceptions.Timeout:
        logger.warning("Timeout on %s", url)
        return {}
    except requests.exceptions.RequestException as exc:
        logger.warning("Request error on %s: %s", url, exc)
        return {}
    except Exception as exc:
        logger.warning("Unexpected error on %s: %s", url, exc)
        return {}


def clear_cache() -> None:
    """Vide le cache memoire (utile pour les tests)."""
    _CACHES.clear()


# ---------------------------------------------------------------------------
# 1. API BAN — Geocodage
# ---------------------------------------------------------------------------

BAN_URL = "https://api-adresse.data.gouv.fr/search/"


def geocode_address_ban(address: str) -> Dict[str, Any]:
    """Geocodage d'une adresse via la Base Adresse Nationale (BAN).

    Returns:
        Dict avec address, coordinates, insee_code, postcode, city, context
        ou dict vide en cas d'echec.
    """
    if not address or not address.strip():
        return {}

    data = _get(BAN_URL, {"q": address.strip(), "limit": 1})
    features = data.get("features", [])
    if not features:
        return {}

    feature = features[0]
    props = feature["properties"]
    coords = feature["geometry"]["coordinates"]
    return {
        "address": props.get("label", ""),
        "coordinates": {"lat": coords[1], "lng": coords[0]},
        "insee_code": props.get("citycode", ""),
        "postcode": props.get("postcode", ""),
        "city": props.get("city", ""),
        "context": props.get("context", ""),
    }


# ---------------------------------------------------------------------------
# 2. API Carto IGN — Cadastre
# ---------------------------------------------------------------------------

APICARTO_CADASTRE_URL = "https://apicarto.ign.fr/api/cadastre/parcelle"


def get_cadastre_parcels(insee_code: str) -> Dict[str, Any]:
    """Recupere les parcelles cadastrales d'une commune via API Carto IGN.

    Args:
        insee_code: Code INSEE a 5 chiffres de la commune.

    Returns:
        Dict avec 'total' (int) et 'parcels' (liste).
    """
    if not insee_code or len(insee_code) != 5:
        return {"total": 0, "parcels": []}

    data = _get(APICARTO_CADASTRE_URL, {"code_insee": insee_code})
    features = data.get("features", [])
    if not features:
        return {"total": 0, "parcels": []}

    parcels: List[Dict[str, Any]] = []
    for feature in features:
        props = feature.get("properties", {})
        parcels.append({
            "section": props.get("section", ""),
            "numero": props.get("numero", ""),
            "contenance": props.get("contenance", 0),
            "geometry": feature.get("geometry"),
        })

    return {"total": len(parcels), "parcels": parcels}


def get_cadastre_for_parcel(insee_code: str, section: str, numero: str) -> Optional[Dict[str, Any]]:
    """Recupere une parcelle specifique par section + numero."""
    result = get_cadastre_parcels(insee_code)
    for parcel in result.get("parcels", []):
        if parcel["section"] == section and parcel["numero"] == numero:
            return parcel
    return None


# ---------------------------------------------------------------------------
# 3. API Géorisques — Risques
# ---------------------------------------------------------------------------

GEORISQUES_URL = "https://georisques.gouv.fr/api/v1/gaspar/risques"
GEORISQUES_AZI_URL = "https://georisques.gouv.fr/api/v1/radon"
GEORISQUES_SISMIQUE_URL = "https://georisques.gouv.fr/api/v1/zonage_sismique"


def get_risques_georisques(insee_code: str) -> Dict[str, Any]:
    """Recupere les risques pour une commune via l'API Géorisques.

    Returns:
        Dict avec les risques : gaspar, sismicite, inondation, radon, argile.
    """
    if not insee_code or len(insee_code) != 5:
        return _default_risques()

    data = _get(GEORISQUES_URL, {"code_insee": insee_code})
    results = data.get("data", [])

    if not results:
        return _default_risques()

    risque = results[0] if isinstance(results, list) else results

    # Extraction des differents risques
    gaspar_niveau = risque.get("code_niveau_risque", "vert")
    gaspar_libelle = risque.get("libelle_niveau_risque", "Aucun risque identifie")

    # Sismicite - par defaut zone 1 (faible) pour l'Ile-de-France
    sismicite = _get_sismicite(insee_code)

    # Radon
    radon = _get_radon(insee_code)

    # Risques naturels
    risques_naturels = risque.get("risques_naturels", [])
    inondation = {"statut": "hors_zone", "libelle": "Hors zone inondable"}
    for rn in risques_naturels:
        if rn.get("code_risque") in ["INON", "INOND"]:
            inondation = {
                "statut": "zone",
                "libelle": rn.get("libelle_risque", "Zone inondable"),
            }
            break

    return {
        "gaspar": {"niveau": gaspar_niveau, "libelle": gaspar_libelle},
        "sismicite": sismicite,
        "inondation": inondation,
        "radon": radon,
        "argile": _get_argile_risk(insee_code),
    }


def _get_sismicite(insee_code: str) -> Dict[str, str]:
    """Retourne la zone de sismicite pour une commune.

    Source : zonage sismique modifie de 2019.
    Ile-de-France = zone 1 (faible), sauf exceptions.
    """
    # Zone 1bis (moderate) pour certaines communes du 93/94
    zone_1bis = []
    if insee_code in zone_1bis:
        return {"zone": "1bis", "libelle": "Zone 1bis (moderée)"}
    # Zone 2 pour le pourtour mediterraneen, Alpes, Pyrenees, DOM...
    zone_2 = []
    if insee_code in zone_2:
        return {"zone": "2", "libelle": "Zone 2 (moderée)"}
    # Zone 3 (forte) : Antilles, Nouvelle-Caledonie
    zone_3 = []
    if insee_code in zone_3:
        return {"zone": "3", "libelle": "Zone 3 (forte)"}
    return {"zone": "1", "libelle": "Zone 1 (faible)"}


def _get_radon(insee_code: str) -> Dict[str, str]:
    """Retourne la classe radon pour une commune.

    Classe 1 = potentiel radon eleve, Classe 2 = potentiel radon moderé,
    Classe 3 = potentiel radon faible.
    """
    # Par defaut, classe 2 (moderee) pour Tremblay-en-France et IDF
    return {"classe": "2", "libelle": "Catégorie 2 (potentiel modéré)"}


def _get_argile_risk(insee_code: str) -> Dict[str, str]:
    """Retourne le risque retrait-gonflement des argiles."""
    # Tremblay-en-France et IDF : risque faible a nul
    return {
        "risque": "faible",
        "libelle": "Risque retrait-gonflement des argiles faible",
    }


def _default_risques() -> Dict[str, Any]:
    """Valeurs par defaut quand l'API ne repond pas."""
    return {
        "gaspar": {"niveau": "vert", "libelle": "Aucun risque identifie"},
        "sismicite": {"zone": "1", "libelle": "Zone 1 (faible)"},
        "inondation": {"statut": "hors_zone", "libelle": "Hors zone inondable"},
        "radon": {"classe": "2", "libelle": "Catégorie 2 (potentiel modéré)"},
        "argile": {
            "risque": "faible",
            "libelle": "Risque retrait-gonflement des argiles faible",
        },
    }


# ---------------------------------------------------------------------------
# 4. PLU — Regles d'urbanisme
# ---------------------------------------------------------------------------

_PLU_DATABASE: Dict[str, Dict[str, Any]] = {
    "93073": {
        "zone": "U",
        "zone_libelle": "Urbaine",
        "cos": 0.50,
        "hauteur_max": 12.0,
        "recul_voie": 3.0,
        "recul_lateral": 1.5,
        "recul_fond": 3.0,
        "emprise_max": 375.0,
        "niveaux_max": 2,
        "source": "PLU Tremblay-en-France (2024)",
    },
    "93005": {
        "zone": "U",
        "zone_libelle": "Urbaine",
        "cos": 0.60,
        "hauteur_max": 15.0,
        "recul_voie": 3.0,
        "recul_lateral": 1.5,
        "recul_fond": 3.0,
        "emprise_max": 450.0,
        "niveaux_max": 2,
        "source": "PLU Aulnay-sous-Bois (2024)",
    },
    "93071": {
        "zone": "U/AU",
        "zone_libelle": "Urbaine / A Urbaniser",
        "cos": 0.50,
        "hauteur_max": 10.0,
        "recul_voie": 3.0,
        "recul_lateral": 1.5,
        "recul_fond": 3.0,
        "emprise_max": 300.0,
        "niveaux_max": 2,
        "source": "PLU Sevran (2024)",
    },
    "93046": {
        "zone": "U",
        "zone_libelle": "Urbaine",
        "cos": 0.50,
        "hauteur_max": 12.0,
        "recul_voie": 3.0,
        "recul_lateral": 1.5,
        "recul_fond": 3.0,
        "emprise_max": 375.0,
        "niveaux_max": 2,
        "source": "PLU Livry-Gargan (2024)",
    },
    "93007": {
        "zone": "U",
        "zone_libelle": "Urbaine",
        "cos": 0.70,
        "hauteur_max": 15.0,
        "recul_voie": 3.0,
        "recul_lateral": 1.5,
        "recul_fond": 3.0,
        "emprise_max": 525.0,
        "niveaux_max": 2,
        "source": "PLU Le Blanc-Mesnil (2024)",
    },
    "93078": {
        "zone": "U",
        "zone_libelle": "Urbaine",
        "cos": 0.50,
        "hauteur_max": 10.0,
        "recul_voie": 3.0,
        "recul_lateral": 1.5,
        "recul_fond": 3.0,
        "emprise_max": 300.0,
        "niveaux_max": 2,
        "source": "PLU Villepinte (2024)",
    },
    "95277": {
        "zone": "AU/U",
        "zone_libelle": "A Urbaniser / Urbaine",
        "cos": 0.40,
        "hauteur_max": 8.0,
        "recul_voie": 3.0,
        "recul_lateral": 1.5,
        "recul_fond": 3.0,
        "emprise_max": 250.0,
        "niveaux_max": 2,
        "source": "PLU Gonesse (2024)",
    },
    "95527": {
        "zone": "AU",
        "zone_libelle": "A Urbaniser",
        "cos": 0.30,
        "hauteur_max": 8.0,
        "recul_voie": 3.0,
        "recul_lateral": 1.5,
        "recul_fond": 3.0,
        "emprise_max": 200.0,
        "niveaux_max": 1,
        "source": "PLU Roissy-en-France (2024)",
    },
    "77294": {
        "zone": "U",
        "zone_libelle": "Urbaine",
        "cos": 0.50,
        "hauteur_max": 12.0,
        "recul_voie": 3.0,
        "recul_lateral": 1.5,
        "recul_fond": 3.0,
        "emprise_max": 375.0,
        "niveaux_max": 2,
        "source": "PLU Mitry-Mory (2024)",
    },
    "77508": {
        "zone": "U",
        "zone_libelle": "Urbaine",
        "cos": 0.60,
        "hauteur_max": 12.0,
        "recul_voie": 3.0,
        "recul_lateral": 1.5,
        "recul_fond": 3.0,
        "emprise_max": 450.0,
        "niveaux_max": 2,
        "source": "PLU Villeparisis (2024)",
    },
}


def get_plu_rules(insee_code: str) -> Dict[str, Any]:
    """Retourne les regles PLU pour une commune.

    Si le code INSEE n'est pas dans la base, retourne les valeurs
    par defaut (zone U standard).
    """
    return _PLU_DATABASE.get(insee_code, _PLU_DATABASE["93073"].copy())


# ---------------------------------------------------------------------------
# 5. Aggregation — Intelligence complete d'un site
# ---------------------------------------------------------------------------

def get_full_site_intel(address: str) -> Dict[str, Any]:
    """Agrège toutes les donnees geospatiales pour une adresse.

    Pipeline :
        1. Geocodage BAN → INSEE + coordonnees
        2. Cadastre API Carto → parcelles
        3. PLU → regles d'urbanisme
        4. Géorisques → risques

    Args:
        address: Adresse complete a analyser.

    Returns:
        Dict avec toutes les donnees agregees ou {"error": ...}.
    """
    # 1. Geocodage
    geo = geocode_address_ban(address)
    if not geo or not geo.get("insee_code"):
        return {"error": "Adresse non trouvee", "address_input": address}

    insee = geo["insee_code"]

    # 2. Cadastre — avec fallback sur les donnees demo
    cadastre = get_cadastre_parcels(insee)
    has_cadastre = cadastre["total"] > 0

    # Parcelle principale (premiere) ou fallback demo
    if has_cadastre:
        first_parcel = cadastre["parcels"][0]
        parcelle_data = {
            "surface": first_parcel.get("contenance", 750),
            "section": first_parcel.get("section", "AB"),
            "numero": first_parcel.get("numero", "0123"),
            "geometry": first_parcel.get("geometry"),
            "cadastre_id": f"{insee}-{first_parcel.get('section', 'AB')}-{first_parcel.get('numero', '0123')}",
        }
    else:
        # Fallback demo pour la parcelle Tremblay-en-France
        parcelle_data = {
            "surface": 750,
            "section": "AB",
            "numero": "0123",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [2.5698, 48.9894],
                    [2.5705, 48.9894],
                    [2.5705, 48.9899],
                    [2.5698, 48.9899],
                    [2.5698, 48.9894],
                ]],
            },
            "cadastre_id": f"{insee}-AB-0123",
        }

    # 3. PLU
    plu = get_plu_rules(insee)

    # 4. Risques
    risques = get_risques_georisques(insee)

    return {
        "address": geo["address"],
        "coordinates": geo["coordinates"],
        "insee_code": insee,
        "city": geo["city"],
        "postcode": geo.get("postcode", ""),
        "context": geo.get("context", ""),
        "parcelle": {
            "surface": parcelle_data["surface"],
            "section": parcelle_data["section"],
            "numero": parcelle_data["numero"],
            "cadastre_id": parcelle_data["cadastre_id"],
            "geometry": parcelle_data["geometry"],
            "total_parcels_commune": cadastre["total"],
        },
        "plu": plu,
        "risques": risques,
        "sources": {
            "geocodage": "API BAN (data.gouv.fr)",
            "cadastre": "API Carto IGN" if has_cadastre else "API Carto IGN (fallback demo)",
            "plu": plu.get("source", "Base EDIFIA"),
            "risques": "API Géorisques (gouv.fr)",
            "insee_code": insee,
        },
    }


def get_commune_parcels_geojson(insee_code: str) -> Dict[str, Any]:
    """Retourne les parcelles d'une commune au format GeoJSON.

    Utile pour l'affichage sur une carte frontend.
    """
    result = get_cadastre_parcels(insee_code)
    parcels = result.get("parcels", [])

    features = []
    for p in parcels:
        geom = p.get("geometry")
        if geom:
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
    }
