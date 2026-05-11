import { useEffect, useState, useRef } from 'react';
import { FolderOpen, FileCheck, TrendingUp, Plus } from 'lucide-react';
import { getProjects, getStats } from '@/lib/api';
import type { Project, DashboardStats } from '@/types';
import ProjectCard from '@/components/ProjectCard';
import OnboardingWizard from '@/components/OnboardingWizard';
import { Button } from '@/components/ui/button';
import { CardHover } from '@/components/animations';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total_projects: 0, active_projects: 0, submitted_projects: 0, avg_compliance: 0 });
  const [showWizard, setShowWizard] = useState(false);
  const previousProjectCount = useRef<number>(0);

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      if (previousProjectCount.current > 0 && data.length > previousProjectCount.current) {
        toast.success('Projet créé avec succès', {
          description: 'Votre nouveau projet est prêt à être configuré.',
        });
      }
      previousProjectCount.current = data.length;
    });
    getStats().then(setStats);
  }, [showWizard]);

  const statCards = [
    { label: 'Projets total', value: stats.total_projects, icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'En cours', value: stats.active_projects, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Déposés', value: stats.submitted_projects, icon: FileCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Conformité moyenne', value: `${stats.avg_compliance}%`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8"><h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1><Button onClick={() => setShowWizard(true)} className="bg-orange-600 hover:bg-orange-700 text-white"><Plus size={18} className="mr-1" /> Nouveau projet</Button></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <CardHover key={s.label}>
            <div className={`${s.bg} rounded-xl p-4 border border-slate-100`}>
              <div className="flex items-center justify-between">
                <s.icon size={20} className={s.color} />
                <span className="text-2xl font-bold text-slate-800">{s.value}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">{s.label}</p>
            </div>
          </CardHover>
        ))}
      </div>
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Mes projets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{projects.map(p => <ProjectCard key={p.id} project={p} />)}</div>
      {showWizard && <OnboardingWizard onClose={() => setShowWizard(false)} />}
    </div>
  );
}
