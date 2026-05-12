import type { Project, Brief, ComplianceCheck, DashboardStats } from '@/types';
import type { EvaluationResult, SiteIntelData } from '@/mocks/complianceData';
import type { Program } from '@/lib/solver/types';
import type { Variant } from '@/types/solver';
import { mockProjects } from '@/mocks/data';
import { mockEvaluationResult, mockSiteIntel } from '@/mocks/complianceData';
import { api } from './api-client';
import { solveRoomProgram, generateFootprint, generateVariants as solverVariants } from '@/lib/solver';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
let projects = [...mockProjects];

// Wrapper avec fallback vers les mocks
async function withFallback<T>(apiCall: () => Promise<T>, mockFallback: T): Promise<T> {
  try {
    return await apiCall();
  } catch {
    console.warn("Backend unavailable, using mock data");
    return mockFallback;
  }
}

export async function getProjects(): Promise<Project[]> { await delay(300); return projects; }

export async function getProject(id: string): Promise<Project | null> { await delay(300); return projects.find(p => p.id === id) || null; }

export async function createProject(data: Partial<Project>): Promise<Project> {
  await delay(300);
  const newProject: Project = {
    id: `proj-${Date.now()}`, user_id: "1", name: data.name || "Nouveau projet", description: data.description,
    project_type: data.project_type || "extension_under_40", status: "draft", parcel_address: data.parcel_address || "",
    surface_approx: data.surface_approx || 0, commune_code: data.commune_code || "", commune_name: data.commune_name || "",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(), brief: undefined, compliance_checks: [],
  };
  projects = [newProject, ...projects]; return newProject;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  await delay(300); const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('Project not found');
  projects[idx] = { ...projects[idx], ...data, updated_at: new Date().toISOString() }; return projects[idx];
}

export async function deleteProject(id: string): Promise<void> { await delay(300); projects = projects.filter(p => p.id !== id); }

export async function getBrief(projectId: string): Promise<Brief | null> { await delay(300); const p = projects.find(p => p.id === projectId); return p?.brief || null; }

export async function saveBrief(projectId: string, briefData: Partial<Brief>): Promise<Brief> {
  await delay(300); const idx = projects.findIndex(p => p.id === projectId);
  if (idx === -1) throw new Error('Project not found');
  const brief: Brief = { id: briefData.id || `brief-${projectId}`, project_id: projectId, rooms: briefData.rooms || [], constraints: briefData.constraints || {}, preferences: briefData.preferences || {}, budget_range: briefData.budget_range, style_preference: briefData.style_preference, status: briefData.status || 'draft' };
  projects[idx] = { ...projects[idx], brief: brief, updated_at: new Date().toISOString() };
  return brief;
}

export async function validateBrief(projectId: string): Promise<{ valid: boolean; errors: string[] }> {
  await delay(300); const p = projects.find(p => p.id === projectId);
  if (!p?.brief) return { valid: false, errors: ['Brief non trouvé'] };
  const errors: string[] = [];
  if (!p.brief.rooms.length) errors.push('Ajoutez au moins une pièce');
  if (!p.brief.budget_range) errors.push('Sélectionnez une fourchette de budget');
  return { valid: errors.length === 0, errors };
}

export async function getComplianceChecks(projectId: string): Promise<ComplianceCheck[]> { await delay(300); const p = projects.find(p => p.id === projectId); return p?.compliance_checks || []; }

export async function getStats(): Promise<DashboardStats> {
  await delay(300);
  return { total_projects: projects.length, active_projects: projects.filter(p => p.status !== 'submitted' && p.status !== 'draft').length, submitted_projects: projects.filter(p => p.status === 'submitted').length, avg_compliance: Math.round(projects.reduce((sum, p) => { const c = p.compliance_checks || []; return sum + (c.length ? (c.filter(x => x.status === 'pass').length / c.length) * 100 : 100); }, 0) / projects.length) };
}

// ─── Compliance API ──────────────────────────────────────

export async function evaluateCompliance(projectId: string): Promise<EvaluationResult> {
  return withFallback(
    () => api.evaluateCompliance(projectId),
    { ...mockEvaluationResult, project_id: projectId }
  );
}

