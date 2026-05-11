import { CheckCircle, XCircle, AlertTriangle, MinusCircle } from 'lucide-react';
import type { ComplianceStatus } from '@/types';

const config: Record<ComplianceStatus, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
  pass: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Conforme' },
  fail: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Non conforme' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Attention' },
  not_applicable: { icon: MinusCircle, color: 'text-slate-400', bg: 'bg-slate-50', label: 'N/A' },
};

interface Props { status: ComplianceStatus; message?: string; ruleName?: string; }

export default function ComplianceBadge({ status, message, ruleName }: Props) {
  const c = config[status]; const Icon = c.icon;
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${c.bg} ${c.color}`}>
      <Icon size={16} />
      <div className="flex-1 min-w-0">{ruleName && <p className="text-xs font-medium">{ruleName}</p>}<p className="text-xs">{message || c.label}</p></div>
      <span className="text-xs font-semibold uppercase">{c.label}</span>
    </div>
  );
}
