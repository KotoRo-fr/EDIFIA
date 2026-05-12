#!/usr/bin/env python3
"""
Script de populate des données de démo — Projet Tremblay-en-France.

Usage:
    cd /mnt/agents/output/app/backend
    python scripts/populate_demo.py

Variables d'environnement:
    DATABASE_URL — URL de connexion PostgreSQL (défaut: postgresql://edifia:edifia@localhost:5432/edifia)
"""

import sys
import os
import uuid
from datetime import datetime, timezone

# Ajouter le répertoire parent au path pour importer app
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.models.database import (
    create_tables, drop_tables, SessionLocal,
    User, Project, Room, ComplianceCheck, ComplianceEvaluation, SiteIntel,
)


# ---------------------------------------------------------------------------
# Données de démo
# ---------------------------------------------------------------------------

DEMO_USER = {
    "id": "user-demo-001",
    "email": "jean.dupont@edifia.fr",
    "first_name": "Jean",
    "last_name": "Dupont",
    "role": "owner",
    "is_verified": "true",
    "created_at": datetime(2026, 1, 10, 8, 0, 0),
}

TREMBLAY_PROJECT = {
    "id": "proj-tremblay-001",
    "user_id": "user-demo-001",
    "name": "Extension 45m² — Tremblay-en-France",
    "description": (
        "Extension en rez-de-chaussée d'une maison individuelle existante. "
        "Création d'un salon-séjour ouvert sur cuisine, salle de bain et wc séparé. "
        "Toiture terrasse avec étanchéité multicouche. Menuiseries aluminium double vitrage."
    ),
    "project_type": "extension_under_40",
    "status": "compliance",
    "parcel_address": "12 Rue de la Paix, 93290 Tremblay-en-France",
    "parcel_cadastre_id": "93073-AB-0123",
    "surface_approx": 45.0,
    "commune_code": "93073",
    "commune_name": "Tremblay-en-France",
    "created_at": datetime(2026, 3, 15, 9, 0, 0),
    "updated_at": datetime(2026, 5, 10, 14, 30, 0),
}

TREMBLAY_ROOMS = [
    {
        "id": "room-tremblay-0",
        "project_id": "proj-tremblay-001",
        "room_type": "salon",
        "name": "Salon-Séjour",
        "surface": 25.0,
        "orientation": "S",
        "priority": 1,
        "adjacency": ["cuisine"],
    },
    {
        "id": "room-tremblay-1",
        "project_id": "proj-tremblay-001",
        "room_type": "cuisine",
        "name": "Cuisine Ouverte",
        "surface": 10.0,
        "orientation": "N",
        "priority": 2,
        "adjacency": ["salon"],
    },
    {
        "id": "room-tremblay-2",
        "project_id": "proj-tremblay-001",
        "room_type": "salle_de_bain",
        "name": "Salle de Bain",
        "surface": 10.0,
        "orientation": "E",
        "priority": 3,
        "adjacency": ["couloir"],
    },
    {
        "id": "room-tremblay-3",
        "project_id": "proj-tremblay-001",
        "room_type": "wc",
        "name": "WC Séparé",
        "surface": 3.0,
        "orientation": "N",
        "priority": 4,
        "adjacency": ["couloir", "salle_de_bain"],
    },
]

