import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle,
  RotateCcw,
  Box,
  Layers,
  Sun,
  Wallet,
  Palette,
  ShieldCheck,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { mockProjects } from '@/mocks/data';
import { solveRoomProgram, generateFootprint, generateVariants } from '@/lib/solver';
import VariantComparison from '@/components/viewers/VariantComparison';
import Plan2DViewer from '@/components/viewers/Plan2DViewer';
import Viewer3D from '@/components/viewers/Viewer3D';
import type { Variant } from '@/types/solver';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';

const statusLabels: Record<string, string> = {
  draft: 'Brouillon', site_intel: 'Analyse terrain', programming: 'Programmation',
  design: 'Design', compliance: 'Conformité', deliverables: 'Livrables', submitted: 'Déposé',
};
const statusColors: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600', site_intel: 'bg-blue-50 text-blue-600',
  programming: 'bg-indigo-50 text-indigo-600', design: 'bg-violet-50 text-violet-600',
  compliance: 'bg-amber-50 text-amber-700', deliverables: 'bg-emerald-50 text-emerald-700',
  submitted: 'bg-green-50 text-green-700',
};

export default function DesignPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [variantsGenerated, setVariantsGenerated] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [validatedVariantId, setValidatedVariantId] = useState<string | null>(null);

  const project = useMemo(() =>
    mockProjects.find(p => p.id === projectId),
    [projectId]
  );

  const variants = useMemo(() => {
    if (!project?.brief) {
      return [] as Variant[];
    }

    const style = (project.brief.preferences?.style as string) || 'moderne';
    const program = solveRoomProgram(project.brief.rooms, project.project_type, style);

    const parcelWidth = Math.max(15, Math.sqrt(project.surface_approx * 2));
    const parcelDepth = Math.max(15, project.surface_approx * 2 / parcelWidth);
    const footprint = generateFootprint(parcelWidth, parcelDepth, 0.5, project.project_type === 'mob_under_150' ? 8 : 12, {
      front: 3, side: 1.5, rear: 3,
    });

    return generateVariants(program.rooms, footprint) as unknown as Variant[];
  }, [project]);

  const selectedVariant = useMemo(() =>
    variants.find(v => v.id === selectedVariantId) || null,
    [variants, selectedVariantId]
  );

  const handleGenerate = useCallback(() => {
    setVariantsGenerated(true);
  }, []);

  const handleRelaunch = useCallback(() => {
    setSelectedVariantId(null);
    setValidatedVariantId(null);
    // En réel, on re-génèrerait ici. Avec des mocks, on recharge simplement.
    setVariantsGenerated(false);
    setTimeout(() => setVariantsGenerated(true), 100);
  }, []);

  const handleValidate = useCallback(() => {
    if (selectedVariantId) {
      setValidatedVariantId(selectedVariantId);
    }
  }, [selectedVariantId]);

  if (!project) {
    return (
      <div className="p-8 text-center text-slate-500">
        <AlertCircle className="mx-auto mb-2 text-slate-400" size={32} />
        <p>Projet non trouvé.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={14} className="mr-1" /> Retour au tableau de bord
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/projects/${projectId}`)}
          className="mb-4 text-slate-500"
        >
          <ArrowLeft size={16} className="mr-1" /> Retour au projet
        </Button>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-800">Conception générative</h1>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[project.status]}`}>
            {statusLabels[project.status]}
          </span>
        </div>
        <p className="text-sm text-slate-500">{project.name} — {project.parcel_address}</p>
      </div>

      {/* Étape 1 : Comparateur de variantes */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Box size={18} className="text-orange-500" />
            <CardTitle className="text-base">Étape 1 — Comparateur de variantes</CardTitle>
          </div>
          <CardDescription>
            {variantsGenerated
              ? `${variants.length} variantes générées — Sélectionnez la meilleure`
              : 'Générez les variantes de conception pour ce programme'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!variantsGenerated ? (
            <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <Sparkles size={32} className="text-orange-400 mb-3" />
              <p className="text-sm text-slate-600 mb-1">Aucune variante générée</p>
              <p className="text-xs text-slate-400 mb-4">
                Le comparateur analysera jusqu'à 4 configurations différentes
              </p>
              <Button onClick={handleGenerate} className="bg-orange-600 hover:bg-orange-700 gap-2">
                <Sparkles size={16} />
                Générer les variantes
              </Button>
            </div>
          ) : (
            <>
              <VariantComparison
                variants={variants}
                selectedId={selectedVariantId}
                onSelect={setSelectedVariantId}
              />
              {validatedVariantId && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-sm text-emerald-700">
                    Variante validée : <strong>{variants.find(v => v.id === validatedVariantId)?.name}</strong>
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Étape 2 : Variante sélectionnée */}
      {selectedVariant && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-blue-500" />
                <CardTitle className="text-base">Étape 2 — Variante sélectionnée</CardTitle>
              </div>
              {/* Toggle 2D/3D */}
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-slate-400" />
                <span className="text-xs text-slate-500">Vue 2D</span>
                <Switch
                  checked={viewMode === '3d'}
                  onCheckedChange={(checked) => setViewMode(checked ? '3d' : '2d')}
                />
                <span className="text-xs text-slate-500">Vue 3D</span>
              </div>
            </div>
            <CardDescription>
              {selectedVariant.name} — Score global : {selectedVariant.scores.total}/100
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Colonne gauche (60%) : Viewer */}
              <div className="lg:w-[60%]">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-slate-700">
                    {viewMode === '2d' ? 'Plan 2D' : 'Vue 3D isométrique'}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {viewMode === '2d' ? 'Plan de masse' : 'Isométrique'}
                  </Badge>
                </div>
                {viewMode === '2d' ? (
                  <Plan2DViewer variant={selectedVariant} width={600} height={500} />
                ) : (
                  <Viewer3D variant={selectedVariant} width={600} height={500} />
                )}
              </div>

              {/* Colonne droite (40%) */}
              <div className="lg:w-[40%] space-y-5">
                {/* Nom + badge conformité */}
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-800">{selectedVariant.name.split(' — ')[1] || selectedVariant.name}</h3>
                  <Badge
                    className={
                      selectedVariant.conformite.score >= 80
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : selectedVariant.conformite.score >= 60
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                    }
                    variant="outline"
                  >
                    Conformité {selectedVariant.conformite.score}%
                  </Badge>
                </div>

                {/* Scores détaillés */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scores détaillés</h4>
                  <ScoreDetailBar
                    icon={<MaximizeCustom size={14} />}
                    label="Surface"
                    value={selectedVariant.scores.surface}
                    colorClass="bg-blue-500"
                  />
                  <ScoreDetailBar
                    icon={<Sun size={14} />}
                    label="Ensoleillement"
                    value={selectedVariant.scores.ensoleillement}
                    colorClass="bg-amber-500"
                  />
                  <ScoreDetailBar
                    icon={<Wallet size={14} />}
                    label="Coût"
                    value={selectedVariant.scores.cout}
                    colorClass="bg-emerald-500"
                  />
                  <ScoreDetailBar
                    icon={<Palette size={14} />}
                    label="Esthétique"
                    value={selectedVariant.scores.esthetique}
                    colorClass="bg-violet-500"
                  />
                </div>

                {/* Liste des pièces */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pièces</h4>
                  <div className="max-h-48 overflow-y-auto border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Pièce</TableHead>
                          <TableHead className="text-xs text-right">Surface</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedVariant.rooms.map((room) => (
                          <TableRow key={room.id}>
                            <TableCell className="text-sm">{room.type}</TableCell>
                            <TableCell className="text-sm text-right font-medium">{room.surface} m²</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Conformité checks */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Vérifications</h4>
                  <div className="space-y-1.5">
                    {selectedVariant.conformite.checks.map((check, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {check.pass ? (
                          <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle size={14} className="text-amber-500 shrink-0" />
                        )}
                        <span className={check.pass ? 'text-slate-700' : 'text-slate-500'}>
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 3 : Actions */}
      {variantsGenerated && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              <CardTitle className="text-base">Étape 3 — Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleRelaunch} className="gap-2">
                <RotateCcw size={14} />
                Relancer
              </Button>

              <Button
                onClick={handleValidate}
                disabled={!selectedVariantId || validatedVariantId === selectedVariantId}
                className="bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                <CheckCircle size={14} />
                {validatedVariantId === selectedVariantId ? 'Variante validée' : 'Valider cette variante'}
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate(`/programming/${projectId}`)}
                className="gap-2"
              >
                <ArrowLeft size={14} />
                Retour à la programmation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Sous-composants

function ScoreDetailBar({
  icon,
  label,
  value,
  colorClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400 w-4 flex justify-center">{icon}</span>
      <span className="text-sm text-slate-600 w-28">{label}</span>
      <div className="flex-1">
        <Progress value={value} className={`h-2 ${colorClass}`} />
      </div>
      <span className={`text-sm font-medium w-8 text-right ${value >= 80 ? 'text-emerald-600' : value >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
        {value}
      </span>
    </div>
  );
}

function MaximizeCustom({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}
