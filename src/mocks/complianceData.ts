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

export const mockEvaluationResult: EvaluationResult = {
  project_id: "1",
  evaluated_at: "2026-05-12T10:30:00Z",
  summary: {
    total_rules: 50,
    passed: 36,
    failed: 8,
    warnings: 4,
    not_applicable: 2,
    compliance_rate: 72,
  },
  results: [
    // ===== URBANISME (10 règles : 8 pass, 2 fail) =====
    {
      rule_code: "URB-COS-001",
      rule_name: "Coefficient d'Occupation du Sol",
      category: "urbanisme",
      status: "pass",
      message: "Surface au sol (25.0m²) respecte le COS (0.5 → 375.0m² max)",
      severity: "blocking",
      evaluated_values: { surface_au_sol: 25, cos_max: 0.5, surface_parcelle: 750 },
    },
    {
      rule_code: "URB-HT-001",
      rule_name: "Hauteur max bâtiment",
      category: "urbanisme",
      status: "pass",
      message: "Hauteur (3.5m) respecte la limite (12.0m)",
      severity: "blocking",
      evaluated_values: { hauteur: 3.5, hauteur_max: 12 },
    },
    {
      rule_code: "URB-REC-001",
      rule_name: "Recul voie publique",
      category: "urbanisme",
      status: "pass",
      message: "Recul (4.0m) respecte le minimum (3.0m)",
      severity: "blocking",
      evaluated_values: { recul: 4.0, recul_min: 3.0 },
    },
    {
      rule_code: "URB-RECL-001",
      rule_name: "Recul latéral",
      category: "urbanisme",
      status: "pass",
      message: "Recul latéral (2.5m) respecte le minimum (1.5m)",
      severity: "major",
      evaluated_values: { recul_lateral: 2.5, recul_lateral_min: 1.5 },
    },
    {
      rule_code: "URB-RECF-001",
      rule_name: "Recul fond de parcelle",
      category: "urbanisme",
      status: "pass",
      message: "Recul fond (4.0m) respecte le minimum (3.0m)",
      severity: "major",
      evaluated_values: { recul_fond: 4.0, recul_fond_min: 3.0 },
    },
    {
      rule_code: "URB-EMP-001",
      rule_name: "Emprise au sol",
      category: "urbanisme",
      status: "pass",
      message: "Emprise (25m²) respecte la limite (375m²)",
      severity: "blocking",
      evaluated_values: { emprise: 25, emprise_max: 375 },
    },
    {
      rule_code: "URB-SHON-001",
      rule_name: "SHON / Surface Hors Oeuvre Nette",
      category: "urbanisme",
      status: "pass",
      message: "SHON (22.5m²) dans la limite autorisée",
      severity: "major",
      evaluated_values: { shon: 22.5, shon_max: 500 },
    },
    {
      rule_code: "URB-SHP-001",
      rule_name: "Surface Habitable Plancher",
      category: "urbanisme",
      status: "pass",
      message: "SHP (20m²) respecte les règles du PLU",
      severity: "info",
      evaluated_values: { shp: 20, shp_max: 450 },
    },
    {
      rule_code: "URB-CES-001",
      rule_name: "Coefficient d'Emprise au Sol (CES)",
      category: "urbanisme",
      status: "fail",
      message: "CES (0.45) dépasse la limite autorisée (0.40)",
      severity: "blocking",
      evaluated_values: { ces: 0.45, ces_max: 0.4, surface_construite: 337.5, surface_parcelle: 750 },
    },
    {
      rule_code: "URB-ALN-001",
      rule_name: "Alignement de façade",
      category: "urbanisme",
      status: "fail",
      message: "Le bâtiment n'est pas en alignement avec la rue (décalage 1.2m > 0.5m autorisé)",
      severity: "major",
      evaluated_values: { decalage: 1.2, decalage_max: 0.5 },
    },

    // ===== DTU (10 règles : 8 pass, 2 fail) =====
    {
      rule_code: "DTU-ISO-001",
      rule_name: "Isolation thermique parois",
      category: "dtu",
      status: "pass",
      message: "Résistance thermique R=4.5m².K/W > Rmin=4.0m².K/W",
      severity: "major",
      evaluated_values: { r_mesure: 4.5, r_min: 4.0 },
    },
    {
      rule_code: "DTU-HU-001",
      rule_name: "Protection humidité fondations",
      category: "dtu",
      status: "pass",
      message: "Étanchéité et drainage conformes DTU 20.1",
      severity: "blocking",
      evaluated_values: { conformite: 1 },
    },
    {
      rule_code: "DTU-PLA-001",
      rule_name: "Plancher technique",
      category: "dtu",
      status: "pass",
      message: "Plancher conforme DTU 23.1 — charge admissible respectée",
      severity: "major",
      evaluated_values: { charge: 250, charge_adm: 300 },
    },
    {
      rule_code: "DTU-CHA-001",
      rule_name: "Charpente traditionnelle",
      category: "dtu",
      status: "pass",
      message: "Charpente conforme DTU 31.1 — sections et entraxes validés",
      severity: "blocking",
      evaluated_values: { portee: 3.5, portee_max: 4.0 },
    },
    {
      rule_code: "DTU-COU-001",
      rule_name: "Couverture et bardage",
      category: "dtu",
      status: "pass",
      message: "Couverture conforme DTU 40.2 — pente (35°) > pente mini (25°)",
      severity: "major",
      evaluated_values: { pente: 35, pente_min: 25 },
    },
    {
      rule_code: "DTU-MENU-001",
      rule_name: "Menuiseries extérieures",
      category: "dtu",
      status: "pass",
      message: "Menuiseries conformes DTU 36.1 — étanchéité à l'air validée",
      severity: "major",
      evaluated_values: { permeabilite: 0.5, permeabilite_max: 1.2 },
    },
    {
      rule_code: "DTU-ELEC-001",
      rule_name: "Installations électriques",
      category: "dtu",
      status: "pass",
      message: "Installation électrique conforme NF C 15-100 — sections câbles validées",
      severity: "blocking",
      evaluated_values: { section: 2.5, section_min: 1.5 },
    },
    {
      rule_code: "DTU-ITC-001",
      rule_name: "Installations thermiques",
      category: "dtu",
      status: "pass",
      message: "Système de chauffage conforme DTU 61.1",
      severity: "major",
      evaluated_values: { puissance: 8, puissance_calculee: 7.5 },
    },
    {
      rule_code: "DTU-ASS-001",
      rule_name: "Assainissement autonome",
      category: "dtu",
      status: "fail",
      message: "Fosse septique non conforme — capacité (2000L) insuffisante pour 5 EH (3000L requis)",
      severity: "blocking",
      evaluated_values: { capacite: 2000, capacite_min: 3000, nb_eh: 5 },
    },
    {
      rule_code: "DTU-PLU-001",
      rule_name: "Plomberie sanitaire",
      category: "dtu",
      status: "fail",
      message: "Pression eau (1.5 bar) inférieure au minimum requis (2.0 bar)",
      severity: "major",
      evaluated_values: { pression: 1.5, pression_min: 2.0 },
    },

    // ===== RE2020 (10 règles : 6 pass, 3 fail, 1 warning) =====
    {
      rule_code: "RE2020-BBIO-001",
      rule_name: "Bbio max (Bâtiment Basse Consommation)",
      category: "re2020",
      status: "fail",
      message: "Bbio (1.45) dépasse la limite réglementaire (1.30)",
      severity: "blocking",
      evaluated_values: { bbio: 1.45, bbio_max: 1.30 },
    },
    {
      rule_code: "RE2020-TIC-001",
      rule_name: "Température Intérieur Conventionnelle max",
      category: "re2020",
      status: "fail",
      message: "TIC (68°C) dépasse la limite (60°C) — risque de surchauffe estivale",
      severity: "blocking",
      evaluated_values: { tic: 68, tic_max: 60 },
    },
    {
      rule_code: "RE2020-ICENERGIE-001",
      rule_name: "Indicateur CENERGIE",
      category: "re2020",
      status: "pass",
      message: "Cep (120 kWh/m².an) < Cep_max (150 kWh/m².an)",
      severity: "blocking",
      evaluated_values: { cep: 120, cep_max: 150 },
    },
    {
      rule_code: "RE2020-ICRE-001",
      rule_name: "Indicateur CRE (Consommation RE)",
      category: "re2020",
      status: "pass",
      message: "CRE (8 kWh/m².an) respecte la seuil (15 kWh/m².an)",
      severity: "major",
      evaluated_values: { cre: 8, cre_max: 15 },
    },
    {
      rule_code: "RE2020-ICGHG-001",
      rule_name: "Indicateur IC-GES",
      category: "re2020",
      status: "pass",
      message: "Émissions GES (12 kgCO2/m².an) < seuil (20 kgCO2/m².an)",
      severity: "blocking",
      evaluated_values: { gges: 12, gges_max: 20 },
    },
    {
      rule_code: "RE2020-PE-001",
      rule_name: "Perméabilité à l'air (Q4Pa-surf)",
      category: "re2020",
      status: "warning",
      message: "Perméabilité (2.5 m³/h.m²) proche de la limite (2.0 m³/h.m²)",
      severity: "major",
      evaluated_values: { q4pa: 2.5, q4pa_max: 2.0 },
    },
    {
      rule_code: "RE2020-ICCONSO-001",
      rule_name: "Indicateur C_CONSO (Confort d'été)",
      category: "re2020",
      status: "pass",
      message: "Conso (45 kWh/m².an) < limite (65 kWh/m².an)",
      severity: "minor",
      evaluated_values: { cconso: 45, cconso_max: 65 },
    },
    {
      rule_code: "RE2020-SURF-001",
      rule_name: "Surface vitrée / SHON",
      category: "re2020",
      status: "fail",
      message: "Ratio surfaces vitrées (32%) dépasse le maximum recommandé (25%)",
      severity: "major",
      evaluated_values: { ratio_vitree: 0.32, ratio_vitree_max: 0.25, surf_vitree: 7.2, shon: 22.5 },
    },
    {
      rule_code: "RE2020-EP-001",
      rule_name: "Energie Primaire CEP",
      category: "re2020",
      status: "pass",
      message: "CEP (95 kWhEP/m².an) respecte la valeur seuil (130 kWhEP/m².an)",
      severity: "blocking",
      evaluated_values: { cep_ep: 95, cep_ep_max: 130 },
    },
    {
      rule_code: "RE2020-AP-001",
      rule_name: "Attestation de Prise en Compte RE2020",
      category: "re2020",
      status: "pass",
      message: "Attestation RE2020 présente et complète",
      severity: "info",
      evaluated_values: { attestation_presente: 1 },
    },

    // ===== PMR (10 règles : 7 pass, 2 fail, 1 warning) =====
    {
      rule_code: "PMR-SEUIL-001",
      rule_name: "Seuil max 2cm",
      category: "pmr",
      status: "fail",
      message: "Seuil à l'entrée (3.5cm) dépasse la limite (2.0cm)",
      severity: "blocking",
      evaluated_values: { seuil: 3.5, seuil_max: 2.0 },
    },
    {
      rule_code: "PMR-LARG-001",
      rule_name: "Largeur passage min 90cm",
      category: "pmr",
      status: "pass",
      message: "Largeur couloir (1.10m) respecte le minimum (0.90m)",
      severity: "blocking",
      evaluated_values: { largeur: 1.1, largeur_min: 0.9 },
    },
    {
      rule_code: "PMR-PORTE-001",
      rule_name: "Largeur passage porte min 83cm",
      category: "pmr",
      status: "pass",
      message: "Passage portes (0.90m) conforme (0.83m min)",
      severity: "blocking",
      evaluated_values: { passage_porte: 0.9, passage_min: 0.83 },
    },
    {
      rule_code: "PMR-WC-001",
      rule_name: "Toilettes accessibles PMR",
      category: "pmr",
      status: "pass",
      message: "WC PMR dimensionné (0.80x1.30m) conforme à la norme",
      severity: "major",
      evaluated_values: { dim_wc: 1.04, dim_wc_min: 0.78 },
    },
    {
      rule_code: "PMR-DOUCH-001",
      rule_name: "Douche accessible",
      category: "pmr",
      status: "pass",
      message: "Douche à l'italienne avec seuil (0cm) conforme",
      severity: "blocking",
      evaluated_values: { seuil_douche: 0, seuil_douche_max: 2.0 },
    },
    {
      rule_code: "PMR-RAMP-001",
      rule_name: "Pente rampe d'accès",
      category: "pmr",
      status: "warning",
      message: "Pente rampe (7%) légèrement supérieure à l'idéal (5%)",
      severity: "minor",
      evaluated_values: { pente_rampe: 7, pente_ideal: 5, pente_max: 10 },
    },
    {
      rule_code: "PMR-POIG-001",
      rule_name: "Poignées de porte",
      category: "pmr",
      status: "pass",
      message: "Poignées levier conformes — maniement sans serrage",
      severity: "minor",
      evaluated_values: { type_poignee: 1 },
    },
    {
      rule_code: "PMR-ECL-001",
      rule_name: "Éclairage des circulations",
      category: "pmr",
      status: "pass",
      message: "Éclairage (450 lux) > minimum requis (150 lux)",
      severity: "info",
      evaluated_values: { eclairement: 450, eclairement_min: 150 },
    },
    {
      rule_code: "PMR-MAN-001",
      rule_name: "Manœuvre portes",
      category: "pmr",
      status: "fail",
      message: "Effort ouverture porte (35N) dépasse la limite (20N) pour une personne en fauteuil",
      severity: "major",
      evaluated_values: { effort_ouverture: 35, effort_max: 20 },
    },
    {
      rule_code: "PMR-REV-001",
      rule_name: "Revetements de sol antidérapants",
      category: "pmr",
      status: "pass",
      message: "Classes antidérapantes R10-R11 conformes aux zones humides",
      severity: "minor",
      evaluated_values: { classe_antiderapant: 10, classe_min: 9 },
    },

    // ===== INCENDIE (10 règles : 7 pass, 2 fail, 1 not_applicable) =====
    {
      rule_code: "INC-ISSUE-001",
      rule_name: "2 issues si surface > 100m²",
      category: "incendie",
      status: "not_applicable",
      message: "Surface (25m²) < 100m², règle non applicable pour ce type d'extension",
      severity: "info",
      evaluated_values: { surface: 25, seuil_surface: 100 },
    },
    {
      rule_code: "INC-DES-001",
      rule_name: "Désenfumage naturel",
      category: "incendie",
      status: "pass",
      message: "Surface désenfumage (1.5m²) > surface minimale (1.0m²)",
      severity: "major",
      evaluated_values: { surf_desenfumage: 1.5, surf_desenfumage_min: 1.0 },
    },
    {
      rule_code: "INC-PAR-001",
      rule_name: "Compartimentage pare-flammes",
      category: "incendie",
      status: "pass",
      message: "Séparation REI30 conforme pour l'extension sur coursive",
      severity: "blocking",
      evaluated_values: { rei: 30, rei_min: 30 },
    },
    {
      rule_code: "INC-DET-001",
      rule_name: "Détecteurs de fumée (DAAF)",
      category: "incendie",
      status: "pass",
      message: "1 DAAF installé pour 25m² — conforme NF EN 14604",
      severity: "blocking",
      evaluated_values: { nb_daaf: 1, nb_daaf_min: 1 },
    },
    {
      rule_code: "INC-EXT-001",
      rule_name: "Extincteur domestique",
      category: "incendie",
      status: "pass",
      message: "Extincteur ABC 2kg présent à moins de 15m des locaux",
      severity: "major",
      evaluated_values: { dist_extincteur: 8, dist_max: 15 },
    },
    {
      rule_code: "INC-PORT-001",
      rule_name: "Porte coupe-feu",
      category: "incendie",
      status: "fail",
      message: "Porte séparatrice non CF (EI0) — EI30 requis pour le compartimentage",
      severity: "blocking",
      evaluated_values: { ei_porte: 0, ei_min: 30 },
    },
    {
      rule_code: "INC-EVAC-001",
      rule_name: "Chemin d'évacuation",
      category: "incendie",
      status: "pass",
      message: "Longueur chemin évacuation (8m) < maximum (15m) avec issue directe",
      severity: "blocking",
      evaluated_values: { longueur_evac: 8, longueur_max: 15 },
    },
    {
      rule_code: "INC-REAC-001",
      rule_name: "Réaction au feu matériaux",
      category: "incendie",
      status: "pass",
      message: "Matériaux intérieurs M1 (plafond) et M2 (murs) conformes",
      severity: "major",
      evaluated_values: { classe_plafond: 1, classe_murs: 2, classe_min: 3 },
    },
    {
      rule_code: "INC-DESC-001",
      rule_name: "Descente sécurisée incendie",
      category: "incendie",
      status: "fail",
      message: "Escalier de secours absent pour l'étage supérieur accessible (>8m de hauteur)",
      severity: "blocking",
      evaluated_values: { hauteur_etage: 3.5, hauteur_total: 10.5, escalier_secours: 0 },
    },
    {
      rule_code: "INC-BAE-001",
      rule_name: "Boîtier d'alerte et alarme incendie",
      category: "incendie",
      status: "pass",
      message: "BAEI installé avec liaison télésurveillance conforme",
      severity: "major",
      evaluated_values: { baei: 1 },
    },
  ],
};