export async function getComplianceReport(projectId: string): Promise<{ url: string; generatedAt: string }> {
  await delay(1200);
  return {
    url: `/reports/compliance-${projectId}.pdf`,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Site Intelligence API ───────────────────────────────

export async function getSiteIntel(projectId: string): Promise<SiteIntelData> {
  return withFallback(
    () => api.getSiteIntel(projectId),
    mockSiteIntel
  );
}

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; formatted: string } | null> {
  return withFallback(
    () => api.geocodeAddress(address),
    {
      lat: 48.9896,
      lng: 2.5701,
      formatted: address || "12 Rue de Paris, 93290 Tremblay-en-France",
    }
  );
}

export async function getPLU(communeCode: string): Promise<SiteIntelData['plu'] | null> {
  return withFallback(
    () => api.getPLU(communeCode),
    mockSiteIntel.plu
  );
}

// ─── Local solvers (fallback when backend is offline) ─────────────────────────

function generateLocalProgram(rooms: any[], projectType: string, style: string): Program {
  return solveRoomProgram(rooms, projectType, style);
}

function generateLocalVariants(projectId: string, strategyCount = 4): Variant[] {
  const p = projects.find(proj => proj.id === projectId);
  if (!p?.brief) return [];

  const style = (p.brief.preferences?.style as string) || 'moderne';
  const program = solveRoomProgram(p.brief.rooms, p.project_type, style);

  const parcelWidth = Math.max(15, Math.sqrt(p.surface_approx * 2));
  const parcelDepth = Math.max(15, p.surface_approx * 2 / parcelWidth);
  const footprint = generateFootprint(parcelWidth, parcelDepth, 0.5, p.project_type === 'mob_under_150' ? 8 : 12, {
    front: 3, side: 1.5, rear: 3,
  });

  const designVariants = solverVariants(program.rooms, footprint);

  // Convert solver DesignVariant[] → page Variant[] format
  return designVariants.slice(0, strategyCount).map((dv) => ({
    id: dv.id,
    name: dv.name,
    description: dv.strategy,
    rooms: dv.floorPlan.rooms.map((r, ri) => ({
      id: r.id || `room-${ri}`,
      type: r.type,
      surface: r.surface,
      x: r.x,
      y: r.y,
      width: r.width,
      depth: r.depth,
    })),
    footprint: {
      width: footprint.width,
      depth: footprint.depth,
      surface: footprint.surface ?? 0,
      cos: footprint.cos ?? 0.5,
      heightMax: footprint.maxHeight,
      reculs: footprint.reculs ?? { front: 3, side: 1.5, rear: 3 },
      buildableWidth: footprint.buildableWidth ?? footprint.width,
      buildableDepth: footprint.buildableDepth ?? footprint.depth,
    },
    scores: {
      surface: dv.scores.surface,
      ensoleillement: dv.scores.sunExposure,
      cout: dv.scores.costEfficiency,
      esthetique: dv.scores.aesthetics,
      total: dv.scores.overall,
    },
    conformite: {
      score: dv.conformityScore,
      checks: [
        { label: 'Surface constructible respectee', pass: dv.scores.surface >= 60 },
        { label: 'Hauteur maximale respectee', pass: dv.conformityScore >= 70 },
        { label: 'Reculs de voirie respectes', pass: dv.scores.sunExposure >= 50 },
        { label: 'Accessibilite PMR', pass: dv.conformityScore >= 80 },
      ],
    },
    isSelected: false,
  }));
}

// ─── Programming API ─────────────────────────────────────

export async function generateProgram(projectId: string, rooms: any[], projectType: string, style: string): Promise<Program> {
  return withFallback(
    () => api.generateProgram(projectId, rooms, projectType, style),
    generateLocalProgram(rooms, projectType, style)
  );
}

export async function getProgram(projectId: string): Promise<Program | null> {
  return withFallback(
    () => api.getProgram(projectId),
    null
  );
}

// ─── Design API ──────────────────────────────────────────

export async function generateVariants(projectId: string, strategyCount = 4): Promise<Variant[]> {
  return withFallback(
    () => api.generateVariants(projectId, strategyCount),
    generateLocalVariants(projectId, strategyCount)
  );
}

export async function listVariants(projectId: string): Promise<Variant[]> {
  return withFallback(
    () => api.listVariants(projectId),
    generateLocalVariants(projectId)
  );
}

export async function selectVariant(projectId: string, variantId: string): Promise<void> {
  return withFallback(
    () => api.selectVariant(projectId, variantId),
    undefined
  );
}

// ─── Local deliverables helpers (fallback when backend is offline) ─────────

function getLocalDeliverables(projectId: string) {
  return {
    project_id: projectId,
    status: "generated" as string,
    documents: [
      { id: "cerfa", title: "CERFA Permis de construire", icon: "FileText", status: "generated", description: "Formulaire CERFA 13406*05 rempli automatiquement" },
      { id: "notice", title: "Notice de calcul", icon: "Calculator", status: "generated", description: "Calculs structures, thermiques et reglementaires" },
      { id: "rapport", title: "Rapport de conformite", icon: "ShieldCheck", status: "generated", description: "Synthese des 70 verifications reglementaires" },
      { id: "plans", title: "Plans architecturaux", icon: "Map", status: "generated", description: "Plans de situation, masse et niveau RDC" },
      { id: "pack", title: "Pack complet de depot", icon: "Package", status: "pending", description: "Assemblage de tous les documents pour la mairie" },
    ],
  };
}

function getLocalCerfa(projectId: string) {
  const project = mockProjects.find((p) => p.id === projectId) || mockProjects[0];
  return {
    project,
    profile: { first_name: "Marie", last_name: "Dubois" },
  };
}

function getLocalNotice(projectId: string) {
  const project = mockProjects.find((p) => p.id === projectId) || mockProjects[0];
  return {
    project,
    complianceResult: { ...mockEvaluationResult, project_id: projectId },
  };
}

function getLocalRapport(projectId: string) {
  const project = mockProjects.find((p) => p.id === projectId) || mockProjects[0];
  return {
    project,
    complianceResult: { ...mockEvaluationResult, project_id: projectId },
  };
}

function getLocalPlans(projectId: string) {
  const project = mockProjects.find((p) => p.id === projectId) || mockProjects[0];
  return {
    project,
    variant: undefined as any,
  };
}

// ─── Deliverables API ────────────────────────────────────

export async function listDeliverables(projectId: string) {
  return withFallback(
    () => api.listDeliverables(projectId),
    getLocalDeliverables(projectId)
  );
}

export async function generateAllDeliverables(projectId: string) {
  return withFallback(
    () => api.generateAllDeliverables(projectId),
    { project_id: projectId, status: "generated", documents: getLocalDeliverables(projectId).documents }
  );
}

export async function getCerfaData(projectId: string) {
  return withFallback(() => api.getCerfa(projectId), getLocalCerfa(projectId));
}

export async function getNoticeData(projectId: string) {
  return withFallback(() => api.getNotice(projectId), getLocalNotice(projectId));
}

export async function getRapportData(projectId: string) {
  return withFallback(() => api.getRapport(projectId), getLocalRapport(projectId));
}

export async function getPlansData(projectId: string) {
  return withFallback(() => api.getPlans(projectId), getLocalPlans(projectId));
}
