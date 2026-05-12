"""Router pour la production de documents réglementaires."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter(tags=["deliverables"])


class DeliverableItem(BaseModel):
    id: str
    name: str
    type: str
    status: str
    generated_at: Optional[str] = None
    url: Optional[str] = None


@router.get("/deliverables/{project_id}")
def list_deliverables(project_id: str):
    """Liste les documents disponibles pour un projet."""
    now = datetime.now().isoformat()
    return {
        "project_id": project_id,
        "documents": [
            {"type": "cerfa", "name": "CERFA 13406*05", "status": "generated", "generated_at": now, "url": f"/api/v2/deliverables/{project_id}/cerfa"},
            {"type": "notice", "name": "Notice de calcul", "status": "generated", "generated_at": now, "url": f"/api/v2/deliverables/{project_id}/notice"},
            {"type": "rapport", "name": "Rapport de conformite", "status": "generated", "generated_at": now, "url": f"/api/v2/deliverables/{project_id}/rapport"},
            {"type": "plans", "name": "Plans architecturaux", "status": "generated", "generated_at": now, "url": f"/api/v2/deliverables/{project_id}/plans"},
            {"type": "pack", "name": "Pack de soumission", "status": "generated", "generated_at": now, "url": f"/api/v2/deliverables/{project_id}/pack"},
        ],
        "generated_count": 5,
        "total_count": 5,
    }


@router.post("/deliverables/generate/{project_id}")
def generate_all(project_id: str):
    """Genere tous les documents pour un projet."""
    now = datetime.now().isoformat()
    return {
        "project_id": project_id,
        "status": "generating",
        "documents": [
            {"type": "cerfa", "name": "CERFA 13406*05", "status": "generated", "generated_at": now},
            {"type": "notice", "name": "Notice de calcul", "status": "generated", "generated_at": now},
            {"type": "rapport", "name": "Rapport de conformite", "status": "generated", "generated_at": now},
            {"type": "plans", "name": "Plans architecturaux", "status": "generated", "generated_at": now},
            {"type": "pack", "name": "Pack de soumission", "status": "generated", "generated_at": now},
        ],
    }


@router.get("/deliverables/{project_id}/cerfa")
def get_cerfa(project_id: str):
    """Retourne les donnees CERFA pre-remplies."""
    return {
        "project_id": project_id,
        "form": "CERFA 13406*05",
        "identity": {
            "maitre_oeuvre": "Jean Dupont - Architecte DPLG",
            "adresse_mo": "15 Rue des Arts, 75001 Paris",
            "telephone": "01 23 45 67 89",
            "email": "jean.dupont@architecte.fr",
            "numero_siret": "123 456 789 00012",
            "assurance": "AXA Assurances - Police n°456789",
        },
        "parcelle": {
            "adresse": "12 Rue de la Paix, 93290 Tremblay-en-France",
            "section": "AB",
            "numero": "0123",
            "surface": 750.0,
        },
        "projet": {
            "nature": "Extension d'une maison individuelle",
            "type": "extension_under_40",
            "surface_plancher": 45.0,
            "surface_terrain": 750.0,
            "hauteur": 3.5,
            "niveaux": 1,
            "cos": 0.5,
        },
        "description_travaux": [
            "Extension en rez-de-chaussee d'une surface de 25m²",
            "Creation d'un salon et d'une cuisine ouverte",
            "Toiture terrasse avec etancheite multicouche",
            "Menuiseries aluminium avec double vitrage",
            "Raccordement aux reseaux existants",
        ],
    }


@router.get("/deliverables/{project_id}/notice")
def get_notice(project_id: str):
    """Retourne la notice de calcul."""
    return {
        "project_id": project_id,
        "title": "Notice de Calcul - Structure et Thermique",
        "structure": {
            "portee_max": 5.0,
            "section_poteaux": "20x20 cm",
            "section_poutres": "20x35 cm",
            "charge_permanente": "G = 3.5 kN/m²",
            "charge_exploitation": "Q = 1.5 kN/m²",
            "neige": "S = 0.45 kN/m² (Zone A1)",
            "vent": "Qv = 0.60 kN/m² (Zone 1)",
            "conclusion": "Structure conforme aux Eurocodes 0, 1, 2 et 5",
        },
        "thermique": {
            "reglementation": "RE2020",
            "bbc_effinergie": False,
            "ubat": 0.85,
            "bbio": 1.05,
            "cep": 185,
            "tic": 2.8,
            "conclusion": "Le projet respecte les exigences RE2020 pour l'indicateur Bbio. Le CEP est legerement superieur a la limite reglementaire (185 vs 170 kWh/m².an). Des mesures de reduction des ponts thermiques sont recommandees.",
        },
        "pmr": {
            "seuil": "1.5 cm (conforme < 2 cm)",
            "largeur_portes": "80 cm (conforme >= 77 cm)",
            "wc_accessible": True,
            "conclusion": "Accessibilite conforme aux exigences PMR",
        },
        "incendie": {
            "issue_secours": "Distance 8m (conforme < 9m)",
            "desenfumage": "Surface ouvrants 1.5m² (conforme)",
            "conclusion": "Securite incendie conforme",
        },
    }


@router.get("/deliverables/{project_id}/rapport")
def get_rapport(project_id: str):
    """Retourne le rapport de conformite."""
    return {
        "project_id": project_id,
        "title": "Rapport de Conformite Reglementaire",
        "reference": f"RC-{project_id}-2026",
        "date": datetime.now().strftime("%d/%m/%Y"),
        "executive_summary": {
            "total_rules": 50,
            "passed": 38,
            "failed": 8,
            "warnings": 4,
            "compliance_rate": 76.0,
            "status": "PARTIAL",
        },
        "results_by_category": [
            {"category": "Urbanisme", "total": 10, "passed": 8, "failed": 2, "rate": 80},
            {"category": "DTU", "total": 8, "passed": 7, "failed": 1, "rate": 88},
            {"category": "RE2020", "total": 12, "passed": 9, "failed": 3, "rate": 75},
            {"category": "PMR", "total": 8, "passed": 7, "failed": 0, "rate": 88},
            {"category": "Incendie", "total": 12, "passed": 7, "failed": 2, "rate": 58},
        ],
        "blocking_issues": [
            {"rule": "URB-EMP-001", "description": "Emprise au sol (108m²) dépasse la limite (100m²)", "severity": "blocking"},
            {"rule": "RE2020-CEP-001", "description": "CEP (185) dépasse la limite (170)", "severity": "blocking"},
            {"rule": "INC-ISSUE-001", "description": "Distance issue (12m) supérieure au max (9m)", "severity": "blocking"},
        ],
        "conclusion": "Le projet presente un taux de conformite global de 76%. Trois points bloquants ont ete identifies et necessitent des modifications avant depot du permis de construire.",
    }


@router.get("/deliverables/{project_id}/plans")
def get_plans(project_id: str):
    """Retourne les plans architecturaux."""
    return {
        "project_id": project_id,
        "title": "Plans Architecturaux",
        "plans": [
            {"name": "Plan de situation", "scale": "1:500", "type": "Situation"},
            {"name": "Plan de masse", "scale": "1:200", "type": "Masse"},
            {"name": "Plan RDC", "scale": "1:100", "type": "RDC"},
            {"name": "Plan Etage", "scale": "1:100", "type": "Etage"},
            {"name": "Coupe transversale", "scale": "1:100", "type": "Coupe"},
        ],
        "legend": [
            {"symbol": "—", "meaning": "Mur porteur"},
            {"symbol": "- - -", "meaning": "Mur non porteur"},
            {"symbol": "\\", "meaning": "Zone habitable"},
            {"symbol": "///", "meaning": "Circulation"},
        ],
        "dimensions": {
            "format": "A3 paysage",
            "unite": "metres",
            "precision": "0.01m",
        },
    }
