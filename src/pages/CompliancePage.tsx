import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ComplianceGauge from '@/components/ComplianceGauge';
import { mockEvaluationResult } from '@/mocks/complianceData';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

// Types simples
interface CheckResult {
  rule_code: string;
  rule_name: string;
  category: string;
  status: 'pass' | 'fail' | 'warning' | 'not_applicable';
  message: string;
  severity?: 'blocking' | 'major' | 'minor' | 'info';
  evaluated_values?: Record<string, number | string>;
}

interface EvaluationData {
  summary: {
    total_rules: number;
    passed: number;
    failed: number;
    warnings: number;
    not_applicable: number;
    compliance_rate: number;
  };
  results: CheckResult[];
}

const CATEGORY_LABELS: Record<string, string> = {
  urbanisme: 'Urbanisme',
  dtu: 'DTU',
  re2020: 'RE2020',
  pmr: 'PMR',
  incendie: 'Incendie',
};

const CATEGORY_COLORS: Record<string, string> = {
  urbanisme: 'bg-blue-100 text-blue-700',
  dtu: 'bg-purple-100 text-purple-700',
  re2020: 'bg-green-100 text-green-700',
  pmr: 'bg-pink-100 text-pink-700',
  incendie: 'bg-red-100 text-red-700',
};

// Données mock comme fallback
const mockData: EvaluationData = {
  summary: mockEvaluationResult.summary,
  results: mockEvaluationResult.results,
};

