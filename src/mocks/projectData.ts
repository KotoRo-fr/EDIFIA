import type { Project, Brief, Room, ComplianceCheck, DashboardStats, User, TimelineStep } from '@/types';

// ---------------------------------------------------------------------------
// Utilisateur démo
// ---------------------------------------------------------------------------
export const mockUser: User = {
  id: "user-demo-001",
  email: "jean.dupont@edifia.fr",
  first_name: "Jean",
  last_name: "Dupont",
  role: "owner",
  is_verified: true,
  created_at: "2026-01-10T08:00:00Z",
};

export const mockArchitect = {
  name: "Jean Dupont",
  title: "Architecte DPLG",
  email: "jean.dupont@edifia.fr",
  phone: "06 12 34 56 78",
  rge_number: "RGE-2024-001234",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const createBrief = (
  projectId: string,
  rooms: { id?: string; type: string; name: string; surface: number; orientation?: string; priority: number; adjacency?: string[] }[],
  budget?: string,
  style?: string,
  status: 'draft' | 'completed' | 'validated' = 'validated'
): Brief => ({
  id: `brief-${projectId}`,
  project_id: projectId,
  rooms: rooms.map((r, i) => ({
    id: r.id || `room-${projectId}-${i}`,
    type: r.type,
    name: r.name,
    surface: r.surface,
    orientation: r.orientation,
    priority: r.priority,
    adjacency: r.adjacency,
  })) as Room[],
  constraints: { budget_range: budget || "99-135k", etage: "RDC" },
  preferences: { style: style || "contemporain", exigences: "Ouverture salon sur cuisine, toiture terrasse, menuiseries aluminium" },
  budget_range: budget || "99 000€ - 135 000€",
  style_preference: style || "contemporain",
  status,
});

const cChecks = (pid: string): ComplianceCheck[] => [
  { id: `cc-${pid}-1`, project_id: pid, rule_code: "URB-COS-001", rule_name: "COS", category: "urbanisme", status: "pass", message: "COS respecté — emprise 45m² / 375m² max", evaluated_at: "2026-05-10T10:00:00Z" },
  { id: `cc-${pid}-2`, project_id: pid, rule_code: "URB-HAU-001", rule_name: "Hauteur max", category: "urbanisme", status: "pass", message: "Hauteur 3.2m conforme (max 12m)", evaluated_at: "2026-05-10T10:00:00Z" },
  { id: `cc-${pid}-3`, project_id: pid, rule_code: "RE2-CEP-001", rule_name: "CEP RE2020", category: "re2020", status: "fail", message: "CEP (165 kWh/m².an) dépasse la limite (130 kWh/m².an)", evaluated_at: "2026-05-10T10:00:00Z" },
  { id: `cc-${pid}-4`, project_id: pid, rule_code: "INC-SOR-001", rule_name: "Issue secours", category: "incendie", status: "fail", message: "Issue de secours non conforme — largeur 0.72m < 0.90m requis", evaluated_at: "2026-05-10T10:00:00Z" },
  { id: `cc-${pid}-5`, project_id: pid, rule_code: "DTU-ISO-001", rule_name: "Isolation parois", category: "dtu", status: "pass", message: "R=4.2m².K/W > Rmin=4.0m².K/W", evaluated_at: "2026-05-10T10:00:00Z" },
];

// ---------------------------------------------------------------------------
// PROJET PRINCIPAL — Tremblay-en-France
// ---------------------------------------------------------------------------
export const tremblayProjectId = "proj-tremblay-001";

export const mockTremblayRooms = [
  { id: "room-tremblay-0", type: "salon", name: "Salon-Séjour", surface: 25, orientation: "S", priority: 1, adjacency: ["cuisine"] },
  { id: "room-tremblay-1", type: "cuisine", name: "Cuisine Ouverte", surface: 10, orientation: "N", priority: 2, adjacency: ["salon"] },
  { id: "room-tremblay-2", type: "salle_de_bain", name: "Salle de Bain", surface: 10, orientation: "E", priority: 3, adjacency: ["couloir"] },
  { id: "room-tremblay-3", type: "wc", name: "WC Séparé", surface: 3, orientation: "N", priority: 4, adjacency: ["couloir", "salle_de_bain"] },
];

export const tremblayProject: Project = {
  id: tremblayProjectId,
  user_id: mockUser.id,
  name: "Extension 45m² — Tremblay-en-France",
  description: "Extension en rez-de-chaussée d'une maison individuelle existante. Création d'un salon-séjour ouvert sur cuisine, salle de bain et wc séparé. Toiture terrasse avec étanchéité multicouche. Menuiseries aluminium double vitrage.",
  project_type: "extension_under_40",
  status: "compliance",
  parcel_address: "12 Rue de la Paix, 93290 Tremblay-en-France",
  parcel_cadastre_id: "93073-AB-0123",
  surface_approx: 45,
  commune_code: "93073",
  commune_name: "Tremblay-en-France",
  created_at: "2026-03-15T09:00:00Z",
  updated_at: "2026-05-10T14:30:00Z",
  brief: createBrief(tremblayProjectId, mockTremblayRooms, "99 000€ - 135 000€", "contemporain", "validated"),
  compliance_checks: cChecks(tremblayProjectId),
};

// ---------------------------------------------------------------------------
// PROJET SECONDAIRE 1 — En brief (statut initial)
// ---------------------------------------------------------------------------
export const blancMesnilProjectId = "proj-bm-001";

export const blancMesnilProject: Project = {
  id: blancMesnilProjectId,
  user_id: mockUser.id,
  name: "Surélévation Chambre — Le Blanc-Mesnil",
  description: "Surélévation d'un étage pour création d'une chambre parentale avec salle d'eau. Ossature bois avec isolation fibre de bois. Couverture ardoise.",
  project_type: "extension_under_40",
  status: "programming",
  parcel_address: "24 Avenue de la République, 93150 Le Blanc-Mesnil",
  parcel_cadastre_id: "93007-CD-0456",
  surface_approx: 22,
  commune_code: "93007",
  commune_name: "Le Blanc-Mesnil",
  created_at: "2026-04-20T10:00:00Z",
  updated_at: "2026-05-08T16:00:00Z",
  brief: createBrief(blancMesnilProjectId, [
    { type: "chambre", name: "Chambre Parentale", surface: 16, orientation: "SE", priority: 1 },
    { type: "salle_de_bain", name: "Salle d'Eau", surface: 6, orientation: "N", priority: 2, adjacency: ["chambre"] },
  ], "65 000€ - 85 000€", "moderne", "completed"),
  compliance_checks: [],
};

// ---------------------------------------------------------------------------
// PROJET SECONDAIRE 2 — En conformité (évalué)
// ---------------------------------------------------------------------------
export const aulnayProjectId = "proj-aulnay-001";

export const aulnayProject: Project = {
  id: aulnayProjectId,
  user_id: mockUser.id,
  name: "Véranda Bureau — Aulnay-sous-Bois",
  description: "Construction d'une véranda de 18m² en ossature aluminium transformée en bureau. Sol carrelage, chauffage au sol électrique, store banne.",
  project_type: "extension_under_40",
  status: "compliance",
  parcel_address: "5 Rue des Mésanges, 93600 Aulnay-sous-Bois",
  parcel_cadastre_id: "93005-EF-0789",
  surface_approx: 18,
  commune_code: "93005",
  commune_name: "Aulnay-sous-Bois",
  created_at: "2026-02-05T14:00:00Z",
  updated_at: "2026-04-28T11:00:00Z",
  brief: createBrief(aulnayProjectId, [
    { type: "bureau", name: "Bureau Véranda", surface: 18, orientation: "SO", priority: 1 },
  ], "42 000€ - 58 000€", "contemporain", "validated"),
  compliance_checks: [
    { id: `cc-${aulnayProjectId}-1`, project_id: aulnayProjectId, rule_code: "URB-COS-001", rule_name: "COS", category: "urbanisme", status: "pass", message: "COS respecté — emprise 18m² / 450m² max", evaluated_at: "2026-04-25T09:00:00Z" },
    { id: `cc-${aulnayProjectId}-2`, project_id: aulnayProjectId, rule_code: "RE2-CEP-001", rule_name: "CEP RE2020", category: "re2020", status: "pass", message: "CEP (95 kWh/m².an) < limite (130 kWh/m².an)", evaluated_at: "2026-04-25T09:00:00Z" },
    { id: `cc-${aulnayProjectId}-3`, project_id: aulnayProjectId, rule_code: "PMR-SEUIL-001", rule_name: "Seuil PMR", category: "pmr", status: "warning", message: "Seuil (2.1cm) légèrement supérieur à 2.0cm — à vérifier", evaluated_at: "2026-04-25T09:00:00Z" },
  ],
};

// ---------------------------------------------------------------------------
// PROJET SECONDAIRE 3 — Livré (tous les documents)
// ---------------------------------------------------------------------------
export const villepinteProjectId = "proj-villepinte-001";

export const villepinteProject: Project = {
  id: villepinteProjectId,
  user_id: mockUser.id,
  name: "Extension Cuisine — Villepinte",
  description: "Extension de 12m² pour agrandissement d'une cuisine existante. Création d'une cuisine ouverte avec îlot central. Baie vitrée coulissante, carrelage grand format.",
  project_type: "extension_under_40",
  status: "submitted",
  parcel_address: "8 Allée des Rosiers, 93420 Villepinte",
  parcel_cadastre_id: "93078-GH-0321",
  surface_approx: 12,
  commune_code: "93078",
  commune_name: "Villepinte",
  created_at: "2026-01-08T11:00:00Z",
  updated_at: "2026-05-01T10:00:00Z",
  brief: createBrief(villepinteProjectId, [
    { type: "cuisine", name: "Cuisine Agrandie", surface: 12, orientation: "S", priority: 1, adjacency: ["séjour"] },
  ], "38 000€ - 52 000€", "moderne", "validated"),
  compliance_checks: [
    { id: `cc-${villepinteProjectId}-1`, project_id: villepinteProjectId, rule_code: "URB-COS-001", rule_name: "COS", category: "urbanisme", status: "pass", message: "COS respecté", evaluated_at: "2026-04-15T10:00:00Z" },
    { id: `cc-${villepinteProjectId}-2`, project_id: villepinteProjectId, rule_code: "URB-EMP-001", rule_name: "Emprise", category: "urbanisme", status: "pass", message: "Emprise 12m² < 300m² max", evaluated_at: "2026-04-15T10:00:00Z" },
    { id: `cc-${villepinteProjectId}-3`, project_id: villepinteProjectId, rule_code: "RE2-CEP-001", rule_name: "CEP", category: "re2020", status: "pass", message: "CEP conforme", evaluated_at: "2026-04-15T10:00:00Z" },
    { id: `cc-${villepinteProjectId}-4`, project_id: villepinteProjectId, rule_code: "DTU-ISO-001", rule_name: "Isolation", category: "dtu", status: "pass", message: "Isolation conforme R=4.5", evaluated_at: "2026-04-15T10:00:00Z" },
    { id: `cc-${villepinteProjectId}-5`, project_id: villepinteProjectId, rule_code: "INC-SOR-001", rule_name: "Issue secours", category: "incendie", status: "pass", message: "Issue conforme 1.00m > 0.90m min", evaluated_at: "2026-04-15T10:00:00Z" },
    { id: `cc-${villepinteProjectId}-6`, project_id: villepinteProjectId, rule_code: "PMR-SEUIL-001", rule_name: "Seuil PMR", category: "pmr", status: "pass", message: "Seuil 1.5cm < 2.0cm max", evaluated_at: "2026-04-15T10:00:00Z" },
  ],
};

// ---------------------------------------------------------------------------
// Liste complète des projets
// ---------------------------------------------------------------------------
export const mockProjects: Project[] = [
  tremblayProject,
  blancMesnilProject,
  aulnayProject,
  villepinteProject,
];

// ---------------------------------------------------------------------------
// Statistiques dashboard
// ---------------------------------------------------------------------------
export const mockStats: DashboardStats = {
  total_projects: 4,
  active_projects: 3,
  submitted_projects: 1,
  avg_compliance: 76,
};

// ---------------------------------------------------------------------------
// Timeline étapes — projet principal Tremblay
// ---------------------------------------------------------------------------
export const mockTimelineSteps: TimelineStep[] = [
  { id: "1", label: "Récit projet", description: "Description et localisation", status: "done", date: "2026-03-15", icon: "ClipboardList" },
  { id: "2", label: "Analyse terrain", description: "Données foncières, PLU et risques", status: "done", date: "2026-03-22", icon: "Map" },
  { id: "3", label: "Programme", description: "Brief architectural détaillé", status: "done", date: "2026-04-05", icon: "Box" },
  { id: "4", label: "Design", description: "Esquisses et plans 2D/3D", status: "done", date: "2026-04-20", icon: "PenTool" },
  { id: "5", label: "Conformité", description: "Vérification réglementaire complète", status: "in_progress", date: "2026-05-10", icon: "ShieldCheck" },
  { id: "6", label: "Livrables", description: "Dossier PC + CERFA + notice", status: "todo", icon: "FileText" },
  { id: "7", label: "Dépôt", description: "Soumission au guichet unique", status: "todo", icon: "Send" },
];

// ---------------------------------------------------------------------------
// Données financières
// ---------------------------------------------------------------------------
export const mockBudgetDetails = {
  total_surface: 48, // 25 + 10 + 10 + 3
  prix_m2_moyen: 2200, // €/m² HT ( Extension RDC, finition moyenne+ )
  cout_travaux_ht: 105600, // 48 × 2200
  cout_travaux_ttc: 126720, // × 1.20
  honoraires_architecte: 8448, // 8% HT des travaux
  divers_frais: 5000, // DPE, géomètre, assurances
  total_estime_min: 99000,
  total_estime_max: 135000,
  notes: "Prix indicatifs pour extension en rez-de-chaussée avec toiture terrasse et menuiseries aluminium. Hors aménagements extérieurs.",
};

// ---------------------------------------------------------------------------
// Données CERFA pré-remplies
// ---------------------------------------------------------------------------
export const mockCerfaData = {
  cerfa_13406: {
    // Demande de permis de construire / extension
    commune: "Tremblay-en-France",
    code_insee: "93073",
    adresse_chantier: "12 Rue de la Paix, 93290 Tremblay-en-France",
    ref_cadastre: "93073-AB-0123",
    nature_travaux: "Extension d'une maison individuelle existante",
    surface_terrain: 750,
    surface_existante: 85,
    surface_creation: 45,
    shon_totale: 130, // 85 + 45
    hauteur: 3.2,
    nb_niveaux: 1,
    architecte: "Jean Dupont — Architecte DPLG",
    maitre_oeuvre: "Jean Dupont",
    date_depot: null,
    pieces_jointes: [
      "Plan de situation",
      "Plan de masse",
      "Coupe",
      "Façades",
      "Plan de niveau",
      "Notice descriptive",
      "Attestation RE2020",
      "Assurance DOMMAGE-OUVRAGE",
    ],
  },
};