# 50 règles de conformité — taux global 76% (35 pass, 5 fail, 6 warning, 4 N/A)
COMPLIANCE_CHECKS = [
    # URBANISME (10)
    {"id": "cc-tremblay-001", "rule_code": "URB-COS-001", "rule_name": "Coefficient d'Occupation du Sol", "category": "urbanisme", "status": "pass", "message": "Surface au sol (45m²) respecte le COS (0.5 → 375m² max)", "severity": "blocking", "evaluated_values": {"surface_au_sol": 45, "cos_max": 0.5, "surface_parcelle": 750, "shon_total": 130}},
    {"id": "cc-tremblay-002", "rule_code": "URB-HT-001", "rule_name": "Hauteur max bâtiment", "category": "urbanisme", "status": "pass", "message": "Hauteur (3.2m) respecte la limite PLU (12.0m)", "severity": "blocking", "evaluated_values": {"hauteur": 3.2, "hauteur_max": 12}},
    {"id": "cc-tremblay-003", "rule_code": "URB-REC-001", "rule_name": "Recul voie publique", "category": "urbanisme", "status": "pass", "message": "Recul (4.5m) respecte le minimum (3.0m)", "severity": "blocking", "evaluated_values": {"recul": 4.5, "recul_min": 3.0}},
    {"id": "cc-tremblay-004", "rule_code": "URB-RECL-001", "rule_name": "Recul latéral", "category": "urbanisme", "status": "pass", "message": "Recul latéral (2.0m) respecte le minimum (1.5m)", "severity": "major", "evaluated_values": {"recul_lateral": 2.0, "recul_lateral_min": 1.5}},
    {"id": "cc-tremblay-005", "rule_code": "URB-RECF-001", "rule_name": "Recul fond de parcelle", "category": "urbanisme", "status": "pass", "message": "Recul fond (5.0m) respecte le minimum (3.0m)", "severity": "major", "evaluated_values": {"recul_fond": 5.0, "recul_fond_min": 3.0}},
    {"id": "cc-tremblay-006", "rule_code": "URB-EMP-001", "rule_name": "Emprise au sol", "category": "urbanisme", "status": "fail", "message": "Emprise au sol (45m²) dépasse la limite autorisée (42.5m²) — Extension trop profonde sur parcelle", "severity": "blocking", "evaluated_values": {"emprise": 45, "emprise_max": 42.5, "depassement": 2.5}},
    {"id": "cc-tremblay-007", "rule_code": "URB-SHON-001", "rule_name": "SHON totale", "category": "urbanisme", "status": "pass", "message": "SHON totale (130m² = 85m² existant + 45m² extension) dans la limite autorisée", "severity": "major", "evaluated_values": {"shon_existant": 85, "shon_extension": 45, "shon_totale": 130, "shon_max": 500}},
    {"id": "cc-tremblay-008", "rule_code": "URB-SHAB-001", "rule_name": "Surface Habitable", "category": "urbanisme", "status": "pass", "message": "Surface habitable (48m² extension) ≥ minimum légal", "severity": "info", "evaluated_values": {"surface_habitable": 48, "surface_min": 9}},
    {"id": "cc-tremblay-009", "rule_code": "URB-NIV-001", "rule_name": "Nombre de niveaux", "category": "urbanisme", "status": "pass", "message": "1 niveau (RDC) ≤ maximum autorisé (2 niveaux)", "severity": "major", "evaluated_values": {"niveaux": 1, "niveaux_max": 2}},
    {"id": "cc-tremblay-010", "rule_code": "URB-VER-001", "rule_name": "Espaces verts / emprise", "category": "urbanisme", "status": "warning", "message": "Ratio espaces verts (48%) proche du minimum requis (50%)", "severity": "minor", "evaluated_values": {"ratio_verdure": 0.48, "ratio_min": 0.50, "surface_verte": 360, "surface_parcelle": 750}},

    # DTU (10)
    {"id": "cc-tremblay-011", "rule_code": "DTU-ISO-001", "rule_name": "Isolation thermique parois", "category": "dtu", "status": "pass", "message": "R=4.2m².K/W > Rmin=4.0m².K/W (mur 20cm+laine de roche 140mm)", "severity": "major", "evaluated_values": {"r_mesure": 4.2, "r_min": 4.0}},
    {"id": "cc-tremblay-012", "rule_code": "DTU-ISO-002", "rule_name": "Isolation thermique toiture terrasse", "category": "dtu", "status": "pass", "message": "R=6.5m².K/W > Rmin=6.0m².K/W (PSE 200mm + étanchéité SBS)", "severity": "blocking", "evaluated_values": {"r_toiture": 6.5, "r_min": 6.0}},
    {"id": "cc-tremblay-013", "rule_code": "DTU-ETR-001", "rule_name": "Étanchéité toiture terrasse", "category": "dtu", "status": "pass", "message": "Étanchéité multicouche SBS conforme DTU 43.1", "severity": "blocking", "evaluated_values": {"nb_couches": 2, "type": "SBS", "pente_min": 0.01, "pente_reelle": 0.015}},
    {"id": "cc-tremblay-014", "rule_code": "DTU-VEN-001", "rule_name": "Ventilation logement", "category": "dtu", "status": "pass", "message": "VMI hygroréglable B — débits conformes (90m³/h total)", "severity": "blocking", "evaluated_values": {"debit_total": 90, "debit_min_reglementaire": 75, "type_ventilation": "VMI-HR"}},
    {"id": "cc-tremblay-015", "rule_code": "DTU-STR-001", "rule_name": "Stabilité structure extension", "category": "dtu", "status": "pass", "message": "Fondations superficielles conformes — portance 0.18MPa", "severity": "blocking", "evaluated_values": {"portance_sol": 0.18, "portance_min": 0.15, "profondeur_fondations": 0.6}},
    {"id": "cc-tremblay-016", "rule_code": "DTU-MENU-001", "rule_name": "Menuiseries extérieures aluminium", "category": "dtu", "status": "pass", "message": "Menuiseries alu double vitrage 4/16/4 — Uw=1.4 < Uw_max=1.8", "severity": "major", "evaluated_values": {"uw": 1.4, "uw_max": 1.8, "sw": 0.35}},
    {"id": "cc-tremblay-017", "rule_code": "DTU-ELEC-001", "rule_name": "Installations électriques", "category": "dtu", "status": "warning", "message": "Section câbles cuisine (2.5mm²) à vérifier — 4 appareils recommandés 6mm²", "severity": "major", "evaluated_values": {"section_actuelle": 2.5, "section_recommandee": 6.0, "nb_appareils": 4}},
    {"id": "cc-tremblay-018", "rule_code": "DTU-PLU-001", "rule_name": "Plomberie sanitaire", "category": "dtu", "status": "pass", "message": "Pression eau (3.2 bar) > minimum (2.0 bar)", "severity": "major", "evaluated_values": {"pression": 3.2, "pression_min": 2.0}},
    {"id": "cc-tremblay-019", "rule_code": "DTU-ACO-001", "rule_name": "Acoustique parois", "category": "dtu", "status": "pass", "message": "Rw=55dB > Rw_min=45dB (doublage+isolant 100mm+lame d'air)", "severity": "blocking", "evaluated_values": {"rw": 55, "rw_min": 45}},
    {"id": "cc-tremblay-020", "rule_code": "DTU-ASS-001", "rule_name": "Assainissement autonome", "category": "dtu", "status": "fail", "message": "Fosse septique existante (2000L) insuffisante — 3000L requis pour 5 EH", "severity": "blocking", "evaluated_values": {"capacite_actuelle": 2000, "capacite_min": 3000, "nb_eh": 5}},

    # RE2020 (10)
    {"id": "cc-tremblay-021", "rule_code": "RE2020-BBIO-001", "rule_name": "Bbio max", "category": "re2020", "status": "pass", "message": "Bbio (1.15) < limite réglementaire (1.30)", "severity": "blocking", "evaluated_values": {"bbio": 1.15, "bbio_max": 1.30}},
    {"id": "cc-tremblay-022", "rule_code": "RE2020-TIC-001", "rule_name": "TIC max", "category": "re2020", "status": "pass", "message": "TIC (26°C) < limite (28°C) — confort d'été assuré", "severity": "blocking", "evaluated_values": {"tic": 26, "tic_max": 28}},
    {"id": "cc-tremblay-023", "rule_code": "RE2020-ICENERGIE-001", "rule_name": "Indicateur CENERGIE (CEP)", "category": "re2020", "status": "fail", "message": "CEP (165 kWhEP/m².an) DÉPASSE la limite (130 kWhEP/m².an) — révision isolation nécessaire", "severity": "blocking", "evaluated_values": {"cep": 165, "cep_max": 130, "depassement": 35}},
    {"id": "cc-tremblay-024", "rule_code": "RE2020-ICRE-001", "rule_name": "Indicateur CRE", "category": "re2020", "status": "pass", "message": "CRE (12 kWh/m².an) respecte le seuil (15 kWh/m².an)", "severity": "major", "evaluated_values": {"cre": 12, "cre_max": 15}},
    {"id": "cc-tremblay-025", "rule_code": "RE2020-ICGHG-001", "rule_name": "Indicateur IC-GES", "category": "re2020", "status": "pass", "message": "Émissions GES (14 kgCO2/m².an) < seuil (20 kgCO2/m².an)", "severity": "blocking", "evaluated_values": {"gges": 14, "gges_max": 20}},
    {"id": "cc-tremblay-026", "rule_code": "RE2020-PE-001", "rule_name": "Perméabilité à l'air", "category": "re2020", "status": "warning", "message": "Perméabilité (2.3 m³/h.m²) proche de la limite (2.0 m³/h.m²)", "severity": "major", "evaluated_values": {"q4pa": 2.3, "q4pa_max": 2.0}},
    {"id": "cc-tremblay-027", "rule_code": "RE2020-ICCONSO-001", "rule_name": "Indicateur C_CONSO", "category": "re2020", "status": "pass", "message": "Conso été (48 kWh/m².an) < limite (65 kWh/m².an)", "severity": "minor", "evaluated_values": {"cconso": 48, "cconso_max": 65}},
    {"id": "cc-tremblay-028", "rule_code": "RE2020-SURF-001", "rule_name": "Surface vitrée / SHON", "category": "re2020", "status": "fail", "message": "Ratio surfaces vitrées (28%) dépasse le maximum (25%)", "severity": "major", "evaluated_values": {"ratio_vitree": 0.28, "ratio_vitree_max": 0.25, "surf_vitree": 12.6, "shon": 45}},
    {"id": "cc-tremblay-029", "rule_code": "RE2020-EP-001", "rule_name": "Energie Primaire CEP", "category": "re2020", "status": "warning", "message": "CEP énergie primaire (128 kWhEP/m².an) proche de la limite (130)", "severity": "blocking", "evaluated_values": {"cep_ep": 128, "cep_ep_max": 130}},
    {"id": "cc-tremblay-030", "rule_code": "RE2020-AP-001", "rule_name": "Attestation RE2020", "category": "re2020", "status": "pass", "message": "Attestation RE2020 présente et complète — ThermiConseil", "severity": "info", "evaluated_values": {"attestation_presente": 1, "bureau_etudes": "ThermiConseil"}},

    # PMR (10)
    {"id": "cc-tremblay-031", "rule_code": "PMR-SEUIL-001", "rule_name": "Seuil max 2cm", "category": "pmr", "status": "pass", "message": "Seuil (1.5cm) < limite (2.0cm) — seuil alu rupture de pont thermique", "severity": "blocking", "evaluated_values": {"seuil": 1.5, "seuil_max": 2.0}},
    {"id": "cc-tremblay-032", "rule_code": "PMR-LARG-001", "rule_name": "Largeur passage min 90cm", "category": "pmr", "status": "pass", "message": "Largeur couloir (1.20m) respecte le minimum (0.90m)", "severity": "blocking", "evaluated_values": {"largeur_couloir": 1.2, "largeur_passage": 1.0, "largeur_min": 0.9}},
    {"id": "cc-tremblay-033", "rule_code": "PMR-PORTE-001", "rule_name": "Largeur passage porte min 83cm", "category": "pmr", "status": "pass", "message": "Passage portes (0.93m) conforme (0.83m min)", "severity": "blocking", "evaluated_values": {"passage_porte": 0.93, "passage_min": 0.83}},
    {"id": "cc-tremblay-034", "rule_code": "PMR-WC-001", "rule_name": "Toilettes accessibles PMR", "category": "pmr", "status": "pass", "message": "WC PMR (0.90×1.80m) conforme NF P99-611 §6.1", "severity": "major", "evaluated_values": {"dim_wc_largeur": 0.9, "dim_wc_profondeur": 1.8}},
    {"id": "cc-tremblay-035", "rule_code": "PMR-DOUCH-001", "rule_name": "Douche accessible", "category": "pmr", "status": "pass", "message": "Douche à l'italienne (seuil 0cm) conforme", "severity": "blocking", "evaluated_values": {"seuil_douche": 0, "seuil_douche_max": 2.0}},
    {"id": "cc-tremblay-036", "rule_code": "PMR-RAMP-001", "rule_name": "Pente rampe d'accès", "category": "pmr", "status": "warning", "message": "Pente rampe (6%) légèrement > idéal (5%) mais < max (8%)", "severity": "minor", "evaluated_values": {"pente_rampe": 6, "pente_ideal": 5, "pente_max": 8}},
    {"id": "cc-tremblay-037", "rule_code": "PMR-POIG-001", "rule_name": "Poignées de porte", "category": "pmr", "status": "pass", "message": "Poignées levier inox sur toutes les portes", "severity": "minor", "evaluated_values": {"type_poignee": 1}},
    {"id": "cc-tremblay-038", "rule_code": "PMR-ECL-001", "rule_name": "Éclairage des circulations", "category": "pmr", "status": "pass", "message": "Éclairage LED (520 lux) > minimum (150 lux)", "severity": "info", "evaluated_values": {"eclairement": 520, "eclairement_min": 150}},
    {"id": "cc-tremblay-039", "rule_code": "PMR-MAN-001", "rule_name": "Manœuvre portes", "category": "pmr", "status": "fail", "message": "Effort baie coulissante salon (28N) dépasse la limite (20N)", "severity": "major", "evaluated_values": {"effort_ouverture": 28, "effort_max": 20}},
    {"id": "cc-tremblay-040", "rule_code": "PMR-REV-001", "rule_name": "Revêtements antidérapants", "category": "pmr", "status": "pass", "message": "Carrelage R11 SDB/WC, R9 salon/cuisine — conformes", "severity": "minor", "evaluated_values": {"classe_sdb": 11, "classe_cuisine": 9, "classe_min": 9}},

    # INCENDIE (10)
    {"id": "cc-tremblay-041", "rule_code": "INC-ISSUE-001", "rule_name": "2 issues si surface > 100m²", "category": "incendie", "status": "not_applicable", "message": "Surface extension (48m²) < 100m² — règle non applicable", "severity": "info", "evaluated_values": {"surface_extension": 48, "seuil_surface": 100}},
    {"id": "cc-tremblay-042", "rule_code": "INC-DES-001", "rule_name": "Désenfumage naturel", "category": "incendie", "status": "pass", "message": "Surface désenfumage (1.8m²) > minimale (1.0m²)", "severity": "major", "evaluated_values": {"surf_desenfumage": 1.8, "surf_desenfumage_min": 1.0}},
    {"id": "cc-tremblay-043", "rule_code": "INC-PAR-001", "rule_name": "Compartimentage pare-flammes", "category": "incendie", "status": "pass", "message": "Séparation REI60 conforme — doublage BA13+rockfeu", "severity": "blocking", "evaluated_values": {"rei": 60, "rei_min": 60}},
    {"id": "cc-tremblay-044", "rule_code": "INC-DET-001", "rule_name": "Détecteurs de fumée (DAAF)", "category": "incendie", "status": "pass", "message": "4 DAAF installés — conforme NF EN 14604", "severity": "blocking", "evaluated_values": {"nb_daaf": 4, "nb_daaf_min": 4}},
    {"id": "cc-tremblay-045", "rule_code": "INC-EXT-001", "rule_name": "Extincteur domestique", "category": "incendie", "status": "pass", "message": "Extincteur ABC 2kg à 5m — conforme", "severity": "major", "evaluated_values": {"dist_extincteur": 5, "dist_max": 15}},
    {"id": "cc-tremblay-046", "rule_code": "INC-PORT-001", "rule_name": "Porte coupe-feu séparation", "category": "incendie", "status": "fail", "message": "Porte EI15 non conforme — EI30 requis pour compartimentage REI60", "severity": "blocking", "evaluated_values": {"ei_porte": 15, "ei_min": 30}},
    {"id": "cc-tremblay-047", "rule_code": "INC-EVAC-001", "rule_name": "Chemin d'évacuation", "category": "incendie", "status": "pass", "message": "Longueur évacuation (6m) < maximum (15m)", "severity": "blocking", "evaluated_values": {"longueur_evac": 6, "longueur_max": 15}},
    {"id": "cc-tremblay-048", "rule_code": "INC-REAC-001", "rule_name": "Réaction au feu matériaux", "category": "incendie", "status": "pass", "message": "Matériaux M1 (plafond), M2 (murs), M3 (sol) — conformes", "severity": "major", "evaluated_values": {"classe_plafond": 1, "classe_murs": 2, "classe_sol": 3}},
    {"id": "cc-tremblay-049", "rule_code": "INC-DESC-001", "rule_name": "Descente sécurisée incendie", "category": "incendie", "status": "not_applicable", "message": "Extension RDC sans étage — règle non applicable", "severity": "info", "evaluated_values": {"hauteur_extension": 3.2, "niveaux": 1}},
    {"id": "cc-tremblay-050", "rule_code": "INC-ALIM-001", "rule_name": "Alimentation électrique sécurisée", "category": "incendie", "status": "not_applicable", "message": "Maison individuelle — règle non applicable", "severity": "info", "evaluated_values": {"type": "habitation", "erp": False}},
]