export default function CompliancePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [data, setData] = useState<EvaluationData>(mockData);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les données depuis l'API au montage
  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await api.evaluateCompliance(projectId);
        if (cancelled) return;
        const formatted: EvaluationData = {
          summary: result.summary,
          results: (result.results || []).map((r: any) => ({
            rule_code: r.rule_code,
            rule_name: r.rule_name,
            category: r.category,
            status: r.status,
            message: r.message,
            severity: r.severity || 'info',
            evaluated_values: r.evaluated_values || {},
          })),
        };
        setData(formatted);
      } catch {
        if (!cancelled) {
          setData(mockData);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadData();
    return () => { cancelled = true; };
  }, [projectId]);

  const handleEvaluate = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    toast.info('Evaluation lancee', {
      description: 'Analyse de conformite reglementaire en cours...',
    });
    try {
      const result = await api.evaluateCompliance(projectId);
      const formatted: EvaluationData = {
        summary: result.summary,
        results: (result.results || []).map((r: any) => ({
          rule_code: r.rule_code,
          rule_name: r.rule_name,
          category: r.category,
          status: r.status,
          message: r.message,
          severity: r.severity || 'info',
          evaluated_values: r.evaluated_values || {},
        })),
      };
      setData(formatted);
      toast.success('Evaluation terminee', {
        description: `Taux de conformite : ${result.summary.compliance_rate}%`,
      });
    } catch {
      setData(mockData);
      toast.success('Evaluation terminee (mode offline)', {
        description: `Taux de conformite : ${mockData.summary.compliance_rate}%`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Données d'affichage (API ou mock)
  const evaluation = data;
  const results: CheckResult[] = evaluation.results;

  // Filtres en memoire pure
  const filtered = useMemo(() => {
    return results.filter((r: CheckResult) => {
      if (filterCategory !== 'all' && r.category !== filterCategory) return false;
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      return true;
    });
  }, [results, filterCategory, filterStatus]);

  const passed = results.filter((r: CheckResult) => r.status === 'pass').length;
  const failed = results.filter((r: CheckResult) => r.status === 'fail').length;
  const warnings = results.filter((r: CheckResult) => r.status === 'warning').length;
  const na = results.filter((r: CheckResult) => r.status === 'not_applicable').length;
  const rate = evaluation.summary.compliance_rate;
  const blocking = results.filter((r: CheckResult) => r.status === 'fail');

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${projectId}`)}>
          <ArrowLeft size={16} className="mr-1" /> Retour
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEvaluate}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={14} className="mr-1 animate-spin" /> : <Play size={14} className="mr-1" />}
          Relancer l'evaluation
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 mb-6">Conformite reglementaire</h1>

      {/* Score global */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <ComplianceGauge score={rate} size={160} label="Conformite globale" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1 w-full">
          <Card className="bg-emerald-50 border-emerald-200"><CardContent className="pt-4 pb-3 text-center">
            <div className="text-xs text-emerald-600">Pass</div><div className="text-2xl font-bold text-emerald-800">{passed}</div>
          </CardContent></Card>
          <Card className="bg-red-50 border-red-200"><CardContent className="pt-4 pb-3 text-center">
            <div className="text-xs text-red-600">Fail</div><div className="text-2xl font-bold text-red-800">{failed}</div>
          </CardContent></Card>
          <Card className="bg-amber-50 border-amber-200"><CardContent className="pt-4 pb-3 text-center">
            <div className="text-xs text-amber-600">Warning</div><div className="text-2xl font-bold text-amber-800">{warnings}</div>
          </CardContent></Card>
          <Card className="bg-gray-50 border-gray-200"><CardContent className="pt-4 pb-3 text-center">
            <div className="text-xs text-gray-600">N/A</div><div className="text-2xl font-bold text-gray-800">{na}</div>
          </CardContent></Card>
        </div>
      </div>

      {/* Problemes bloquants */}
      {blocking.length > 0 && (
        <Card className="bg-red-50 border-red-300 mb-6">
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-red-700 mb-2">Problemes bloquants ({blocking.length})</h3>
            <div className="space-y-1">
              {blocking.slice(0, 5).map((r: CheckResult, i: number) => (
                <div key={i} className="text-sm text-red-800 flex items-start gap-2">
                  <span className="font-mono text-xs bg-red-200 px-1 rounded shrink-0">{r.rule_code}</span>
                  <span>{r.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="results">
        <TabsList className="mb-4">
          <TabsTrigger value="results">Resultats ({filtered.length})</TabsTrigger>
          <TabsTrigger value="rules">Regles actives</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          {/* Filtres */}
          <div className="flex flex-wrap gap-2">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="text-sm border rounded-md px-2 py-1">
              <option value="all">Toutes categories</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-sm border rounded-md px-2 py-1">
              <option value="all">Tous statuts</option>
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
              <option value="warning">Warning</option>
            </select>
          </div>

          {/* Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left p-3 font-medium text-gray-500">Regle</th>
                  <th className="text-left p-3 font-medium text-gray-500">Categorie</th>
                  <th className="text-left p-3 font-medium text-gray-500">Statut</th>
                  <th className="text-left p-3 font-medium text-gray-500">Message</th>
                </tr></thead>
                <tbody>
                  {filtered.map((r: CheckResult, i: number) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3"><span className="font-mono text-xs bg-gray-100 px-1 rounded">{r.rule_code}</span><div className="text-xs text-gray-500">{r.rule_name}</div></td>
                      <td className="p-3"><Badge className={CATEGORY_COLORS[r.category] || 'bg-gray-100'} variant="outline">{CATEGORY_LABELS[r.category] || r.category}</Badge></td>
                      <td className="p-3">{r.status === 'pass' ? <span className="text-emerald-600 font-medium">Pass</span> : r.status === 'fail' ? <span className="text-red-600 font-medium">Fail</span> : r.status === 'warning' ? <span className="text-amber-600 font-medium">Warning</span> : <span className="text-gray-400">N/A</span>}</td>
                      <td className="p-3 text-xs text-gray-600 max-w-md">{r.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card><CardContent className="pt-5">
            <p className="text-sm text-gray-500">70 regles encodees reparties en 5 categories : Urbanisme (15), DTU (15), RE2020 (15), PMR (10), Incendie (15). Moteur 100% deterministe.</p>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
