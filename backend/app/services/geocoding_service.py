GEOCODE_MOCK = {
    "12 rue de la Paix, Tremblay-en-France": {
        "address": "12 rue de la Paix, 93290 Tremblay-en-France",
        "coordinates": {"lat": 48.9896, "lng": 2.5701},
        "parcelle": {
            "cadastre_id": "93073-000-AB-0123",
            "section": "AB",
            "numero": "0123",
            "surface": 750.0,
            "geometry": {"type": "Point", "coordinates": [2.5701, 48.9896]},
        },
        "commune": {"code": "93073", "name": "Tremblay-en-France"},
    }
}


def geocode_address(address: str) -> dict:
    """Mock geocodage -- retourne les coordonnees et parcelle."""
    return GEOCODE_MOCK.get(
        address, GEOCODE_MOCK["12 rue de la Paix, Tremblay-en-France"]
    )
