import type { Project, Brief, ComplianceCheck, DashboardStats, User } from '@/types';

export const mockUser: User = {
  id: "1", email: "demo@edifia.fr", first_name: "Marie", last_name: "Dubois",
  role: "owner", is_verified: true, created_at: "2026-01-15T10:00:00Z",
};

const createBrief = (projectId: string, rooms: { type: string; surface: number; orientation?: string }[], budget?: string, style?: string): Brief => ({
  id: `brief-${projectId}`, project_id: projectId,
  rooms: rooms.map((r, i) => ({ id: `room-${projectId}-${i}`, type: r.type, surface: r.surface, orientation: r.orientation, priority: i + 1 })),
  constraints: { budget_range: budget || "50-100k", etage: "RDC" },
  preferences: { style: style || "moderne", exigences: "" },
  budget_range: budget || "50-100k", style_preference: style || "moderne",
  status: Math.random() > 0.5 ? 'completed' : 'draft',
});

const cChecks = (pid: string): ComplianceCheck[] => [
  { id: `cc-${pid}-1`, project_id: pid, rule_code: "URB-COS-001", rule_name: "COS", category: "urbanisme", status: Math.random() > 0.3 ? 'pass' : 'fail', message: "COS respecté", evaluated_at: "2026-05-01T10:00:00Z" },
  { id: `cc-${pid}-2`, project_id: pid, rule_code: "URB-HAU-001", rule_name: "Hauteur max", category: "urbanisme", status: Math.random() > 0.4 ? 'pass' : 'warning', message: "Hauteur conforme", evaluated_at: "2026-05-01T10:00:00Z" },
  { id: `cc-${pid}-3`, project_id: pid, rule_code: "DTU-ISO-001", rule_name: "Isolation", category: "dtu", status: 'pass', message: "Isolation conforme", evaluated_at: "2026-05-01T10:00:00Z" },
  { id: `cc-${pid}-4`, project_id: pid, rule_code: "RE2020-BIO-001", rule_name: "Bbio max", category: "re2020", status: Math.random() > 0.5 ? 'pass' : 'warning', message: "Bbio OK", evaluated_at: "2026-05-01T10:00:00Z" },
];

