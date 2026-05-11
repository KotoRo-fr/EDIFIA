import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin, Ruler, Calendar, Box, Layers, ShieldCheck, FileText, CheckCircle } from 'lucide-react';
import ProjectTimeline from '@/components/ProjectTimeline';
import BriefBuilder from '@/components/BriefBuilder';
import ComplianceBadge from '@/components/ComplianceBadge';
import ComplianceGauge from '@/components/ComplianceGauge';
import { mockProjects } from '@/mocks/data';
import { useAuth } from '@/lib/auth';
import { mockEvaluationResult } from '@/mocks/complianceData';
import type { EvaluationResult, ComplianceCheckResult } from '@/mocks/complianceData';
import type { Project, Room, ComplianceCheck } from '@/types';
import { toast } from 'sonner';

// ─── Helpers ─────────────────────────────────────────────
function getProjectById(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id);
}

// ─── Labels & colors ─────────────────────────────────────
const statusLabels: Record<string, string> = {
  draft: 'Brouillon',
  site_intel: 'Analyse terrain',
  programming: 'Programmation',
  design: 'Conception',
  compliance: 'Conformité',
  deliverables: 'Livrables',
  submitted: 'Déposé',
};

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  site_intel: 'bg-blue-100 text-blue-700',
  programming: 'bg-indigo-100 text-indigo-700',
  design: 'bg-violet-100 text-violet-700',
  compliance: 'bg-amber-100 text-amber-700',
  deliverables: 'bg-emerald-100 text-emerald-700',
  submitted: 'bg-green-100 text-green-700',
};

const typeLabels: Record<string, string> = {
  extension_under_40: 'Extension <40m²',
  mob_under_150: 'MOB <150m²',
  other: 'Autre',
};

const typeColors: Record<string, string> = {
  extension_under_40: 'bg-orange-100 text-orange-700',
  mob_under_150: 'bg-teal-100 text-teal-700',
  other: 'bg-gray-100 text-gray-700',
};

// ─── Timeline steps ──────────────────────────────────────
const mockTimelineSteps = [
  { id: 'brief', label: 'Brief', description: 'Description du projet', status: 'done' as const, date: '2026-01-15', icon: 'clipboard' },
  { id: 'terrain', label: 'Terrain', description: 'Analyse foncière', status: 'done' as const, date: '2026-01-16', icon: 'map' },
  { id: 'programme', label: 'Programme', description: 'Programmation spatiale', status: 'done' as const, date: '2026-01-17', icon: 'layout' },
  { id: 'conception', label: 'Conception', description: 'Variants architecturaux', status: 'in_progress' as const, date: '2026-01-18', icon: 'pen' },
  { id: 'conformite', label: 'Conformité', description: 'Vérification réglementaire', status: 'todo' as const, icon: 'shield' },
  { id: 'livrables', label: 'Livrables', description: 'Génération documents', status: 'todo' as const, icon: 'file' },
  { id: 'depot', label: 'Dépôt', description: 'Soumission mairie', status: 'todo' as const, icon: 'send' },
];

