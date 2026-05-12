export interface ComplianceCheckResult {
  rule_code: string;
  rule_name: string;
  category: 'urbanisme' | 'dtu' | 're2020' | 'pmr' | 'incendie';
  status: 'pass' | 'fail' | 'warning' | 'not_applicable';
  message: string;
  severity?: 'blocking' | 'major' | 'minor' | 'info';
  evaluated_values: Record<string, number | string>;
}

export interface EvaluationResult {
  project_id: string;
  evaluated_at: string;
  summary: {
    total_rules: number;
    passed: number;
    failed: number;
    warnings: number;
    not_applicable: number;
    compliance_rate: number;
  };
  results: ComplianceCheckResult[];
}

// ---------------------------------------------------------------------------
// Conformite — Projet Tremblay-en-France
// 50 regles evaluees | Taux global 76% | 3 problemes bloquants
// ---------------------------------------------------------------------------
export const mockEvaluationResult: EvaluationResult = {
  project_id: "proj-tremblay-001",
  evaluated_at: "2026-05-10T14:30:00Z",
  summary: {
    total_rules: 50,
    passed: 35,
    failed: 5,     // 3 bloquants + 2 majeurs
    warnings: 6,
    not_applicable: 4,
    compliance_rate: 76,
  },
  results: [
    // ===== URBANISME (10 regles : 8 pass, 2 fail) =====
    {
      rule_code: "URB-COS-001",
      rule_name: "Coefficient d'Occupation du Sol",
      category: "urbanisme",
      status: "pass",
      message: "Surface au sol (45m²) respecte le COS (0.5 → 375m² max)",
      severity: "blocking",
      evaluated_values: { surface_au_sol: 45, cos_max: 0.5, surface_parcelle: 750, shon_total: 130 },
    },
    {
      rule_code: "URB-HT-001",
      rule_name: "Hauteur max batiment",
      category: "urbanisme",
      status: "pass",
      message: "Hauteur (3.2m) respecte la limite PLU (12.0m)",
      severity: "blocking",
      evaluated_values: { hauteur: 3.2, hauteur_max: 12 },
    },
    {
      rule_code: "URB-REC-001",
      rule_name: "Recul voie publique",
      category: "urbanisme",
      status: "pass",
      message: "Recul (4.5m) respecte le minimum (3.0m)",
      severity: "blocking",
      evaluated_values: { recul: 4.5, recul_min: 3.0 },
    },
    {
      rule_code: "URB-RECL-001",
      rule_name: "Recul lateral",
      category: "urbanisme",
      status: "pass",
      message: "Recul lateral (2.0m) respecte le minimum (1.5m)",
      severity: "major",
      evaluated_values: { recul_lateral: 2.0, recul_lateral_min: 1.5 },
    },
    {
      rule_code: "URB-RECF-001",
      rule_name: "Recul fond de parcelle",
      category: "urbanisme",
      status: "pass",
      message: "Recul fond (5.0m) respecte le minimum (3.0m)",
      severity: "major",
      evaluated_values: { recul_fond: 5.0, recul_fond_min: 3.0 },
    },
    {
      rule_code: "URB-EMP-001",
      rule_name: "Emprise au sol",
      category: "urbanisme",
      status: "fail",
      message: "Emprise au sol (45m²) depasse la limite autorisee (42.5m²) — Extension trop profonde sur parcelle",
      severity: "blocking",
      evaluated_values: { emprise: 45, emprise_max: 42.5, depassement: 2.5 },
    },
    {
      rule_code: "URB-SHON-001",
      rule_name: "SHON / Surface Hors Oeuvre Nette",
      category: "urbanisme",
      status: "pass",
      message: "SHON totale (130m² = 85m² existant + 45m² extension) dans la limite autorisee",
      severity: "major",
      evaluated_values: { shon_existant: 85, shon_extension: 45, shon_totale: 130, shon_max: 500 },
    },
    {
      rule_code: "URB-SHAB-001",
      rule_name: "Surface Habitable",
      category: "urbanisme",
      status: "pass",
      message: "Surface habitable (48m² extension) >= minimum legal (9m² par piece principale)",
      severity: "info",
      evaluated_values: { surface_habitable: 48, surface_min: 9 },
    },
    {
      rule_code: "URB-NIV-001",
      rule_name: "Nombre de niveaux",
      category: "urbanisme",
      status: "pass",
      message: "1 niveau (RDC) <= maximum autorise (2 niveaux)",
      severity: "major",
      evaluated_values: { niveaux: 1, niveaux_max: 2 },
    },
    {
      rule_code: "URB-VER-001",
      rule_name: "Espaces verts / emprise",
      category: "urbanisme",
      status: "warning",
      message: "Ratio espaces verts (48%) proche du minimum requis (50%)",
      severity: "minor",
      evaluated_values: { ratio_verdure: 0.48, ratio_min: 0.50, surface_verte: 360, surface_parcelle: 750 },
    },

    // ===== DTU (10 regles : 8 pass, 1 fail, 1 warning) =====
    {
      rule_code: "DTU-ISO-001",
      rule_name: "Isolation thermique parois",
      category: "dtu",
      status: "pass",
      message: "Resistance thermique R=4.2m².K/W > Rmin=4.0m².K/W (mur 20cm+laine de roche 140mm)",
      severity: "major",
      evaluated_values: { r_mesure: 4.2, r_min: 4.0 },
    },
    {
      rule_code: "DTU-ISO-002",
      rule_name: "Isolation thermique toiture terrasse",
      category: "dtu",
      status: "pass",
      message: "Resistance thermique toiture R=6.5m².K/W > Rmin=6.0m².K/W (PSE 200mm + etancheite multicouche SBS)",
      severity: "blocking",
      evaluated_values: { r_toiture: 6.5, r_min: 6.0 },
    },
    {
      rule_code: "DTU-ETR-001",
      rule_name: "Etancheite toiture terrasse",
      category: "dtu",
      status: "pass",
      message: "Etancheite multicouche SBS conforme DTU 43.1 — 2 couches + protection gravillons",
      severity: "blocking",
      evaluated_values: { nb_couches: 2, type: "SBS", pente_min: 0.01, pente_reelle: 0.015 },
    },
    {
      rule_code: "DTU-VEN-001",
      rule_name: "Ventilation logement",
      category: "dtu",
      status: "pass",
      message: "VMI hygroreglable B — debits conformes (salon 30m³/h, cuisine 45m³/h, sdb 15m³/h)",
      severity: "blocking",
      evaluated_values: { debit_total: 90, debit_min_reglementaire: 75, type_ventilation: "VMI-HR" },
    },
    {
      rule_code: "DTU-STR-001",
      rule_name: "Stabilite structure extension",
      category: "dtu",
      status: "pass",
      message: "Fondations superficielles (semelles filantes B25) conformes — sol classe A, portance > 0.15MPa",
      severity: "blocking",
      evaluated_values: { portance_sol: 0.18, portance_min: 0.15, profondeur_fondations: 0.6, gel: 0.5 },
    },
    {
      rule_code: "DTU-MENU-001",
      rule_name: "Menuiseries exterieures aluminium",
      category: "dtu",
      status: "pass",
      message: "Menuiseries alu double vitrage 4/16/4 — Uw=1.4W/m².K < Uw_max=1.8W/m².K, Sw=0.35",
      severity: "major",
      evaluated_values: { uw: 1.4, uw_max: 1.8, sw: 0.35 },
    },
    {
      rule_code: "DTU-ELEC-001",
      rule_name: "Installations electriques",
      category: "dtu",
      status: "warning",
      message: "Section cables cuisine (2.5mm²) a verifier — 4 appareils simultanes recommandes 6mm²",
      severity: "major",
      evaluated_values: { section_actuelle: 2.5, section_recommandee: 6.0, nb_appareils: 4 },
    },
    {
      rule_code: "DTU-PLU-001",
      rule_name: "Plomberie sanitaire",
      category: "dtu",
      status: "pass",
      message: "Pression eau (3.2 bar) > minimum (2.0 bar) — diametres alimentation conformes",
      severity: "major",
      evaluated_values: { pression: 3.2, pression_min: 2.0, diametre_alim: "Ø20 multicouche" },
    },
    {
      rule_code: "DTU-ACO-001",
      rule_name: "Acoustique parois",
      category: "dtu",
      status: "pass",
      message: "Isolation acoustique Rw=55dB > Rw_min=45dB (paroi doublage+isolant 100mm+lame d'air)",
      severity: "blocking",
      evaluated_values: { rw: 55, rw_min: 45 },
    },
    {
      rule_code: "DTU-ASS-001",
      rule_name: "Assainissement autonome",
      category: "dtu",
      status: "fail",
      message: "Fosse septique existante (2000L) insuffisante apres extension — 3000L requis pour 5 EH",
      severity: "blocking",
      evaluated_values: { capacite_actuelle: 2000, capacite_min: 3000, nb_eh: 5, extension_eh: 1 },
    },

    // ===== RE2020 (10 regles : 5 pass, 3 fail, 2 warning) =====
    {
      rule_code: "RE2020-BBIO-001",
      rule_name: "Bbio max (Batiment Basse Consommation)",
      category: "re2020",
      status: "pass",
      message: "Bbio (1.15) < limite reglementaire (1.30) — bonne performance bioclimatique",
      severity: "blocking",
      evaluated_values: { bbio: 1.15, bbio_max: 1.30 },
    },
    {
      rule_code: "RE2020-TIC-001",
      rule_name: "Temperature Interieur Conventionnelle max",
      category: "re2020",
      status: "pass",
      message: "TIC (26°C) < limite (28°C) — confort d'ete assure par protections solaires",
      severity: "blocking",
      evaluated_values: { tic: 26, tic_max: 28 },
    },
    {
      rule_code: "RE2020-ICENERGIE-001",
      rule_name: "Indicateur CENERGIE (CEP)",
      category: "re2020",
      status: "fail",
      message: "CEP (165 kWhEP/m².an) DEPASSE la limite (130 kWhEP/m².an) — revision isolation ou systeme chauffage necessaire",
      severity: "blocking",
      evaluated_values: { cep: 165, cep_max: 130, depassement: 35, recommandation: "Ameliorer isolation toiture terrasse ou installer PAC air/eau" },
    },
    {
      rule_code: "RE2020-ICRE-001",
      rule_name: "Indicateur CRE (Consommation RE)",
      category: "re2020",
      status: "pass",
      message: "CRE (12 kWh/m².an) respecte le seuil (15 kWh/m².an)",
      severity: "major",
      evaluated_values: { cre: 12, cre_max: 15 },
    },
    {
      rule_code: "RE2020-ICGHG-001",
      rule_name: "Indicateur IC-GES",
      category: "re2020",
      status: "pass",
      message: "Emissions GES (14 kgCO2/m².an) < seuil (20 kgCO2/m².an)",
      severity: "blocking",
      evaluated_values: { gges: 14, gges_max: 20 },
    },
    {
      rule_code: "RE2020-PE-001",
      rule_name: "Permeabilite a l'air (Q4Pa-surf)",
      category: "re2020",
      status: "warning",
      message: "Permeabilite (2.3 m³/h.m²) proche de la limite (2.0 m³/h.m²) — attention points de detail menuiseries",
      severity: "major",
      evaluated_values: { q4pa: 2.3, q4pa_max: 2.0 },
    },
    {
      rule_code: "RE2020-ICCONSO-001",
      rule_name: "Indicateur C_CONSO (Confort d'ete)",
      category: "re2020",
      status: "pass",
      message: "Conso ete (48 kWh/m².an) < limite (65 kWh/m².an)",
      severity: "minor",
      evaluated_values: { cconso: 48, cconso_max: 65 },
    },
    {
      rule_code: "RE2020-SURF-001",
      rule_name: "Surface vitree / SHON",
      category: "re2020",
      status: "fail",
      message: "Ratio surfaces vitrees (28%) depasse le maximum recommande (25%) — baie salon 4mx2.4m a optimiser",
      severity: "major",
      evaluated_values: { ratio_vitree: 0.28, ratio_vitree_max: 0.25, surf_vitree: 12.6, shon: 45 },
    },
    {
      rule_code: "RE2020-EP-001",
      rule_name: "Energie Primaire CEP",
      category: "re2020",
      status: "warning",
      message: "CEP energie primaire (128 kWhEP/m².an) proche de la limite (130 kWhEP/m².an)",
      severity: "blocking",
      evaluated_values: { cep_ep: 128, cep_ep_max: 130 },
    },
    {
      rule_code: "RE2020-AP-001",
      rule_name: "Attestation RE2020",
      category: "re2020",
      status: "pass",
      message: "Attestation RE2020 presente et complete — etablie par bureau d'etudes ThermiConseil",
      severity: "info",
      evaluated_values: { attestation_presente: 1, bureau_etudes: "ThermiConseil", date_attestation: "2026-04-28" },
    },

    // ===== PMR (10 regles : 7 pass, 2 fail, 1 warning) =====
    {
      rule_code: "PMR-SEUIL-001",
      rule_name: "Seuil max 2cm",
      category: "pmr",
      status: "pass",
      message: "Seuil a l'entree extension (1.5cm) < limite (2.0cm) — seuil aluminium rupture de pont thermique",
      severity: "blocking",
      evaluated_values: { seuil: 1.5, seuil_max: 2.0 },
    },
    {
      rule_code: "PMR-LARG-001",
      rule_name: "Largeur passage min 90cm",
      category: "pmr",
      status: "pass",
      message: "Largeur couloir (1.20m) et passages (1.00m) respectent le minimum (0.90m)",
      severity: "blocking",
      evaluated_values: { largeur_couloir: 1.2, largeur_passage: 1.0, largeur_min: 0.9 },
    },
    {
      rule_code: "PMR-PORTE-001",
      rule_name: "Largeur passage porte min 83cm",
      category: "pmr",
      status: "pass",
      message: "Passage portes (0.93m) conforme (0.83m min) — bloc-porte 0.93m dans tous les locaux",
      severity: "blocking",
      evaluated_values: { passage_porte: 0.93, passage_min: 0.83 },
    },
    {
      rule_code: "PMR-WC-001",
      rule_name: "Toilettes accessibles PMR",
      category: "pmr",
      status: "pass",
      message: "WC PMR dimensionne (0.90x1.80m degagement) conforme NF P99-611 section 6.1",
      severity: "major",
      evaluated_values: { dim_wc_largeur: 0.9, dim_wc_profondeur: 1.8, dim_wc_min: 0.78 },
    },
    {
      rule_code: "PMR-DOUCH-001",
      rule_name: "Douche accessible",
      category: "pmr",
      status: "pass",
      message: "Douche a l'italienne (seuil 0cm, dim 1.20x0.90m) conforme — solivage rehausse",
      severity: "blocking",
      evaluated_values: { seuil_douche: 0, seuil_douche_max: 2.0, dim_douche: "1.20x0.90" },
    },
    {
      rule_code: "PMR-RAMP-001",
      rule_name: "Pente rampe d'acces",
      category: "pmr",
      status: "warning",
      message: "Pente rampe (6%) legerement superieure a l'ideal (5%) mais < max (8%)",
      severity: "minor",
      evaluated_values: { pente_rampe: 6, pente_ideal: 5, pente_max: 8, longueur: 1.5 },
    },
    {
      rule_code: "PMR-POIG-001",
      rule_name: "Poignees de porte",
      category: "pmr",
      status: "pass",
      message: "Poignees levier inox sur toutes les portes — maniement sans serrage",
      severity: "minor",
      evaluated_values: { type_poignee: 1 },
    },
    {
      rule_code: "PMR-ECL-001",
      rule_name: "Eclairage des circulations",
      category: "pmr",
      status: "pass",
      message: "Eclairage LED (520 lux) > minimum (150 lux) — spots encastres + detecteur presence",
      severity: "info",
      evaluated_values: { eclairement: 520, eclairement_min: 150 },
    },
    {
      rule_code: "PMR-MAN-001",
      rule_name: "Maneuvre portes",
      category: "pmr",
      status: "fail",
      message: "Effort ouverture porte baie coulissante salon (28N) depasse la limite (20N) — remplacer par galandage motorise",
      severity: "major",
      evaluated_values: { effort_ouverture: 28, effort_max: 20, type_porte: "coulissante_alu_4_vantaux" },
    },
    {
      rule_code: "PMR-REV-001",
      rule_name: "Revetements de sol antiderapants",
      category: "pmr",
      status: "pass",
      message: "Carrelage R11 dans salle de bain/WC, R9 salon/cuisine — conformes aux zones humides",
      severity: "minor",
      evaluated_values: { classe_sdb: 11, classe_cuisine: 9, classe_min: 9 },
    },

    // ===== INCENDIE (10 regles : 7 pass, 2 fail, 1 not_applicable) =====
    {
      rule_code: "INC-ISSUE-001",
      rule_name: "2 issues si surface > 100m²",
      category: "incendie",
      status: "not_applicable",
      message: "Surface extension (48m²) < 100m² — regle non applicable pour ce type d'extension",
      severity: "info",
      evaluated_values: { surface_extension: 48, seuil_surface: 100 },
    },
    {
      rule_code: "INC-DES-001",
      rule_name: "Desenfumage naturel",
      category: "incendie",
      status: "pass",
      message: "Surface desenfumage (1.8m²) > surface minimale (1.0m²) — chassis ouvrant salon 1.2x1.5m",
      severity: "major",
      evaluated_values: { surf_desenfumage: 1.8, surf_desenfumage_min: 1.0 },
    },
    {
      rule_code: "INC-PAR-001",
      rule_name: "Compartimentage pare-flammes",
      category: "incendie",
      status: "pass",
      message: "Separation REI60 entre extension et maison existante conforme — doublage BA13+rockfeu",
      severity: "blocking",
      evaluated_values: { rei: 60, rei_min: 60 },
    },
    {
      rule_code: "INC-DET-001",
      rule_name: "Detecteurs de fumee (DAAF)",
      category: "incendie",
      status: "pass",
      message: "1 DAAF dans chaque nouvelle piece (4 total) — conforme NF EN 14604",
      severity: "blocking",
      evaluated_values: { nb_daaf: 4, nb_daaf_min: 4 },
    },
    {
      rule_code: "INC-EXT-001",
      rule_name: "Extincteur domestique",
      category: "incendie",
      status: "pass",
      message: "Extincteur ABC 2kg present a moins de 15m des locaux",
      severity: "major",
      evaluated_values: { dist_extincteur: 8, dist_max: 15 },
    },
    {
      rule_code: "INC-PORT-001",
      rule_name: "Porte coupe-feu",
      category: "incendie",
      status: "fail",
      message: "Porte separatrice non CF (EI0) — EI30 requis pour le compartimentage",
      severity: "blocking",
      evaluated_values: { ei_porte: 0, ei_min: 30 },
    },
    {
      rule_code: "INC-EVAC-001",
      rule_name: "Chemin d'evacuation",
      category: "incendie",
      status: "pass",
      message: "Longueur chemin evacuation (8m) < maximum (15m) avec issue directe",
      severity: "blocking",
      evaluated_values: { longueur_evac: 8, longueur_max: 15 },
    },
    {
      rule_code: "INC-REAC-001",
      rule_name: "Reaction au feu materiaux",
      category: "incendie",
      status: "pass",
      message: "Materiaux interieurs M1 (plafond) et M2 (murs) conformes",
      severity: "major",
      evaluated_values: { classe_plafond: 1, classe_murs: 2, classe_min: 3 },
    },
    {
      rule_code: "INC-DESC-001",
      rule_name: "Descente securisee incendie",
      category: "incendie",
      status: "not_applicable",
      message: "Extension RDC sans etage superieur accessible (>8m de hauteur) — regle non applicable",
      severity: "info",
      evaluated_values: { hauteur_etage: 3.5, hauteur_total: 10.5, escalier_secours: 0 },
    },
    {
      rule_code: "INC-BAE-001",
      rule_name: "Boitier d'alerte et alarme incendie",
      category: "incendie",
      status: "pass",
      message: "BAEI installe avec liaison telesurveillance conforme",
      severity: "major",
      evaluated_values: { baei: 1 },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3 problemes bloquants identifies
// ---------------------------------------------------------------------------
export const mockBlockingIssues = [
  {
    rule_code: "URB-EMP-001",
    rule_name: "Emprise au sol",
    category: "urbanisme",
    message: "Emprise au sol (45m²) depasse la limite autorisee (42.5m²) — Extension trop profonde sur parcelle",
    severity: "blocking",
    recommendation: "Reduire la profondeur de l'extension de 50cm ou demander un depassement de COS aupres de la mairie",
  },
  {
    rule_code: "RE2020-ICENERGIE-001",
    rule_name: "Indicateur CENERGIE (CEP)",
    category: "re2020",
    message: "CEP (165 kWhEP/m².an) DEPASSE la limite (130 kWhEP/m².an) — revision isolation ou systeme chauffage necessaire",
    severity: "blocking",
    recommendation: "Ameliorer l'isolation de la toiture terrasse (PSE 240mm) ou installer une PAC air/eau a la place du radiateur electrique",
  },
  {
    rule_code: "INC-PORT-001",
    rule_name: "Porte coupe-feu separation",
    category: "incendie",
    message: "Porte separatrice extension/maison EI15 non conforme — EI30 requis pour compartimentage REI60",
    severity: "blocking",
    recommendation: "Remplacer la porte standard par un bloc-porte EI30 avec ferme-porte et joints intumescents",
  },
];

// ---------------------------------------------------------------------------
// Resultats par categorie
// ---------------------------------------------------------------------------
export const mockCategoryResults = [
  { category: "urbanisme", total: 10, passed: 8, failed: 2, warnings: 0, compliance_rate: 80 },
  { category: "dtu", total: 10, passed: 8, failed: 1, warnings: 1, compliance_rate: 80 },
  { category: "re2020", total: 10, passed: 5, failed: 3, warnings: 2, compliance_rate: 50 },
  { category: "pmr", total: 10, passed: 7, failed: 2, warnings: 1, compliance_rate: 70 },
  { category: "incendie", total: 10, passed: 7, failed: 0, warnings: 0, not_applicable: 3, compliance_rate: 100 },
];

// ---------------------------------------------------------------------------
// Regles actives avec descriptions detaillees
// ---------------------------------------------------------------------------
export interface ActiveRule {
  code: string;
  name: string;
  category: 'urbanisme' | 'dtu' | 're2020' | 'pmr' | 'incendie';
  description: string;
  reference: string;
  severity: 'blocking' | 'major' | 'minor' | 'info';
}

export const mockActiveRules: ActiveRule[] = [
  // Urbanisme
  { code: "URB-COS-001", name: "Coefficient d'Occupation du Sol", category: "urbanisme", description: "Le COS est le rapport entre la surface construite et la surface totale de la parcelle.", reference: "PLU Tremblay - Article U.3.1", severity: "blocking" },
  { code: "URB-HT-001", name: "Hauteur max batiment", category: "urbanisme", description: "Hauteur maximale de construction autorisee selon la zone PLU.", reference: "PLU Tremblay - Article U.3.2", severity: "blocking" },
  { code: "URB-REC-001", name: "Recul voie publique", category: "urbanisme", description: "Distance minimale entre la facade et l'alignement de la voie publique.", reference: "PLU Tremblay - Article U.3.3", severity: "blocking" },
  { code: "URB-RECL-001", name: "Recul lateral", category: "urbanisme", description: "Distance minimale entre le batiment et les limites laterales de la parcelle.", reference: "PLU Tremblay - Article U.3.4", severity: "major" },
  { code: "URB-RECF-001", name: "Recul fond de parcelle", category: "urbanisme", description: "Distance minimale entre le batiment et la limite arriere de la parcelle.", reference: "PLU Tremblay - Article U.3.5", severity: "major" },
  { code: "URB-EMP-001", name: "Emprise au sol", category: "urbanisme", description: "Surface couverte par le batiment au niveau du sol.", reference: "PLU Tremblay - Article U.3.6", severity: "blocking" },
  { code: "URB-SHON-001", name: "SHON totale", category: "urbanisme", description: "Surface Hors Oeuvre Nette totale (existant + extension).", reference: "Code de l'urbanisme - L.112-2", severity: "major" },
  { code: "URB-SHAB-001", name: "Surface Habitable", category: "urbanisme", description: "Surface habitable minimale par piece principale.", reference: "Code de la construction - Art. L111-6", severity: "info" },
  { code: "URB-NIV-001", name: "Nombre de niveaux", category: "urbanisme", description: "Nombre maximal de niveaux autorises.", reference: "PLU Tremblay - Article U.3.7", severity: "major" },
  { code: "URB-VER-001", name: "Espaces verts", category: "urbanisme", description: "Ratio minimal d'espaces verts sur la parcelle.", reference: "PLU Tremblay - Article U.3.8", severity: "minor" },
  // DTU
  { code: "DTU-ISO-001", name: "Isolation thermique parois", category: "dtu", description: "Resistance thermique minimale des parois opaques et vitrees.", reference: "DTU 26.1 / RE2020", severity: "major" },
  { code: "DTU-ISO-002", name: "Isolation thermique toiture", category: "dtu", description: "Resistance thermique minimale de la toiture terrasse.", reference: "DTU 43.1 / RE2020", severity: "blocking" },
  { code: "DTU-ETR-001", name: "Etancheite toiture terrasse", category: "dtu", description: "Verification etancheite multicouche toiture terrasse.", reference: "DTU 43.1", severity: "blocking" },
  { code: "DTU-VEN-001", name: "Ventilation logements", category: "dtu", description: "Debit de ventilation minimal par logement.", reference: "DTU 68.1 / RE2020", severity: "blocking" },
  { code: "DTU-STR-001", name: "Stabilite structure", category: "dtu", description: "Verification de la stabilite de la structure et fondations.", reference: "DTU 13.1 / 20.1", severity: "blocking" },
  { code: "DTU-MENU-001", name: "Menuiseries exterieures", category: "dtu", description: "Performances des menuiseries et etancheite a l'air.", reference: "DTU 36.1 / RE2020", severity: "major" },
  { code: "DTU-ELEC-001", name: "Installations electriques", category: "dtu", description: "Conformite des installations electriques NF C 15-100.", reference: "NF C 15-100", severity: "major" },
  { code: "DTU-PLU-001", name: "Plomberie sanitaire", category: "dtu", description: "Pression et debit des installations sanitaires.", reference: "DTU 60.11", severity: "major" },
  { code: "DTU-ACO-001", name: "Acoustique parois", category: "dtu", description: "Isolation acoustique entre locaux et exterieur.", reference: "DTU 68.1", severity: "blocking" },
  { code: "DTU-ASS-001", name: "Assainissement autonome", category: "dtu", description: "Dimensionnement fosse septique selon nombre d'EH.", reference: "DTU 64.1", severity: "blocking" },
  // RE2020
  { code: "RE2020-BBIO-001", name: "Bbio max", category: "re2020", description: "Indicateur de besoin bioclimatique maximal.", reference: "RE2020 - Arrete du 5 avril 2021", severity: "blocking" },
  { code: "RE2020-TIC-001", name: "TIC max", category: "re2020", description: "Temperature interieure conventionnelle maximale.", reference: "RE2020 - Article 4", severity: "blocking" },
  { code: "RE2020-ICENERGIE-001", name: "Indicateur CENERGIE", category: "re2020", description: "Consommation d'energie primaire du batiment.", reference: "RE2020 - Article 5", severity: "blocking" },
  { code: "RE2020-ICRE-001", name: "Indicateur CRE", category: "re2020", description: "Part de consommation d'origine renouvelable.", reference: "RE2020 - Article 6", severity: "major" },
  { code: "RE2020-ICGHG-001", name: "Indicateur IC-GES", category: "re2020", description: "Indicateur de gaz a effet de serre sur le cycle de vie.", reference: "RE2020 - Article 7", severity: "blocking" },
  { code: "RE2020-PE-001", name: "Permeabilite a l'air", category: "re2020", description: "Taux de renouvellement d'air sous 4Pa.", reference: "RE2020 - Article 8", severity: "major" },
  { code: "RE2020-ICCONSO-001", name: "Indicateur C_CONSO", category: "re2020", description: "Indicateur de consommation d'energie pour le confort d'ete.", reference: "RE2020 - Article 9", severity: "minor" },
  { code: "RE2020-SURF-001", name: "Surface vitree / SHON", category: "re2020", description: "Ratio maximal de surface vitree par rapport a la SHON.", reference: "RE2020 - Article 10", severity: "major" },
  { code: "RE2020-EP-001", name: "Energie Primaire CEP", category: "re2020", description: "Consommation d'energie primaire totale.", reference: "RE2020 - Article 11", severity: "blocking" },
  { code: "RE2020-AP-001", name: "Attestation RE2020", category: "re2020", description: "Attestation de prise en compte RE2020.", reference: "RE2020 - Article 12", severity: "info" },
  // PMR
  { code: "PMR-SEUIL-001", name: "Seuil max 2cm", category: "pmr", description: "Hauteur maximale du seuil a l'entree.", reference: "NF P99-611 - section 5.2.1", severity: "blocking" },
  { code: "PMR-LARG-001", name: "Largeur passage min 90cm", category: "pmr", description: "Largeur minimale des circulations horizontales.", reference: "NF P99-611 - section 5.3.1", severity: "blocking" },
  { code: "PMR-PORTE-001", name: "Largeur passage porte min 83cm", category: "pmr", description: "Largeur minimale de passage des portes.", reference: "NF P99-611 - section 5.4.1", severity: "blocking" },
  { code: "PMR-WC-001", name: "Toilettes accessibles PMR", category: "pmr", description: "Dimensions et amenagement des WC accessibles.", reference: "NF P99-611 - section 6.1", severity: "major" },
  { code: "PMR-DOUCH-001", name: "Douche accessible", category: "pmr", description: "Conception des douches accessibles sans seuil.", reference: "NF P99-611 - section 6.2", severity: "blocking" },
  { code: "PMR-RAMP-001", name: "Pente rampe d'acces", category: "pmr", description: "Pente maximale des rampes d'acces.", reference: "NF P99-611 - section 4.2.3", severity: "minor" },
  { code: "PMR-POIG-001", name: "Poignees de porte", category: "pmr", description: "Type de poignees permettant une manipulation sans serrage.", reference: "NF P99-611 - section 5.4.4", severity: "minor" },
  { code: "PMR-ECL-001", name: "Eclairage des circulations", category: "pmr", description: "Niveau d'eclairement minimal dans les circulations.", reference: "NF P99-611 - section 8.1", severity: "info" },
  { code: "PMR-MAN-001", name: "Maneuvre portes", category: "pmr", description: "Effort maximal pour l'ouverture des portes.", reference: "NF P99-611 - section 5.4.3", severity: "major" },
  { code: "PMR-REV-001", name: "Revetements antiderapants", category: "pmr", description: "Classes d'antiderapance des revetements de sol.", reference: "NF P99-611 - section 5.1.2", severity: "minor" },
  // Incendie
  { code: "INC-ISSUE-001", name: "2 issues si surface > 100m²", category: "incendie", description: "Obligation de 2 issues distinctes au-dela de 100m².", reference: "ERP - Art. CO 20 section 2", severity: "info" },
  { code: "INC-DES-001", name: "Desenfumage naturel", category: "incendie", description: "Surface minimale d'ouverture pour le desenfumage.", reference: "ERP - Art. CO 33", severity: "major" },
  { code: "INC-PAR-001", name: "Compartimentage pare-flammes", category: "incendie", description: "Degre coupe-feu des elements de separation.", reference: "ERP - Art. CO 23", severity: "blocking" },
  { code: "INC-DET-001", name: "Detecteurs de fumee (DAAF)", category: "incendie", description: "Detecteurs avertisseurs autonomes de fumee.", reference: "Decret n°2015-1003", severity: "blocking" },
  { code: "INC-EXT-001", name: "Extincteur domestique", category: "incendie", description: "Presence d'extincteur a proximite.", reference: "ERP - Art. CO 41", severity: "major" },
  { code: "INC-PORT-001", name: "Porte coupe-feu", category: "incendie", description: "Degre coupe-feu des portes de compartimentage.", reference: "ERP - Art. CO 24", severity: "blocking" },
  { code: "INC-EVAC-001", name: "Chemin d'evacuation", category: "incendie", description: "Longueur maximale des chemins d'evacuation.", reference: "ERP - Art. CO 21", severity: "blocking" },
  { code: "INC-REAC-001", name: "Reaction au feu materiaux", category: "incendie", description: "Classement au feu des materiaux de construction interieurs.", reference: "ERP - Art. AM 18", severity: "major" },
  { code: "INC-DESC-001", name: "Descente securisee", category: "incendie", description: "Obligation d'escalier de secours au-dela de 8m.", reference: "ERP - Art. CO 22", severity: "info" },
  { code: "INC-BAE-001", name: "Boitier d'alerte et alarme incendie", category: "incendie", description: "Systeme d'alerte des occupants et de transmission d'alarme.", reference: "ERP - Art. CO 30", severity: "major" },
];

// ---------------------------------------------------------------------------
// Audit trail
// ---------------------------------------------------------------------------
export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export const mockAuditTrail: AuditEntry[] = [
  { id: "1", timestamp: "2026-03-15T09:00:00Z", action: "Creation projet", user: "Jean Dupont", details: "Projet 'Extension 45m² — Tremblay-en-France' cree" },
  { id: "2", timestamp: "2026-03-22T10:30:00Z", action: "Analyse terrain", user: "Systeme", details: "Site Intelligence completee — PLU zone U, COS 0.50, aucun risque majeur" },
  { id: "3", timestamp: "2026-03-22T11:00:00Z", action: "Import cadastre", user: "Systeme", details: "Parcelle 93073-AB-0123 — 750m², section AB, n°0123" },
  { id: "4", timestamp: "2026-04-05T14:00:00Z", action: "Brief architectural", user: "Jean Dupont", details: "4 pieces definies — Salon 25m², Cuisine 10m², SDB 10m², WC 3m²" },
  { id: "5", timestamp: "2026-04-10T09:00:00Z", action: "Esquisses", user: "Jean Dupont", details: "3 variantes generees — variante B retenue (salon Sud, cuisine Nord)" },
  { id: "6", timestamp: "2026-04-20T16:00:00Z", action: "Plan detaille", user: "Jean Dupont", details: "Plans 2D et 3D finalises — toiture terrasse, baie coulissante 4m" },
  { id: "7", timestamp: "2026-05-10T14:30:00Z", action: "Evaluation conformite", user: "Systeme", details: "50 regles evaluees — taux global 76%, 3 anomalies bloquantes identifiees" },
  { id: "8", timestamp: "2026-05-10T14:35:00Z", action: "Alerte bloquante", user: "Systeme", details: "3 problemes bloquants : emprise au sol, CEP RE2020, porte coupe-feu" },
  { id: "9", timestamp: "2026-05-11T09:15:00Z", action: "Consultation", user: "Jean Dupont", details: "Revu des resultats de conformite — plan d'action etabli" },
  { id: "10", timestamp: "2026-05-11T11:00:00Z", action: "Modification", user: "Jean Dupont", details: "Ajustement profondeur extension (-50cm) pour resoudre URB-EMP-001" },
];

// ---------------------------------------------------------------------------
// Site intelligence data (re-export depuis siteIntelData)
// ---------------------------------------------------------------------------
export type { SiteIntelData } from './siteIntelData';
export { mockSiteIntel } from './siteIntelData';