// Règles actives avec descriptions détaillées pour l'onglet "Règles actives"
export interface ActiveRule {
  code: string;
  name: string;
  category: 'urbanisme' | 'dtu' | 're2020' | 'pmr' | 'incendie';
  description: string;
  reference: string;
  severity: 'blocking' | 'major' | 'minor' | 'info';
}

export const mockActiveRules: ActiveRule[] = [
  { code: "URB-COS-001", name: "Coefficient d'Occupation du Sol", category: "urbanisme", description: "Le COS est le rapport entre la surface construite et la surface totale de la parcelle.", reference: "PLU - Article U.3.1", severity: "blocking" },
  { code: "URB-HT-001", name: "Hauteur max bâtiment", category: "urbanisme", description: "Hauteur maximale de construction autorisée selon la zone PLU.", reference: "PLU - Article U.3.2", severity: "blocking" },
  { code: "URB-REC-001", name: "Recul voie publique", category: "urbanisme", description: "Distance minimale entre la façade et l'alignement de la voie publique.", reference: "PLU - Article U.3.3", severity: "blocking" },
  { code: "URB-RECL-001", name: "Recul latéral", category: "urbanisme", description: "Distance minimale entre le bâtiment et les limites latérales de la parcelle.", reference: "PLU - Article U.3.4", severity: "major" },
  { code: "URB-RECF-001", name: "Recul fond de parcelle", category: "urbanisme", description: "Distance minimale entre le bâtiment et la limite arrière de la parcelle.", reference: "PLU - Article U.3.5", severity: "major" },
  { code: "URB-EMP-001", name: "Emprise au sol", category: "urbanisme", description: "Surface couverte par le bâtiment au niveau du sol.", reference: "PLU - Article U.3.6", severity: "blocking" },
  { code: "URB-SHON-001", name: "SHON / Surface Hors Oeuvre Nette", category: "urbanisme", description: "Surface de plancher mesurée selon les règles de la SHON.", reference: "Code de l'urbanisme - L.112-2", severity: "major" },
  { code: "URB-SHP-001", name: "Surface Habitable Plancher", category: "urbanisme", description: "Surface habitable multipliée par le coefficient d'occupation.", reference: "PLU - Article U.3.7", severity: "info" },
  { code: "URB-CES-001", name: "Coefficient d'Emprise au Sol (CES)", category: "urbanisme", description: "Rapport entre l'emprise au sol et la surface totale de la parcelle.", reference: "PLU - Article U.3.8", severity: "blocking" },
  { code: "URB-ALN-001", name: "Alignement de façade", category: "urbanisme", description: "Le bâtiment doit respecter l'alignement des façades sur la voie publique.", reference: "PLU - Article U.3.9", severity: "major" },
  { code: "DTU-ISO-001", name: "Isolation thermique parois", category: "dtu", description: "Résistance thermique minimale des parois opaques et vitrées.", reference: "DTU 26.1 / RT2012", severity: "major" },
  { code: "DTU-HU-001", name: "Protection humidité fondations", category: "dtu", description: "Dispositions constructives pour protéger les fondations de l'humidité.", reference: "DTU 20.1", severity: "blocking" },
  { code: "DTU-PLA-001", name: "Plancher technique", category: "dtu", description: "Conception et calcul des planchers selon les DTU.", reference: "DTU 23.1 / 23.2", severity: "major" },
  { code: "DTU-CHA-001", name: "Charpente traditionnelle", category: "dtu", description: "Dimensionnement et mise en oeuvre des charpentes bois.", reference: "DTU 31.1 / 31.2", severity: "blocking" },
  { code: "DTU-COU-001", name: "Couverture et bardage", category: "dtu", description: "Pente minimale et pose des éléments de couverture.", reference: "DTU 40.2 / 40.21", severity: "major" },
  { code: "DTU-MENU-001", name: "Menuiseries extérieures", category: "dtu", description: "Performances des menuiseries et étanchéité à l'air.", reference: "DTU 36.1 / 36.5", severity: "major" },
  { code: "DTU-ELEC-001", name: "Installations électriques", category: "dtu", description: "Conformité des installations électriques selon la NF C 15-100.", reference: "NF C 15-100", severity: "blocking" },
  { code: "DTU-ITC-001", name: "Installations thermiques", category: "dtu", description: "Dimensionnement et installation des systèmes de chauffage.", reference: "DTU 61.1 / 61.11", severity: "major" },
  { code: "DTU-ASS-001", name: "Assainissement autonome", category: "dtu", description: "Conception et dimensionnement des fosses septiques.", reference: "DTU 64.1", severity: "blocking" },
  { code: "DTU-PLU-001", name: "Plomberie sanitaire", category: "dtu", description: "Pression et débit des installations sanitaires.", reference: "DTU 60.11", severity: "major" },
  { code: "RE2020-BBIO-001", name: "Bbio max", category: "re2020", description: "Indicateur de besoin bioclimatique maximal pour le bâtiment.", reference: "RE2020 - Arrêté du 5 avril 2021", severity: "blocking" },
  { code: "RE2020-TIC-001", name: "TIC max", category: "re2020", description: "Température intérieure conventionnelle maximale admissible.", reference: "RE2020 - Article 4", severity: "blocking" },
  { code: "RE2020-ICENERGIE-001", name: "Indicateur CENERGIE", category: "re2020", description: "Consommation d'énergie primaire du bâtiment.", reference: "RE2020 - Article 5", severity: "blocking" },
  { code: "RE2020-ICRE-001", name: "Indicateur CRE", category: "re2020", description: "Part de consommation d'origine renouvelable.", reference: "RE2020 - Article 6", severity: "major" },
  { code: "RE2020-ICGHG-001", name: "Indicateur IC-GES", category: "re2020", description: "Indicateur de gaz à effet de serre sur le cycle de vie.", reference: "RE2020 - Article 7", severity: "blocking" },
  { code: "RE2020-PE-001", name: "Perméabilité à l'air", category: "re2020", description: "Taux de renouvellement d'air sous 4Pa.", reference: "RE2020 - Article 8", severity: "major" },
  { code: "RE2020-ICCONSO-001", name: "Indicateur C_CONSO", category: "re2020", description: "Indicateur de consommation d'énergie pour le confort d'été.", reference: "RE2020 - Article 9", severity: "minor" },
  { code: "RE2020-SURF-001", name: "Surface vitrée / SHON", category: "re2020", description: "Ratio maximal de surface vitrée par rapport à la SHON.", reference: "RE2020 - Article 10", severity: "major" },
  { code: "RE2020-EP-001", name: "Energie Primaire CEP", category: "re2020", description: "Consommation d'énergie primaire totale du bâtiment.", reference: "RE2020 - Article 11", severity: "blocking" },
  { code: "RE2020-AP-001", name: "Attestation RE2020", category: "re2020", description: "Attestation de prise en compte de la réglementation RE2020.", reference: "RE2020 - Article 12", severity: "info" },
  { code: "PMR-SEUIL-001", name: "Seuil max 2cm", category: "pmr", description: "Hauteur maximale du seuil à l'entrée du bâtiment.", reference: "NF P99-611 - §5.2.1", severity: "blocking" },
  { code: "PMR-LARG-001", name: "Largeur passage min 90cm", category: "pmr", description: "Largeur minimale des circulations horizontales intérieures.", reference: "NF P99-611 - §5.3.1", severity: "blocking" },
  { code: "PMR-PORTE-001", name: "Largeur passage porte min 83cm", category: "pmr", description: "Largeur minimale de passage des portes.", reference: "NF P99-611 - §5.4.1", severity: "blocking" },
  { code: "PMR-WC-001", name: "Toilettes accessibles PMR", category: "pmr", description: "Dimensions et aménagement des WC accessibles.", reference: "NF P99-611 - §6.1", severity: "major" },
  { code: "PMR-DOUCH-001", name: "Douche accessible", category: "pmr", description: "Conception des douches accessibles sans seuil.", reference: "NF P99-611 - §6.2", severity: "blocking" },
  { code: "PMR-RAMP-001", name: "Pente rampe d'accès", category: "pmr", description: "Pente maximale des rampes d'accès pour fauteuil roulant.", reference: "NF P99-611 - §4.2.3", severity: "minor" },
  { code: "PMR-POIG-001", name: "Poignées de porte", category: "pmr", description: "Type de poignées permettant une manipulation sans serrage.", reference: "NF P99-611 - §5.4.4", severity: "minor" },
  { code: "PMR-ECL-001", name: "Éclairage des circulations", category: "pmr", description: "Niveau d'éclairement minimal dans les circulations.", reference: "NF P99-611 - §8.1", severity: "info" },
  { code: "PMR-MAN-001", name: "Manœuvre portes", category: "pmr", description: "Effort maximal pour l'ouverture des portes.", reference: "NF P99-611 - §5.4.3", severity: "major" },
  { code: "PMR-REV-001", name: "Revetements de sol antidérapants", category: "pmr", description: "Classes d'antidérapance des revêtements de sol.", reference: "NF P99-611 - §5.1.2", severity: "minor" },
  { code: "INC-ISSUE-001", name: "2 issues si surface > 100m²", category: "incendie", description: "Obligation de 2 issues distinctes au-delà de 100m².", reference: "ERP - Art. CO 20 §2", severity: "info" },
  { code: "INC-DES-001", name: "Désenfumage naturel", category: "incendie", description: "Surface minimale d'ouverture pour le désenfumage naturel.", reference: "ERP - Art. CO 33", severity: "major" },
  { code: "INC-PAR-001", name: "Compartimentage pare-flammes", category: "incendie", description: "Degré coupe-feu des éléments de séparation.", reference: "ERP - Art. CO 23", severity: "blocking" },
  { code: "INC-DET-001", name: "Détecteurs de fumée (DAAF)", category: "incendie", description: "Obligation d'installations de détecteurs avertisseurs autonomes de fumée.", reference: "Décret n°2015-1003", severity: "blocking" },
  { code: "INC-EXT-001", name: "Extincteur domestique", category: "incendie", description: "Présence d'extincteur à proximité des locaux.", reference: "ERP - Art. CO 41", severity: "major" },
  { code: "INC-PORT-001", name: "Porte coupe-feu", category: "incendie", description: "Degré coupe-feu des portes de compartimentage.", reference: "ERP - Art. CO 24", severity: "blocking" },
  { code: "INC-EVAC-001", name: "Chemin d'évacuation", category: "incendie", description: "Longueur maximale des chemins d'évacuation vers une issue.", reference: "ERP - Art. CO 21", severity: "blocking" },
  { code: "INC-REAC-001", name: "Réaction au feu matériaux", category: "incendie", description: "Classement au feu des matériaux de construction intérieurs.", reference: "ERP - Art. AM 18", severity: "major" },
  { code: "INC-DESC-001", name: "Descente sécurisée incendie", category: "incendie", description: "Obligation d'un escalier de secours au-delà de 8m de hauteur.", reference: "ERP - Art. CO 22", severity: "blocking" },
  { code: "INC-BAE-001", name: "Boîtier d'alerte et alarme incendie", category: "incendie", description: "Système d'alerte des occupants et de transmission d'alarme.", reference: "ERP - Art. CO 30", severity: "major" },
];