// ─── Component ───────────────────────────────────────────
export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  void useAuth();
  const project = getProjectById(id || '1');
  const [evaluation] = useState<EvaluationResult>(mockEvaluationResult);

  if (!project) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Projet non trouvé</h2>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Retour au dashboard
        </Button>
      </div>
    );
  }

  const dateStr = new Date(project.created_at).toLocaleDateString('fr-FR');
  const checks: ComplianceCheck[] = project.compliance_checks || [];
  const blockingFails = evaluation.results.filter(
    (r: ComplianceCheckResult) => r.status === 'fail'
  );
  const brief = project.brief;
  const rooms: Room[] = brief?.rooms || [];
  const totalSurface = rooms.reduce((sum: number, r: Room) => sum + (r.surface || 0), 0);

  const handleValidateVariant = useCallback(() => {
    toast.success('Variante validée', {
      description: 'La variante architecturale a été retenue pour le projet.',
    });
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mb-4">
        <ArrowLeft size={16} className="mr-1" /> Retour
      </Button>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
          <Badge className={typeColors[project.project_type]}>
            {typeLabels[project.project_type]}
          </Badge>
          <Badge className={statusColors[project.status]}>
            {statusLabels[project.status]}
          </Badge>
        </div>
        <p className="text-sm text-slate-500 flex items-center gap-1">
          <MapPin size={13} /> {project.parcel_address}
        </p>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Ruler size={12} /> {project.surface_approx}m²
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {dateStr}
          </span>
          <span>
            Commune : {project.commune_name} ({project.commune_code})
          </span>
        </div>
      </div>

      {/* TIMELINE */}
      <Card className="mb-6">
        <CardContent className="pt-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Avancement du projet</h2>
          <ProjectTimeline steps={mockTimelineSteps} currentStatus={project.status} />
        </CardContent>
      </Card>

      {/* ONGlets */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="brief">Brief</TabsTrigger>
          <TabsTrigger value="programme">Programme</TabsTrigger>
          <TabsTrigger value="conformite">Conformité</TabsTrigger>
        </TabsList>

        {/* ONGLET 1 : Vue d&apos;ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-5">
                <div className="text-sm text-slate-500">Surface</div>
                <div className="text-2xl font-bold text-slate-800">{project.surface_approx} m²</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <div className="text-sm text-slate-500">Type</div>
                <div className="text-lg font-semibold text-slate-800">
                  {typeLabels[project.project_type]}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <div className="text-sm text-slate-500">Statut</div>
                <div className="text-lg font-semibold text-slate-800">
                  {statusLabels[project.status]}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-700">Description</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/deliverables/${project.id}`)}
                >
                  <FileText size={14} className="mr-1" /> Voir les livrables
                </Button>
              </div>
              <p className="text-sm text-slate-600">{project.description || 'Aucune description'}</p>
            </CardContent>
          </Card>

          {brief && (
            <Card>
              <CardContent className="pt-5">
                <h3 className="font-semibold text-slate-700 mb-3">
                  Brief ({rooms.length} pièces — {totalSurface}m²)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {rooms.map((room: Room, i: number) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-slate-500 capitalize">{room.type}</div>
                      <div className="text-sm font-semibold">{room.surface}m²</div>
                      {room.orientation && (
                        <div className="text-xs text-slate-400">{room.orientation}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ONGLET 2 : Brief */}
        <TabsContent value="brief">
          <Card>
            <CardContent className="pt-5">
              <h3 className="font-semibold text-slate-700 mb-4">Brief du projet</h3>
              {brief ? (
                <BriefBuilder
                  projectId={project.id}
                  existingBrief={brief}
                />
              ) : (
                <p className="text-slate-500">Aucun brief</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ONGLET 3 : Programme (Sprint 3) */}
        <TabsContent value="programme" className="space-y-4">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-700">Programme architectural</h3>
                  <p className="text-sm text-slate-500">
                    {rooms.length} pièces — {totalSurface}m² au total
                  </p>
                </div>
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => navigate(`/programming/${project.id}`)}
                >
                  <Layers size={16} className="mr-1" /> Voir la programmation
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-blue-600">Surface CHA</div>
                  <div className="text-lg font-bold text-blue-800">{totalSurface} m²</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-indigo-600">Surface CAO</div>
                  <div className="text-lg font-bold text-indigo-800">
                    {Math.round(totalSurface * 1.18)} m²
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-amber-600">Circulation</div>
                  <div className="text-lg font-bold text-amber-800">
                    {Math.round(totalSurface * 0.18)} m²
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/design/${project.id}`)}
                  className="flex-1"
                >
                  <Box size={16} className="mr-1" /> Générer les variantes
                </Button>
                <Button
                  variant="default"
                  onClick={handleValidateVariant}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle size={16} className="mr-1" /> Valider
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ONGLET 4 : Conformité (Sprint 2) */}
        <TabsContent value="conformite" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-700">Conformité réglementaire</h3>
            <Button
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => navigate(`/compliance/${project.id}`)}
            >
              <ShieldCheck size={16} className="mr-1" /> Voir le détail
            </Button>
          </div>

          {/* Score global */}
          <div className="flex items-center gap-6">
            <ComplianceGauge
              score={evaluation.summary.compliance_rate}
              size={140}
              label="Conformité globale"
            />
            <div className="grid grid-cols-2 gap-3 flex-1">
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="pt-4 pb-3">
                  <div className="text-xs text-emerald-600">Pass</div>
                  <div className="text-xl font-bold text-emerald-800">{evaluation.summary.passed}</div>
                </CardContent>
              </Card>
              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-4 pb-3">
                  <div className="text-xs text-red-600">Fail</div>
                  <div className="text-xl font-bold text-red-800">{evaluation.summary.failed}</div>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-4 pb-3">
                  <div className="text-xs text-amber-600">Warning</div>
                  <div className="text-xl font-bold text-amber-800">{evaluation.summary.warnings}</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="pt-4 pb-3">
                  <div className="text-xs text-gray-600">N/A</div>
                  <div className="text-xl font-bold text-gray-800">
                    {evaluation.summary.not_applicable}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {blockingFails.length > 0 && (
            <Card className="bg-red-50 border-red-300">
              <CardContent className="pt-4">
                <h4 className="text-sm font-semibold text-red-700 mb-2">
                  Problèmes bloquants ({blockingFails.length})
                </h4>
                <div className="space-y-2">
                  {blockingFails.slice(0, 3).map((r: ComplianceCheckResult, i: number) => (
                    <ComplianceBadge
                      key={i}
                      status="fail"
                      ruleName={`${r.rule_code} — ${r.rule_name}`}
                      message={r.message}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {checks.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center text-slate-500">
                Aucune vérification effectuée.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {checks.map((c: ComplianceCheck) => (
                <ComplianceBadge
                  key={c.id}
                  status={c.status}
                  ruleName={c.rule_name}
                  message={c.message}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
