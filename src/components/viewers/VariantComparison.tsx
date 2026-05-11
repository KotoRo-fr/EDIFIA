import { CheckCircle, XCircle, AlertTriangle, Sun, Maximize, Palette, Wallet, BarChart3 } from 'lucide-react';
import type { Variant } from '@/types/solver';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface VariantComparisonProps {
  variants: Variant[];
  selectedId?: string | null;
  onSelect?: (variantId: string) => void;
}

export default function VariantComparison({ variants, selectedId, onSelect }: VariantComparisonProps) {
  if (!variants || variants.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        Aucune variante générée.
      </div>
    );
  }

  const bestVariant = variants.reduce((best, v) => (v.scores.total > best.scores.total ? v : best), variants[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {variants.map((variant) => {
        const isSelected = selectedId === variant.id;
        const isBest = variant.id === bestVariant.id;
        const conformiteColor = variant.conformite.score >= 80 ? 'bg-emerald-50 text-emerald-700' :
          variant.conformite.score >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';

        return (
          <div
            key={variant.id}
            className={`
              relative flex flex-col rounded-xl border p-4 transition-all cursor-pointer
              ${isSelected
                ? 'border-orange-400 ring-2 ring-orange-100 bg-orange-50/30'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }
            `}
            onClick={() => onSelect?.(variant.id)}
          >
            {/* Badge meilleure variante */}
            {isBest && !isSelected && (
              <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px]">
                Meilleur score
              </Badge>
            )}
            {isSelected && (
              <Badge className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px]">
                Sélectionnée
              </Badge>
            )}

            {/* Header */}
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-slate-800">{variant.name.split(' — ')[0]}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{variant.description}</p>
            </div>

            {/* Score total */}
            <div className="mb-3 text-center">
              <div className="text-3xl font-bold text-slate-800">{variant.scores.total}</div>
              <div className="text-xs text-slate-500">Score global</div>
            </div>

            {/* Scores détaillés */}
            <div className="space-y-2 mb-3 flex-1">
              <ScoreBar icon={<Maximize size={12} />} label="Surface" value={variant.scores.surface} color="bg-blue-500" />
              <ScoreBar icon={<Sun size={12} />} label="Ensoleil." value={variant.scores.ensoleillement} color="bg-amber-500" />
              <ScoreBar icon={<Wallet size={12} />} label="Coût" value={variant.scores.cout} color="bg-emerald-500" />
              <ScoreBar icon={<Palette size={12} />} label="Esthétique" value={variant.scores.esthetique} color="bg-violet-500" />
            </div>

            {/* Conformité */}
            <div className={`mb-3 p-2 rounded-lg ${conformiteColor}`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Conformité</span>
                <span className="font-bold">{variant.conformite.score}%</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {variant.conformite.checks.slice(0, 3).map((check, i) => (
                  <span key={i} className="inline-flex items-center gap-0.5">
                    {check.pass ? (
                      <CheckCircle size={10} className="text-emerald-600" />
                    ) : (
                      <XCircle size={10} className="text-red-500" />
                    )}
                  </span>
                ))}
                {variant.conformite.checks.length > 3 && (
                  <span className="text-[10px] text-slate-500">+{variant.conformite.checks.length - 3}</span>
                )}
              </div>
            </div>

            {/* Bouton */}
            <Button
              size="sm"
              variant={isSelected ? 'default' : 'outline'}
              className={isSelected ? 'bg-orange-600 hover:bg-orange-700' : ''}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(variant.id);
              }}
            >
              {isSelected ? 'Sélectionnée' : 'Sélectionner'}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function ScoreBar({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const colorClass = value >= 80 ? 'text-emerald-600' : value >= 60 ? 'text-amber-600' : 'text-red-500';

  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-400">{icon}</span>
      <span className="text-[10px] text-slate-500 w-14">{label}</span>
      <div className="flex-1">
        <Progress value={value} className="h-1.5" />
      </div>
      <span className={`text-[10px] font-medium w-6 text-right ${colorClass}`}>{value}</span>
    </div>
  );
}