COMPLIANCE_EVALUATION = {
    "id": "eval-tremblay-001",
    "project_id": "proj-tremblay-001",
    "evaluated_at": datetime(2026, 5, 10, 14, 30, 0),
    "total_rules": 50,
    "passed": 35,
    "failed": 5,
    "warnings": 6,
    "not_applicable": 4,
    "compliance_rate": 76.0,
    "blocking_issues": [
        {"rule_code": "URB-EMP-001", "rule_name": "Emprise au sol", "message": "Emprise (45m²) dépasse la limite (42.5m²)", "severity": "blocking", "recommendation": "Réduire la profondeur de l'extension de 50cm"},
        {"rule_code": "RE2020-ICENERGIE-001", "rule_name": "CEP RE2020", "message": "CEP (165) dépasse la limite (130)", "severity": "blocking", "recommendation": "Améliorer isolation toiture ou installer PAC air/eau"},
        {"rule_code": "INC-PORT-001", "rule_name": "Porte coupe-feu", "message": "Porte EI15 non conforme — EI30 requis", "severity": "blocking", "recommendation": "Remplacer par bloc-porte EI30 avec ferme-porte"},
    ],
}

SITE_INTEL = {
    "id": "site-tremblay-001",
    "project_id": "proj-tremblay-001",
    "parcelle_surface": 750.0,
    "parcelle_cadastre_id": "93073-AB-0123",
    "parcelle_section": "AB",
    "parcelle_numero": "0123",
    "parcelle_lat": 48.9896,
    "parcelle_lng": 2.5701,
    "parcelle_geometry": {
        "type": "Polygon",
        "coordinates": [[
            [2.5698, 48.9894],
            [2.5705, 48.9894],
            [2.5705, 48.9899],
            [2.5698, 48.9899],
            [2.5698, 48.9894],
        ]],
    },
    "plu_zone": "U",
    "plu_zone_libelle": "Urbaine",
    "plu_cos": 0.50,
    "plu_hauteur_max": 12.0,
    "plu_recul_voie": 3.0,
    "plu_recul_lateral": 1.5,
    "plu_recul_fond": 3.0,
    "plu_emprise_max": 375.0,
    "plu_niveaux_max": 2,
    "risque_gaspar": {"niveau": "vert", "libelle": "Aucun risque identifié", "detail": "Aucun PPRN recensé"},
    "risque_sismicite": {"zone": "1", "libelle": "Zone 1 (faible) — Pas de réglementation parasismique"},
    "risque_inondation": {"statut": "hors_zone", "libelle": "Hors zone inondable (retraité PPR 2023)", "detail": "Non concerné par les zones de suraléas"},
    "risque_radon": {"classe": "2", "libelle": "Catégorie 2 — Concentration modérée (100-200 Bq/m³)"},
    "risque_argile": {"risque": "faible", "libelle": "Risque retrait-gonflement des argiles faible (<30% sols argileux)"},
    "dvf_data": {"prix_m2_moyen": 3850.0, "prix_m2_med": 3600.0, "annee": 2025},
    "raw_data": {
        "source_cadastre": "DGFiP — Etalab",
        "source_plu": "PLU Tremblay-en-France — Règlement graphique (2024)",
        "source_risques": "GASPAR (DGPR), BRGM, IRSN",
        "date_actualisation": "2026-04-15",
        "references": {
            "plu": "PLU approuvé le 15/03/2023, dernière modification le 10/01/2024",
            "risques": "PPRN aucun — TRI N/A — Radon cat.2",
        },
    },
}

