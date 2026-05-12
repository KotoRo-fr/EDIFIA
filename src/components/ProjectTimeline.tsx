import { ClipboardList, Map, Box, PenTool, ShieldCheck, FileText, Send } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { TimelineStep } from '@/types';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ClipboardList, Map, Box, PenTool, ShieldCheck, FileText, Send,
};

const statusColors: Record<string, { bg: string; border: string; icon: string }> = {
  done: { bg: 'bg-emerald-50', border: 'border-emerald-500', icon: 'text-emerald-600' },
  in_progress: { bg: 'bg-blue-50', border: 'border-blue-500', icon: 'text-blue-600' },
  todo: { bg: 'bg-slate-50', border: 'border-slate-300', icon: 'text-slate-400' },
  blocked: { bg: 'bg-red-50', border: 'border-red-500', icon: 'text-red-600' },
};

// Mapping timeline step → route
const stepRoutes: Record<string, string> = {
  brief: 'projects',
  terrain: 'site-intel',
  programme: 'programming',
  conception: 'design',
  conformite: 'compliance',
  livrables: 'deliverables',
  depot: '',
  submitted: '',
};

interface Props { steps: TimelineStep[]; currentStatus?: string; projectId?: string; }

export default function ProjectTimeline({ steps, projectId }: Props) {
  const navigate = useNavigate();

  const handleStepClick = (step: TimelineStep) => {
    if (!projectId) return;
    const route = stepRoutes[step.id];
    if (route) {
      navigate(`/${route}/${projectId}`);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-start justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200" />
        {steps.map(step => {
          const colors = statusColors[step.status] || statusColors.todo;
          const Icon = iconMap[step.icon] || ClipboardList;
          const clickable = !!projectId && !!stepRoutes[step.id];
          return (
            <div
              key={step.id}
              className={`relative flex flex-col items-center z-10 ${clickable ? 'cursor-pointer group' : ''}`}
              style={{ width: `${100 / steps.length}%` }}
              onClick={() => handleStepClick(step)}
            >
              <div className={`w-10 h-10 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center transition-all ${clickable ? 'group-hover:scale-110 group-hover:shadow-md' : ''}`}>
                <Icon size={18} className={colors.icon} />
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-semibold leading-tight ${clickable ? 'group-hover:text-orange-600' : 'text-slate-800'}`}>{step.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">{step.description}</p>
                {step.date && <p className="text-[10px] text-slate-400 mt-0.5">{step.date}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
