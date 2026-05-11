def get_cadastre(lat: float, lng: float) -> dict:
    return {
        "cadastre_id": "93073-000-AB-0123",
        "section": "AB",
        "numero": "0123",
        "surface": 750.0,
    }


def get_risks(commune_code: str) -> dict:
    return {
        "gaspar": {"niveau": "vert", "libelle": "Aucun risque identifie"},
        "sismicite": {"zone": "1", "libelle": "Zone 1 (faible)"},
        "inondation": {"statut": "hors_zone", "libelle": "Hors zone inondable"},
        "radon": {"classe": "2", "libelle": "Categorie 2"},
        "argile": {"risque": "faible", "libelle": "Risque faible"},
    }