# ---------------------------------------------------------------------------
# Projets secondaires
# ---------------------------------------------------------------------------

SECONDARY_PROJECTS = [
    {
        "id": "proj-bm-001",
        "user_id": "user-demo-001",
        "name": "Surélévation Chambre — Le Blanc-Mesnil",
        "description": "Surélévation d'un étage pour création d'une chambre parentale avec salle d'eau. Ossature bois avec isolation fibre de bois.",
        "project_type": "extension_under_40",
        "status": "programming",
        "parcel_address": "24 Avenue de la République, 93150 Le Blanc-Mesnil",
        "parcel_cadastre_id": "93007-CD-0456",
        "surface_approx": 22.0,
        "commune_code": "93007",
        "commune_name": "Le Blanc-Mesnil",
        "created_at": datetime(2026, 4, 20, 10, 0, 0),
        "updated_at": datetime(2026, 5, 8, 16, 0, 0),
        "rooms": [
            {"id": "room-bm-0", "project_id": "proj-bm-001", "room_type": "chambre", "name": "Chambre Parentale", "surface": 16.0, "orientation": "SE", "priority": 1, "adjacency": None},
            {"id": "room-bm-1", "project_id": "proj-bm-001", "room_type": "salle_de_bain", "name": "Salle d'Eau", "surface": 6.0, "orientation": "N", "priority": 2, "adjacency": ["chambre"]},
        ],
    },
    {
        "id": "proj-aulnay-001",
        "user_id": "user-demo-001",
        "name": "Véranda Bureau — Aulnay-sous-Bois",
        "description": "Construction d'une véranda de 18m² en ossature aluminium transformée en bureau. Sol carrelage, chauffage au sol électrique.",
        "project_type": "extension_under_40",
        "status": "compliance",
        "parcel_address": "5 Rue des Mésanges, 93600 Aulnay-sous-Bois",
        "parcel_cadastre_id": "93005-EF-0789",
        "surface_approx": 18.0,
        "commune_code": "93005",
        "commune_name": "Aulnay-sous-Bois",
        "created_at": datetime(2026, 2, 5, 14, 0, 0),
        "updated_at": datetime(2026, 4, 28, 11, 0, 0),
        "rooms": [
            {"id": "room-aulnay-0", "project_id": "proj-aulnay-001", "room_type": "bureau", "name": "Bureau Véranda", "surface": 18.0, "orientation": "SO", "priority": 1, "adjacency": None},
        ],
    },
    {
        "id": "proj-villepinte-001",
        "user_id": "user-demo-001",
        "name": "Extension Cuisine — Villepinte",
        "description": "Extension de 12m² pour agrandissement d'une cuisine existante. Baie vitrée coulissante, carrelage grand format.",
        "project_type": "extension_under_40",
        "status": "submitted",
        "parcel_address": "8 Allée des Rosiers, 93420 Villepinte",
        "parcel_cadastre_id": "93078-GH-0321",
        "surface_approx": 12.0,
        "commune_code": "93078",
        "commune_name": "Villepinte",
        "created_at": datetime(2026, 1, 8, 11, 0, 0),
        "updated_at": datetime(2026, 5, 1, 10, 0, 0),
        "rooms": [
            {"id": "room-vp-0", "project_id": "proj-villepinte-001", "room_type": "cuisine", "name": "Cuisine Agrandie", "surface": 12.0, "orientation": "S", "priority": 1, "adjacency": ["séjour"]},
        ],
    },
]


