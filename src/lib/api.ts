import type { Project, Brief, ComplianceCheck, DashboardStats } from '@/types';
import type { EvaluationResult, SiteIntelData } from '@/mocks/complianceData';
import { mockProjects } from '@/mocks/data';
import { mockEvaluationResult, mockSiteIntel } from '@/mocks/complianceData';
import { api } from './api-client';

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
