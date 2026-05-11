import { useNavigate } from 'react-router';
import { MapPin, Ruler, Calendar } from 'lucide-react';
import type { Project } from '@/types';
import { Card } from '@/components/ui/card';

const typeLabels: Record<string, string> = { extension_under_40: 'Extension <40m²', mob_under_150: 'MOB <150m²', other: 'Autre' };
const typeColors: Record<string, string> = { extension_under_40: 'bg-blue-50 text-blue-700', mob_under_150: 'bg-emerald-50 text-emerald-700', other: 'bg-slate-100 text-slate-700' };
const statusLabels: Record<string, string> = { draft: 'Brouillon', site_intel: 'Analyse terrain', programming: 'Programme', design: 'Design', compliance: 'Conformité', deliverables: 'Livrables', submitted: 'Déposé' };
const statusColors: Record<string, string> = { draft: 'bg-slate-100 text-slate-600', site_intel: 'bg-blue-50 text-blue-600', programming: 'bg-indigo-50 text-indigo-600', design: 'bg-violet-50 text-violet-600', compliance: 'bg-amber-50 text-amber-700', deliverables: 'bg-emerald-50 text-emerald-700', submitted: 'bg-green-50 text-green-700' };

interface Props { project: Project; }

export default function ProjectCard({ project }: Props) {
  const navigate = useNavigate();
  const date = new Date(project.created_at).toLocaleDateString('fr-FR');
  return (
    <Card onClick={() => navigate(`/projects/${project.id}`)} className="p-5 cursor-pointer hover:shadow-lg transition-all duration-200 border border-slate-200 hover:border-orange-200 group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-slate-800 group-hover:text-orange-700 transition-colors truncate pr-2">{project.name}</h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${typeColors[project.project_type]}`}>{typeLabels[project.project_type]}</span>
      </div>
      <p className="text-sm text-slate-500 mb-3 flex items-center gap-1.5"><MapPin size={13} className="text-slate-400" /><span className="truncate">{project.parcel_address}</span></p>
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
        <span className="flex items-center gap-1"><Ruler size={12} /> {project.surface_approx}m²</span>
        <span className="flex items-center gap-1"><Calendar size={12} /> {date}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[project.status]}`}>{statusLabels[project.status]}</span>
        {project.compliance_checks && project.compliance_checks.length > 0 && (
          <span className="text-xs text-slate-400">{project.compliance_checks.filter(c => c.status === 'pass').length}/{project.compliance_checks.length} conforme</span>
        )}
      </div>
    </Card>
  );
}