// Audit trail mock
export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export const mockAuditTrail: AuditEntry[] = [
  { id: "1", timestamp: "2026-05-12T10:30:00Z", action: "Lancement évaluation", user: "Système", details: "Évaluation complète lancée pour le projet Extension cuisine" },
  { id: "2", timestamp: "2026-05-12T10:30:15Z", action: "Règles urbanisme", user: "Système", details: "10 règles urbanisme évaluées — 8 pass, 2 fail" },
  { id: "3", timestamp: "2026-05-12T10:30:28Z", action: "Règles DTU", user: "Système", details: "10 règles DTU évaluées — 8 pass, 2 fail" },
  { id: "4", timestamp: "2026-05-12T10:30:42Z", action: "Règles RE2020", user: "Système", details: "10 règles RE2020 évaluées — 6 pass, 3 fail, 1 warning" },
  { id: "5", timestamp: "2026-05-12T10:30:55Z", action: "Règles PMR", user: "Système", details: "10 règles PMR évaluées — 7 pass, 2 fail, 1 warning" },
  { id: "6", timestamp: "2026-05-12T10:31:08Z", action: "Règles incendie", user: "Système", details: "10 règles incendie évaluées — 7 pass, 2 fail, 1 N/A" },
  { id: "7", timestamp: "2026-05-12T10:31:20Z", action: "Calcul score global", user: "Système", details: "Taux de conformité calculé : 72%" },
  { id: "8", timestamp: "2026-05-12T10:31:25Z", action: "Génération rapport", user: "Système", details: "Rapport d'évaluation généré (PDF)" },
  { id: "9", timestamp: "2026-05-12T10:32:00Z", action: "Alerte bloquante", user: "Système", details: "5 anomalies bloquantes identifiées — action requise" },
  { id: "10", timestamp: "2026-05-12T11:15:00Z", action: "Consultation", user: "Marie Dubois", details: "Consultation du rapport de conformité" },
];

