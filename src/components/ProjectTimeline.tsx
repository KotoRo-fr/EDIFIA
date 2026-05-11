import { ClipboardList, Map, Box, PenTool, ShieldCheck, FileText, Send } from 'lucide-react';
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

interface Props { steps: TimelineStep[]; currentStatus?: string; }

export default function ProjectTimeline({ steps }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200" />
        {steps.map(step => {
          const colors = statusColors[step.status] || statusColors.todo;
          const Icon = iconMap[step.icon] || ClipboardList;
          return (
            <div key={step.id} className="relative flex flex-col items-center z-10" style={{ width: `${100 / steps.length}%` }}>
              <div className={`w-10 h-10 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center transition-all`}>
                <Icon size={18} className={colors.icon} />
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{step.label}</p>
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