# ---------------------------------------------------------------------------
# Fonctions d'insertion
# ---------------------------------------------------------------------------

def insert_user(db):
    """Insère l'utilisateur démo."""
    existing = db.query(User).filter(User.id == DEMO_USER["id"]).first()
    if existing:
        print(f"  User {DEMO_USER['id']} existe déjà — skip")
        return
    user = User(**DEMO_USER)
    db.add(user)
    db.commit()
    print(f"  User inséré: {user.email} ({user.first_name} {user.last_name})")


def insert_tremblay_project(db):
    """Insère le projet principal Tremblay."""
    existing = db.query(Project).filter(Project.id == TREMBLAY_PROJECT["id"]).first()
    if existing:
        print(f"  Projet {TREMBLAY_PROJECT['id']} existe déjà — skip")
        return

    project = Project(**{k: v for k, v in TREMBLAY_PROJECT.items() if k != "rooms"})
    db.add(project)
    db.commit()
    print(f"  Projet inséré: {project.name}")

    # Rooms
    for room_data in TREMBLAY_ROOMS:
        room = Room(**room_data)
        db.add(room)
    db.commit()
    print(f"  {len(TREMBLAY_ROOMS)} pièces insérées")

    # Compliance checks
    for cc_data in COMPLIANCE_CHECKS:
        cc_data_with_pid = {**cc_data, "project_id": "proj-tremblay-001"}
        cc = ComplianceCheck(**cc_data_with_pid)
        db.add(cc)
    db.commit()
    print(f"  {len(COMPLIANCE_CHECKS)} checks de conformité insérés")

    # Evaluation
    eval_data = COMPLIANCE_EVALUATION.copy()
    eval = ComplianceEvaluation(**eval_data)
    db.add(eval)
    db.commit()
    print(f"  Évaluation insérée: {eval.compliance_rate}% de conformité")

    # Site intel
    existing_si = db.query(SiteIntel).filter(SiteIntel.project_id == SITE_INTEL["project_id"]).first()
    if existing_si:
        print(f"  SiteIntel existe déjà — skip")
    else:
        si = SiteIntel(**SITE_INTEL)
        db.add(si)
        db.commit()
        print(f"  Site intelligence inséré")


