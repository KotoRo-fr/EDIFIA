export type UserRole = 'owner' | 'admin' | 'compliance_officer';
export type ProjectType = 'extension_under_40' | 'mob_under_150' | 'other';
export type ProjectStatus = 'draft' | 'site_intel' | 'programming' | 'design' | 'compliance' | 'deliverables' | 'submitted';
export type ComplianceStatus = 'pass' | 'fail' | 'warning' | 'not_applicable';

export interface User {
  id: string; email: string; first_name: string; last_name: string;
  role: UserRole; is_verified: boolean; created_at: string;
}
export interface Profile {
  id: string; user_id: string; first_name: string; last_name: string; phone: string;
  address_line: string; postal_code: string; city: string; country: string;
}
export interface Room {
  id: string; type: string; surface: number; orientation?: string; priority: number;
}
export interface Brief {
  id: string; project_id: string; rooms: Room[]; constraints: Record<string, unknown>;
  preferences: Record<string, unknown>; budget_range?: string; style_preference?: string;
  status: 'draft' | 'completed' | 'validated';
}
export interface Project {
  id: string; user_id: string; name: string; description?: string;
  project_type: ProjectType; status: ProjectStatus; parcel_address: string;
  parcel_cadastre_id?: string; surface_approx: number; commune_code: string;
  commune_name: string; created_at: string; updated_at: string;
  brief?: Brief; compliance_checks?: ComplianceCheck[];
}
export interface ComplianceCheck {
  id: string; project_id: string; rule_code: string; rule_name: string;
  category: string; status: ComplianceStatus; message: string; evaluated_at: string;
}
export interface TimelineStep {
  id: string; label: string; description: string; status: 'todo' | 'in_progress' | 'done' | 'blocked';
  date?: string; icon: string;
}
export interface DashboardStats {
  total_projects: number; active_projects: number; submitted_projects: number;
  avg_compliance: number;
}
