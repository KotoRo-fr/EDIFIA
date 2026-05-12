import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';

interface BudgetData {
  min: number;
  avg: number;
  max: number;
  currency: string;
  pricePerM2: { min: number; max: number };
  breakdown: Array<{ category: string; min: number; max: number; percentage: number }>;
  totalSurface: number;
}

const defaultBudget: BudgetData = {
  min: 0,
  avg: 0,
  max: 0,
  currency: 'EUR',
  pricePerM2: { min: 1800, max: 2500 },
  breakdown: [],
  totalSurface: 0,
};

function formatCurrency(value: number, currency: string): string {
  if (currency === 'EUR') return `${value.toLocaleString('fr-FR')} €`;
  return `${value.toLocaleString('fr-FR')} ${currency}`;
}

function formatK(value: number, currency: string): string {
  const k = Math.round(value / 1000);
  if (currency === 'EUR') return `${k} k€`;
  return `${k}k ${currency}`;
}

const defaultBreakdown = [
  { category: 'Gros œuvre', min: 0, max: 0, percentage: 35 },
  { category: 'Second œuvre', min: 0, max: 0, percentage: 20 },
  { category: 'Menuiseries', min: 0, max: 0, percentage: 12 },
  { category: 'Électricité', min: 0, max: 0, percentage: 8 },
  { category: 'Plomberie', min: 0, max: 0, percentage: 8 },
  { category: 'Finitions', min: 0, max: 0, percentage: 12 },
  { category: 'Divers', min: 0, max: 0, percentage: 5 },
];

export default function ProgBudgetSection({ data }: { data: BudgetData | null | undefined }) {
  const bud = data ?? defaultBudget;
  const hasBreakdown = bud.breakdown && bud.breakdown.length > 0;
  const rows = hasBreakdown ? bud.breakdown : defaultBreakdown;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Budget estimé</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 3 budget cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-center">
            <p className="text-xs text-emerald-600 font-medium mb-1">Budget min</p>
            <p className="text-xl font-bold text-emerald-800">
              {bud.min > 0 ? formatK(bud.min, bud.currency) : '—'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-center">
            <p className="text-xs text-blue-600 font-medium mb-1">Budget moyen</p>
            <p className="text-xl font-bold text-blue-800">
              {bud.avg > 0 ? formatK(bud.avg, bud.currency) : '—'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <p className="text-xs text-slate-600 font-medium mb-1">Budget max</p>
            <p className="text-xl font-bold text-slate-800">
              {bud.max > 0 ? formatK(bud.max, bud.currency) : '—'}
            </p>
          </div>
        </div>

        {/* Price per m² */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
          <span className="text-sm text-slate-600">
            Prix au m² :{' '}
            <span className="font-bold text-slate-800">
              Entre {bud.pricePerM2.min.toLocaleString('fr-FR')} et {bud.pricePerM2.max.toLocaleString('fr-FR')} €/m²
            </span>
          </span>
          <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-xs">
            Estimation indicative
          </Badge>
        </div>

        {/* Breakdown table */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">Répartition par poste</h4>
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-xs">Poste</TableHead>
                  <TableHead className="text-xs text-right">Min</TableHead>
                  <TableHead className="text-xs text-right">Max</TableHead>
                  <TableHead className="text-xs text-right">% du total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={`${row.category}-${i}`}>
                    <TableCell className="text-sm font-medium">{row.category}</TableCell>
                    <TableCell className="text-sm text-right text-slate-600">
                      {hasBreakdown && row.min > 0
                        ? formatCurrency(row.min, bud.currency)
                        : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-right text-slate-600">
                      {hasBreakdown && row.max > 0
                        ? formatCurrency(row.max, bud.currency)
                        : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-right">
                      <Badge variant="secondary" className="text-xs font-mono">
                        {row.percentage}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