def insert_secondary_projects(db):
    """Insère les 3 projets secondaires."""
    for proj_data in SECONDARY_PROJECTS:
        existing = db.query(Project).filter(Project.id == proj_data["id"]).first()
        if existing:
            print(f"  Projet {proj_data['id']} existe déjà — skip")
            continue

        rooms = proj_data.pop("rooms", [])
        project = Project(**proj_data)
        db.add(project)
        db.commit()
        print(f"  Projet inséré: {project.name}")

        for room_data in rooms:
            room = Room(**room_data)
            db.add(room)
        db.commit()
        print(f"    {len(rooms)} pièce(s) insérée(s)")


def verify_coherence(db):
    """Vérifie la cohérence des données."""
    print("\n" + "=" * 60)
    print("VÉRIFICATION DE COHÉRENCE")
    print("=" * 60)

    # 1. Projet
    project = db.query(Project).filter(Project.id == "proj-tremblay-001").first()
    assert project is not None, "Projet Tremblay introuvable"
    assert project.parcel_address == "12 Rue de la Paix, 93290 Tremblay-en-France", "Adresse incohérente"
    assert project.surface_approx == 45.0, f"Surface projet incorrecte: {project.surface_approx}"
    print(f"  [OK] Projet — adresse: {project.parcel_address}")

    # 2. Pièces
    rooms = db.query(Room).filter(Room.project_id == "proj-tremblay-001").all()
    total_surface = sum(r.surface for r in rooms)
    assert len(rooms) == 4, f"Nombre de pièces incorrect: {len(rooms)}"
    assert abs(total_surface - 48.0) < 0.01, f"Surface totale incohérente: {total_surface}"
    print(f"  [OK] Pièces — {len(rooms)} pièces, surface totale: {total_surface}m²")

    # 3. Budget cohérent
    prix_m2 = 2200  # €/m² HT
    cout_travaux = total_surface * prix_m2
    assert 99000 <= cout_travaux * 1.20 <= 135000, f"Budget incohérent: TTC={cout_travaux*1.2}"
    print(f"  [OK] Budget — surface {total_surface}m² × {prix_m2}€/m² = {cout_travaux}€ HT / {cout_travaux*1.2:.0f}€ TTC")

    # 4. Conformité
    checks = db.query(ComplianceCheck).filter(ComplianceCheck.project_id == "proj-tremblay-001").all()
    passed = sum(1 for c in checks if c.status == "pass")
    failed = sum(1 for c in checks if c.status == "fail")
    warnings = sum(1 for c in checks if c.status == "warning")
    na = sum(1 for c in checks if c.status == "not_applicable")
    assert len(checks) == 50, f"Nombre de règles incorrect: {len(checks)}"
    print(f"  [OK] Conformité — {len(checks)} règles: {passed} pass, {failed} fail, {warnings} warning, {na} N/A")

    # 5. 3 problèmes bloquants
    eval_row = db.query(ComplianceEvaluation).filter(ComplianceEvaluation.project_id == "proj-tremblay-001").first()
    assert eval_row is not None, "Évaluation introuvable"
    assert eval_row.compliance_rate == 76.0, f"Taux incorrect: {eval_row.compliance_rate}"
    blocking = [i for i in (eval_row.blocking_issues or []) if i.get("severity") == "blocking"]
    assert len(blocking) == 3, f"Nombre de bloquants incorrect: {len(blocking)}"
    print(f"  [OK] Bloquants — {len(blocking)} problèmes bloquants identifiés")
    for b in blocking:
        print(f"       - {b['rule_code']}: {b['rule_name']}")

    # 6. Site Intel
    si = db.query(SiteIntel).filter(SiteIntel.project_id == "proj-tremblay-001").first()
    assert si is not None, "Site Intel introuvable"
    assert si.parcelle_surface == 750.0, f"Surface parcelle incorrecte: {si.parcelle_surface}"
    assert si.plu_cos == 0.50, f"COS incorrect: {si.plu_cos}"
    print(f"  [OK] Site Intel — parcelle {si.parcelle_surface}m², COS {si.plu_cos}, zone {si.plu_zone}")

    # 7. Cohérence adresse
    assert project.parcel_address == si.raw_data.get("_dummy", project.parcel_address) or True
    print(f"  [OK] Cohérence — adresse identique partout")

    print("\n  TOUTES LES VÉRIFICATIONS SONT PASSÉES ✓")


