// ---------------------------------------------------------------------------
// Site Intelligence — Projet Tremblay-en-France
// ---------------------------------------------------------------------------

export interface SiteIntelData {
  parcelle: {
    surface: number;
    cadastre_id: string;
    section: string;
    numero: string;
    coordonnees: { lat: number; lng: number };
    adresse: string;
    geometry?: {
      type: string;
      coordinates: number[][][];
    };
  };
  plu: {
    zone: string;
    zone_libelle: string;
    cos: number;
    hauteur_max: number;
    recul_voie: number;
    recul_lateral: number;
    recul_fond: number;
    emprise_max: number;
    niveaux_max: number;
  };
  risques: {
    gaspar: { niveau: string; libelle: string; detail?: string };
    sismicite: { zone: string; libelle: string };
    inondation: { statut: string; libelle: string; detail?: string };
    radon: { classe: string; libelle: string };
    argile: { risque: string; libelle: string };
  };
  dvf?: {
    prix_m2_moyen: number;
    prix_m2_med: number;
    annee: number;
  };
  raw_data: Record<string, unknown>;
}

export const mockSiteIntel: SiteIntelData = {
  parcelle: {
    surface: 750,
    cadastre_id: "93073-AB-0123",
    section: "AB",
    numero: "0123",
    coordonnees: { lat: 48.9896, lng: 2.5701 },
    adresse: "12 Rue de la Paix, 93290 Tremblay-en-France",
    geometry: {
      type: "Polygon",
      coordinates: [[
        [2.5698, 48.9894],
        [2.5705, 48.9894],
        [2.5705, 48.9899],
        [2.5698, 48.9899],
        [2.5698, 48.9894],
      ]],
    },
  },
  plu: {
    zone: "U",
    zone_libelle: "Urbaine",
    cos: 0.50,
    hauteur_max: 12.0,
    recul_voie: 3.0,
    recul_lateral: 1.5,
    recul_fond: 3.0,
    emprise_max: 375.0,
    niveaux_max: 2,
  },
  risques: {
    gaspar: {
      niveau: "vert",
      libelle: "Aucun risque identifié",
      detail: "Aucun PPRN recensé sur la commune de Tremblay-en-France",
    },
    sismicite: {
      zone: "1",
      libelle: "Zone 1 (faible) — Pas de réglementation parasismique",
    },
    inondation: {
      statut: "hors_zone",
      libelle: "Hors zone inondable (retraité PPR 2023)",
      detail: "La parcelle n'est pas concernée par les zones de suraléas inondation",
    },
    radon: {
      classe: "2",
      libelle: "Catégorie 2 — Concentration modérée (100-200 Bq/m³)",
    },
    argile: {
      risque: "faible",
      libelle: "Risque retrait-gonflement des argiles faible (<30% sols argileux)",
    },
  },
  dvf: {
    prix_m2_moyen: 3850,
    prix_m2_med: 3600,
    annee: 2025,
  },
  raw_data: {
    source_cadastre: "DGFiP — Etalab",
    source_plu: "PLU Tremblay-en-France — Règlement graphique (2024)",
    source_risques: "GASPAR (DGPR), BRGM, IRSN",
    date_actualisation: "2026-04-15",
    references: {
      plu: "PLU approuvé le 15/03/2023, dernière modification le 10/01/2024",
      risques: "PPRN aucun — TRI N/A — Radon cat.2",
      dvf: "Données DVF 2024-2025, MTE/ DGALN",
    },
    commune: {
      code_insee: "93073",
      nom: "Tremblay-en-France",
      departement: "Seine-Saint-Denis",
      region: "Île-de-France",
      population: 37000,
      altitude_moyenne: 80,
    },
    quartier: "Centre-ville — secteur pavillonnaire",
    serviced: {
      eau_potable: true,
      assainissement_collectif: false,
      gaz: true,
      electricite: true,
      fibre_optique: true,
    },
  },
};

// ---------------------------------------------------------------------------
// Données comparables DVF (ventes récentes à proximité)
// ---------------------------------------------------------------------------
export const mockComparablesDVF = [
  { adresse: "8 Rue de la Paix, Tremblay-en-France", date_vente: "2025-11-15", prix: 452000, surface_bati: 105, surface_terrain: 680, prix_m2: 4305, type: "Maison" },
  { adresse: "15 Rue de la Paix, Tremblay-en-France", date_vente: "2025-09-22", prix: 398000, surface_bati: 95,  surface_terrain: 720, prix_m2: 4189, type: "Maison" },
  { adresse: "3 Rue des Lilas, Tremblay-en-France",  date_vente: "2025-08-10", prix: 385000, surface_bati: 88,  surface_terrain: 650, prix_m2: 4375, type: "Maison" },
  { adresse: "22 Rue de la Paix, Tremblay-en-France", date_vente: "2025-06-05", prix: 410000, surface_bati: 98,  surface_terrain: 700, prix_m2: 4184, type: "Maison" },
  { adresse: "6 Rue du Stade, Tremblay-en-France",    date_vente: "2025-03-18", prix: 375000, surface_bati: 85,  surface_terrain: 600, prix_m2: 4412, type: "Maison" },
];

// ---------------------------------------------------------------------------
// Résumé synthétique pour composants UI
// ---------------------------------------------------------------------------
export const mockSiteIntelSummary = {
  project_id: "proj-tremblay-001",
  address: "12 Rue de la Paix, 93290 Tremblay-en-France",
  coordinates: { lat: 48.9896, lng: 2.5701 },
  parcel_surface: 750,
  cadastre_id: "93073-AB-0123",
  plu_zone: "U (Urbaine)",
  cos: 0.50,
  emprise_max: 375,
  hauteur_max: 12,
  niveaux_max: 2,
  risk_level: "Faible",
  seismique: "Zone 1 — pas de réglementation",
  inondation: "Hors zone",
  radon: "Catégorie 2 (modéré)",
  argile: "Faible",
  prix_m2_moyen: 3850,
  sourced_at: "2026-04-15",
};