// Site intelligence mock data
export interface SiteIntelData {
  parcelle: {
    surface: number;
    cadastre_id: string;
    section: string;
    numero: string;
    coordonnees: { lat: number; lng: number };
    adresse: string;
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
  raw_data: Record<string, unknown>;
}

export const mockSiteIntel: SiteIntelData = {
  parcelle: {
    surface: 750,
    cadastre_id: "93073-000-AB-0123",
    section: "AB",
    numero: "0123",
    coordonnees: { lat: 48.9896, lng: 2.5701 },
    adresse: "12 Rue de Paris, 93290 Tremblay-en-France",
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
    gaspar: { niveau: "vert", libelle: "Aucun risque identifié", detail: "Aucun PPRN recensé sur la commune" },
    sismicite: { zone: "1", libelle: "Zone 1 (faible)" },
    inondation: { statut: "hors_zone", libelle: "Hors zone inondable", detail: "Non concerné par les zones de suraléas" },
    radon: { classe: "2", libelle: "Catégorie 2 (concentration modérée)" },
    argile: { risque: "faible", libelle: "Risque retrait-gonflement des argiles faible" },
  },
  raw_data: {
    source_cadastre: "DGFiP - Etalab",
    source_plu: "Tremblay-en-France - PLU 2023",
    source_risques: "GASPAR, BRGM, IRSN",
    date_actualisation: "2026-04-15",
    references: {
      plu: "PLU approuvé le 15/03/2023",
      risques: "PPRN aucun - TRI N/A",
    },
  },
};