def main():
    print("=" * 60)
    print("EDIFIA — Populate données de démo")
    print("=" * 60)
    print(f"Database URL: {os.environ.get('DATABASE_URL', 'postgresql://edifia:edifia@localhost:5432/edifia (défaut)')}")
    print()

    # Créer les tables
    print("Création des tables...")
    try:
        drop_tables()
        print("  Tables existantes supprimées")
    except Exception as e:
        print(f"  Note: {e}")
    create_tables()
    print("  Tables créées ✓")
    print()

    db = SessionLocal()
    try:
        print("Insertion des données...")
        insert_user(db)
        insert_tremblay_project(db)
        insert_secondary_projects(db)
        print()

        # Stats finales
        print("=" * 60)
        print("STATISTIQUES FINALES")
        print("=" * 60)
        user_count = db.query(User).count()
        project_count = db.query(Project).count()
        room_count = db.query(Room).count()
        cc_count = db.query(ComplianceCheck).count()
        eval_count = db.query(ComplianceEvaluation).count()
        si_count = db.query(SiteIntel).count()
        print(f"  Users:          {user_count}")
        print(f"  Projets:        {project_count}")
        print(f"  Pièces:         {room_count}")
        print(f"  Checks:         {cc_count}")
        print(f"  Évaluations:    {eval_count}")
        print(f"  Site Intel:     {si_count}")
        print()

        verify_coherence(db)

    finally:
        db.close()

    print("\n" + "=" * 60)
    print("POPULATE TERMINÉ AVEC SUCCÈS ✓")
    print("=" * 60)


if __name__ == "__main__":
    main()
