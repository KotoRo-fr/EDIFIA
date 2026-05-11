"""Tests d'integration pour l'API Site Intelligence."""

import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "app"))
from main import app

client = TestClient(app)


class TestSiteIntelAPI:
    """Tests des endpoints Site Intelligence."""

    def test_geocode(self):
        """Le geocodage doit retourner coordonnees + parcelle + commune."""
        response = client.get("/api/v2/site/geocode?address=12+rue+de+la+Paix")
        assert response.status_code == 200
        data = response.json()
        assert "coordinates" in data
        assert "parcelle" in data
        assert "commune" in data
        assert "address" in data

    def test_geocode_coordinates_format(self):
        """Les coordonnees doivent avoir lat et lng."""
        response = client.get("/api/v2/site/geocode?address=12+rue+de+la+Paix")
        data = response.json()
        coords = data["coordinates"]
        assert "lat" in coords
        assert "lng" in coords
        assert isinstance(coords["lat"], float)
        assert isinstance(coords["lng"], float)

    def test_geocode_parcelle_fields(self):
        """La parcelle doit contenir les champs requis."""
        response = client.get("/api/v2/site/geocode?address=12+rue+de+la+Paix")
        data = response.json()
        parcelle = data["parcelle"]
        assert "cadastre_id" in parcelle
        assert "section" in parcelle
        assert "numero" in parcelle
        assert "surface" in parcelle

    def test_geocode_commune_fields(self):
        """La commune doit contenir code et name."""
        response = client.get("/api/v2/site/geocode?address=12+rue+de+la+Paix")
        data = response.json()
        commune = data["commune"]
        assert "code" in commune
        assert "name" in commune

    def test_get_site_intel(self):
        """Les donnees terrain doivent contenir parcelle + plu + risques."""
        response = client.get("/api/v2/site/intel/test-proj-1")
        assert response.status_code == 200
        data = response.json()
        assert "parcelle" in data
        assert "plu" in data
        assert "risques" in data

    def test_site_intel_parcelle_has_geometry(self):
        """La parcelle doit avoir une geometrie."""
        response = client.get("/api/v2/site/intel/test-proj-1")
        data = response.json()
        assert "geometry" in data["parcelle"]
        assert data["parcelle"]["geometry"]["type"] == "Polygon"

    def test_site_intel_plu_fields(self):
        """Le PLU doit contenir les champs requis."""
        response = client.get("/api/v2/site/intel/test-proj-1")
        data = response.json()
        plu = data["plu"]
        assert "zone" in plu
        assert "cos" in plu
        assert "hauteur_max" in plu
        assert "reculs_voirie" in plu
        assert "reculs_limitrophe" in plu
        assert "emprise_max" in plu

    def test_site_intel_risques_fields(self):
        """Les risques doivent contenir les champs requis."""
        response = client.get("/api/v2/site/intel/test-proj-1")
        data = response.json()
        risques = data["risques"]
        assert "gaspar" in risques
        assert "pprn" in risques
        assert "sismicite" in risques
        assert isinstance(risques["gaspar"], list)

    def test_get_plu(self):
        """Le PLU d'une commune connue doit retourner les donnees."""
        response = client.get("/api/v2/site/plu/93073")
        assert response.status_code == 200
        data = response.json()
        assert "zone" in data
        assert "cos" in data
        assert data["zone"] == "U"
        assert data["cos"] == 0.5

    def test_get_plu_93005(self):
        """Le PLU d'Aulnay-sous-Bois doit avoir les bonnes valeurs."""
        response = client.get("/api/v2/site/plu/93005")
        data = response.json()
        assert data["zone"] == "U"
        assert data["cos"] == 0.6
        assert data["hauteur_max"] == 15.0

    def test_get_plu_unknown_commune(self):
        """Une commune inconnue doit retourner le PLU par defaut (200)."""
        response = client.get("/api/v2/site/plu/99999")
        assert response.status_code == 200
        data = response.json()
        assert "zone" in data
        assert "cos" in data
        assert data["zone"] == "U"
        assert data["cos"] == 0.5

    def test_get_plu_all_10_communes(self):
        """Toutes les 10 communes pilotes doivent retourner des PLU."""
        codes = ["93073", "93005", "93071", "93046", "93007",
                 "93078", "95277", "95527", "77294", "77508"]
        for code in codes:
            response = client.get(f"/api/v2/site/plu/{code}")
            assert response.status_code == 200, f"PLU pour {code} a echoue"
            data = response.json()
            assert "zone" in data
            assert "cos" in data
            assert "hauteur_max" in data

    def test_geocode_address_with_special_chars(self):
        """Le geocodage doit gerer les caracteres speciaux."""
        response = client.get("/api/v2/site/geocode?address=12%20rue%20de%20l%27%C3%A9glise")
        assert response.status_code == 200

    def test_site_intel_contains_dvf(self):
        """Les donnees terrain doivent contenir les donnees DVF."""
        response = client.get("/api/v2/site/intel/test-proj-1")
        data = response.json()
        assert "dvf" in data
        assert data["dvf"] is not None

    def test_geocode_parcelle_surface_positive(self):
        """La surface de la parcelle doit etre positive."""
        response = client.get("/api/v2/site/geocode?address=test")
        data = response.json()
        assert data["parcelle"]["surface"] > 0

    def test_plu_cos_bounds(self):
        """Le COS doit etre entre 0 et 1."""
        codes = ["93073", "93005", "93071", "93046", "93007",
                 "93078", "95277", "95527", "77294", "77508"]
        for code in codes:
            response = client.get(f"/api/v2/site/plu/{code}")
            data = response.json()
            assert 0.0 <= data["cos"] <= 1.0, f"COS invalide pour {code}"

    def test_plu_hauteur_positive(self):
        """La hauteur max doit etre positive."""
        codes = ["93073", "93005", "93071", "93046", "93007",
                 "93078", "95277", "95527", "77294", "77508"]
        for code in codes:
            response = client.get(f"/api/v2/site/plu/{code}")
            data = response.json()
            assert data["hauteur_max"] > 0, f"Hauteur invalide pour {code}"