export const mockProjects: Project[] = [
  { id: "proj-1", user_id: "1", name: "Extension cuisine", description: "Extension cuisine avec verrière", project_type: "extension_under_40", status: "submitted", parcel_address: "12 Rue de Paris, Tremblay-en-France", parcel_cadastre_id: "93073-AB-1234", surface_approx: 25, commune_code: "93073", commune_name: "Tremblay-en-France", created_at: "2026-02-10T08:30:00Z", updated_at: "2026-04-20T14:00:00Z", brief: createBrief("proj-1", [{type:"Cuisine",surface:15,orientation:"Sud"},{type:"Salle à manger",surface:10,orientation:"Sud"}], "50-100k", "contemporain"), compliance_checks: cChecks("proj-1") },
  { id: "proj-2", user_id: "1", name: "Chambre parentale", description: "Suite parentale avec dressing", project_type: "extension_under_40", status: "compliance", parcel_address: "8 Avenue des Champs, Montreuil", parcel_cadastre_id: "93048-CD-5678", surface_approx: 18, commune_code: "93048", commune_name: "Montreuil", created_at: "2026-02-15T10:00:00Z", updated_at: "2026-04-18T16:30:00Z", brief: createBrief("proj-2", [{type:"Chambre",surface:12,orientation:"Est"},{type:"Dressing",surface:6,orientation:"Nord"}], "50-100k", "moderne"), compliance_checks: cChecks("proj-2") },
  { id: "proj-3", user_id: "1", name: "Maison ossature bois", description: "Construction MOB 120m²", project_type: "mob_under_150", status: "design", parcel_address: "3 Rue des Lilas, Fontainebleau", parcel_cadastre_id: "77186-EF-9012", surface_approx: 120, commune_code: "77186", commune_name: "Fontainebleau", created_at: "2026-01-20T09:00:00Z", updated_at: "2026-04-15T11:00:00Z", brief: createBrief("proj-3", [{type:"Séjour",surface:40,orientation:"Sud"},{type:"Cuisine",surface:15,orientation:"Ouest"},{type:"Chambre 1",surface:20,orientation:"Est"},{type:"Chambre 2",surface:18,orientation:"Nord"},{type:"Salle de bain",surface:12,orientation:"Nord"}], "100-200k", "contemporain"), compliance_checks: cChecks("proj-3") },
  { id: "proj-4", user_id: "1", name: "Bureau jardin", description: "Bureau de jardin indépendant", project_type: "extension_under_40", status: "site_intel", parcel_address: "25 Rue du Commerce, Neuilly-sur-Seine", parcel_cadastre_id: "92051-GH-3456", surface_approx: 15, commune_code: "92051", commune_name: "Neuilly-sur-Seine", created_at: "2026-03-01T14:00:00Z", updated_at: "2026-04-10T09:00:00Z", brief: createBrief("proj-4", [{type:"Bureau",surface:10,orientation:"Ouest"},{type:"Rangement",surface:5,orientation:"Nord"}], "<50k", "moderne"), compliance_checks: cChecks("proj-4") },
  { id: "proj-5", user_id: "1", name: "Extension salon", description: "Agrandissement salon traversant", project_type: "extension_under_40", status: "draft", parcel_address: "7 Boulevard Haussmann, Paris 8e", parcel_cadastre_id: "75108-IJ-7890", surface_approx: 35, commune_code: "75108", commune_name: "Paris 8e", created_at: "2026-04-01T11:00:00Z", updated_at: "2026-04-05T15:00:00Z", brief: createBrief("proj-5", [{type:"Salon",surface:25,orientation:"Sud"},{type:"Véranda",surface:10,orientation:"Est"}], "50-100k", "traditionnel"), compliance_checks: cChecks("proj-5") },
  { id: "proj-6", user_id: "1", name: "Chalet habitable", description: "Chalet en bois 80m²", project_type: "mob_under_150", status: "programming", parcel_address: "42 Route des Montagnes, Chamonix", parcel_cadastre_id: "74056-KL-2345", surface_approx: 80, commune_code: "74056", commune_name: "Chamonix-Mont-Blanc", created_at: "2026-01-10T07:00:00Z", updated_at: "2026-03-28T12:00:00Z", brief: createBrief("proj-6", [{type:"Séjour",surface:30,orientation:"Sud"},{type:"Chambre 1",surface:16,orientation:"Ouest"},{type:"Chambre 2",surface:14,orientation:"Nord"},{type:"Cuisine",surface:12,orientation:"Est"}], "100-200k", "traditionnel"), compliance_checks: cChecks("proj-6") },
  { id: "proj-7", user_id: "1", name: "Garage aménagé", description: "Transformation garage en habitation", project_type: "extension_under_40", status: "deliverables", parcel_address: "18 Rue des Jardins, Lyon 3e", parcel_cadastre_id: "69383-MN-6789", surface_approx: 30, commune_code: "69383", commune_name: "Lyon 3e", created_at: "2026-02-01T13:00:00Z", updated_at: "2026-04-22T10:00:00Z", brief: createBrief("proj-7", [{type:"Studio",surface:25,orientation:"Sud"},{type:"Salle d'eau",surface:5,orientation:"Nord"}], "50-100k", "moderne"), compliance_checks: cChecks("proj-7") },
  { id: "proj-8", user_id: "1", name: "Surélévation", description: "Surélévation d'un étage", project_type: "other", status: "draft", parcel_address: "5 Rue de la Gare, Bordeaux", parcel_cadastre_id: "33063-OP-0123", surface_approx: 45, commune_code: "33063", commune_name: "Bordeaux", created_at: "2026-03-15T09:30:00Z", updated_at: "2026-03-20T14:00:00Z", brief: createBrief("proj-8", [{type:"Chambre 1",surface:18,orientation:"Est"},{type:"Chambre 2",surface:15,orientation:"Ouest"},{type:"Salle de bain",surface:12,orientation:"Nord"}], "100-200k", "contemporain"), compliance_checks: cChecks("proj-8") },
  { id: "proj-9", user_id: "1", name: "Maison passive", description: "Construction maison passive 95m²", project_type: "mob_under_150", status: "compliance", parcel_address: "22 Chemin Vert, Strasbourg", parcel_cadastre_id: "67482-QR-4567", surface_approx: 95, commune_code: "67482", commune_name: "Strasbourg", created_at: "2026-01-25T08:00:00Z", updated_at: "2026-04-12T16:00:00Z", brief: createBrief("proj-9", [{type:"Séjour",surface:35,orientation:"Sud"},{type:"Cuisine",surface:15,orientation:"Ouest"},{type:"Chambre 1",surface:18,orientation:"Est"},{type:"Chambre 2",surface:15,orientation:"Nord"},{type:"Bureau",surface:12,orientation:"Nord"}], "100-200k", "moderne"), compliance_checks: cChecks("proj-9") },
  { id: "proj-10", user_id: "1", name: "Véranda", description: "Construction véranda 20m²", project_type: "extension_under_40", status: "site_intel", parcel_address: "14 Allée des Acacias, Nantes", parcel_cadastre_id: "44109-ST-8901", surface_approx: 20, commune_code: "44109", commune_name: "Nantes", created_at: "2026-03-10T10:00:00Z", updated_at: "2026-04-08T11:30:00Z", brief: createBrief("proj-10", [{type:"Véranda",surface:20,orientation:"Sud"}], "50-100k", "indifférent"), compliance_checks: cChecks("proj-10") },
];

export const mockStats: DashboardStats = { total_projects: 10, active_projects: 7, submitted_projects: 1, avg_compliance: 78 };

export const mockTimelineSteps = [
  { id: "1", label: "Récit projet", description: "Décrivez votre projet", status: "done" as const, date: "2026-02-10", icon: "ClipboardList" },
  { id: "2", label: "Analyse terrain", description: "Données foncières et PLU", status: "done" as const, date: "2026-02-15", icon: "Map" },
  { id: "3", label: "Programme", description: "Brief architectural", status: "in_progress" as const, date: "2026-03-01", icon: "Box" },
  { id: "4", label: "Design", description: "Esquisses et plans", status: "todo" as const, icon: "PenTool" },
  { id: "5", label: "Conformité", description: "Vérification réglementaire", status: "todo" as const, icon: "ShieldCheck" },
  { id: "6", label: "Livrables", description: "Dossier complet", status: "todo" as const, icon: "FileText" },
  { id: "7", label: "Dépôt", description: "Soumission au guichet", status: "todo" as const, icon: "Send" },
];
