import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Sun,
  Ruler,
  Building2,
  Wallet,
  ChevronRight,
  Sparkles,
  CircleDollarSign,
  TrendingUp,
  AlertCircle,
  Server,
} from 'lucide-react';
import { mockProjects } from '@/mocks/data';
import { generateFootprint, analyzeSunExposure, estimateBudget, solveRoomProgram } from '@/lib/solver';
import type { Program } from '@/lib/solver/types';
import { generateProgram } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

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

export default function ProgrammingPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [programGenerated, setProgramGenerated] = useState(false);
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useApi, setUseApi] = useState(false);

  const project = useMemo(() =>
    mockProjects.find(p => p.id === projectId),
    [projectId]
  );

  const { footprint, sunAnalysis, budget } = useMemo(() => {
    if (!project?.brief || !program) {
      return { footprint: null, sunAnalysis: null, budget: null };
    }

    // Generate footprint with sensible defaults based on project surface
    const parcelWidth = Math.max(15, Math.sqrt(project.surface_approx * 2));
    const parcelDepth = Math.max(15, project.surface_approx * 2 / parcelWidth);
    const cos = 0.5;
    const heightMax = project.project_type === 'mob_under_150' ? 8 : 12;
    const footprint = generateFootprint(parcelWidth, parcelDepth, cos, heightMax, {
      front: 3, side: 1.5, rear: 3,
    });

    const sunAnalysis = analyzeSunExposure(program);
    const budget = estimateBudget(program.surfaces?.total ?? 0, project.project_type);

    return { footprint, sunAnalysis, budget };
  }, [project, program]);

  const handleGenerate = useCallback(async () => {
    if (!project?.brief) return;
    setIsLoading(true);

    const brief = project.brief;
    const style = (brief.preferences?.style as string) || 'moderne';

    // Appel API avec fallback automatique vers solver local
    const result = await generateProgram(
      project.id,
      brief.rooms,
      project.project_type,
      style
    );
    setProgram(result);
    setProgramGenerated(true);
    setIsLoading(false);
  }, [project]);

  const handleGenerateLocal = useCallback(() => {
    if (!project?.brief) return;

    const brief = project.brief;
    const style = (brief.preferences?.style as string) || 'moderne';

    // Solver local direct (mode offline)
    const localProgram = solveRoomProgram(brief.rooms, project.project_type, style);
    setProgram(localProgram);
    setProgramGenerated(true);
  }, [project]);

  // Auto-generate program on page load
  useEffect(() => {
    if (project?.brief && !programGenerated && !isLoading) {
      handleGenerateLocal();
    }
  }, [project]);

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
    <div className="p-6 lg:p-8 max-w-6xl space-y-6">
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
          <h1 className="text-2xl font-bold text-slate-800">Programmation architecturale</h1>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[project.status]}`}>
            {statusLabels[project.status]}
          </span>
        </div>
        <p className="text-sm text-slate-500">{project.name} — {project.parcel_address}</p>
      </div>

      {/* Section 1 : Résumé du brief */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-slate-500" />
            <CardTitle className="text-base">Résumé du brief</CardTitle>
          </div>
          <CardDescription>
            {project.brief?.rooms.length || 0} pièces demandées
            {project.brief?.budget_range && ` — Budget : ${project.brief.budget_range}`}
            {project.brief?.style_preference && ` — Style : ${project.brief.style_preference}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {project.brief && project.brief.rooms.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pièce</TableHead>
                  <TableHead>Surface</TableHead>
                  <TableHead>Orientation souhaitée</TableHead>
                  <TableHead>Priorité</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.brief.rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.type}</TableCell>
                    <TableCell>{room.surface} m²</TableCell>
                    <TableCell>
                      {room.orientation ? (
                        <span className="inline-flex items-center gap-1">
                          <Sun size={12} className="text-amber-500" />
                          {room.orientation}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        #{room.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-slate-500">Aucune pièce définie dans le brief.</p>
          )}
        </CardContent>
      </Card>

      {/* Bouton générer */}
      {!programGenerated && (
        <div className="flex flex-col items-center justify-center py-8 bg-white rounded-xl border border-dashed border-slate-300 space-y-3">
          <Sparkles size={32} className="text-orange-400 mb-3" />
          <p className="text-sm text-slate-600 mb-4">Générez le programme architectural à partir du brief</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700 gap-2"
            >
              <Sparkles size={16} />
              {isLoading ? 'Generation en cours...' : 'Generer le programme'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseApi(!useApi)}
              className="gap-2 text-slate-500"
              title="Mode debug : forcer l\\'appel API ou le solver local"
            >
              <Server size={14} />
              {useApi ? 'Mode API' : 'Mode auto (fallback)'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerateLocal}
              className="text-slate-400"
              title="Forcer le solver local (mode offline)"
            >
              Solver local
            </Button>
          </div>
        </div>
      )}

      {/* Programme généré */}
      {programGenerated && program && (
        <>
          {/* Section 2 : Programme généré */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-orange-500" />
                <CardTitle className="text-base">Programme généré</CardTitle>
              </div>
              <CardDescription>Graphe d'adjacence et surfaces calculées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Adjacences */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Adjacences</h4>
                {(program.adjacencies ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(program.adjacencies ?? []).map((adj, i) => (
                      <Badge
                        key={i}
                        variant={adj.type === 'direct' ? 'default' : 'secondary'}
                        className={adj.type === 'direct' ? 'bg-blue-600' : ''}
                      >
                        {adj.roomA} ↔ {adj.roomB}
                        <span className="ml-1 opacity-75">({adj.type})</span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Aucune adjacence requise.</p>
                )}
              </div>

              {/* Surfaces : CAO, CHA, Circulation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium uppercase tracking-wider mb-1">CAO</p>
                  <p className="text-2xl font-bold text-blue-800">{program.surfaces?.CAO ?? 0} m²</p>
                  <p className="text-xs text-blue-600 mt-1">Close et Ouverte</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider mb-1">CHA</p>
                  <p className="text-2xl font-bold text-emerald-800">{program.surfaces?.CHA ?? 0} m²</p>
                  <p className="text-xs text-emerald-600 mt-1">Surface chargeable</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-xs text-amber-600 font-medium uppercase tracking-wider mb-1">Circulation</p>
                  <p className="text-2xl font-bold text-amber-800">{program.surfaces?.circulation ?? 0} m²</p>
                  <p className="text-xs text-amber-600 mt-1">{program.ratios?.circulation_ratio ?? 0}% du total</p>
                </div>
              </div>

              {/* Ratios */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <TrendingUp size={16} className="text-slate-500" />
                <span className="text-sm text-slate-600">Ratio CHA/CAO :</span>
                <span className="text-sm font-bold text-slate-800">{program.ratios?.CHA_CAO ?? 0}%</span>
                <Progress value={Math.min(program.ratios?.CHA_CAO ?? 0, 100)} className="w-24 h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Section 3 : Analyse ensoleillement */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sun size={18} className="text-amber-500" />
                <CardTitle className="text-base">Analyse ensoleillement</CardTitle>
              </div>
              <CardDescription>Orientation optimale par pièce</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pièce</TableHead>
                    <TableHead>Orientation optimale</TableHead>
                    <TableHead>Acceptable</TableHead>
                    <TableHead>À éviter</TableHead>
                    <TableHead className="w-20">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sunAnalysis?.map((sa) => (
                    <TableRow key={sa.roomId}>
                      <TableCell className="font-medium">
                        <span className="inline-flex items-center gap-1">
                          {sa.optimal.includes('Sud') && <Sun size={12} className="text-amber-500" />}
                          {sa.roomType}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {sa.optimal}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {sa.acceptable.length > 0 ? (
                          <span className="text-xs text-slate-600">{sa.acceptable.join(', ')}</span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {sa.avoid.length > 0 ? (
                          <span className="text-xs text-red-500">{sa.avoid.join(', ')}</span>
                        ) : (
                          <span className="text-xs text-slate-400">Aucune</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={sa.score} className="w-12 h-1.5" />
                          <span className={`text-xs font-medium ${sa.score >= 80 ? 'text-emerald-600' : sa.score >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                            {sa.score}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Section 4 : Emprise au sol */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Ruler size={18} className="text-slate-500" />
                <CardTitle className="text-base">Emprise au sol</CardTitle>
              </div>
              <CardDescription>Calcul depuis le PLU</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">COS</p>
                  <p className="text-lg font-bold text-slate-800">{footprint?.cos ?? '—'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Hauteur max</p>
                  <p className="text-lg font-bold text-slate-800">{footprint?.maxHeight ?? '—'} m</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Surface emprise</p>
                  <p className="text-lg font-bold text-slate-800">{footprint?.surface ?? '—'} m²</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Reculs (F/L/R)</p>
                  <p className="text-lg font-bold text-slate-800">
                    {footprint?.reculs ? `${footprint.reculs.front}/${footprint.reculs.side}/${footprint.reculs.rear}` : '—'}
                  </p>
                </div>
              </div>

              {/* Mini diagramme SVG */}
              {footprint && (
                <div className="flex justify-center">
                  <svg viewBox="0 0 300 200" className="w-full max-w-sm bg-white rounded-lg border border-slate-200">
                    {/* Parcelle (gris) */}
                    <rect
                      x={20} y={20}
                      width={260} height={160}
                      fill="#f1f5f9" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 2"
                    />
                    <text x={25} y={35} fontSize={9} fill="#64748b">Parcelle</text>

                    {/* Emprise (vert) */}
                    <rect
                      x={20 + (footprint.reculs?.side ?? 0) * 8}
                      y={20 + (footprint.reculs?.front ?? 0) * 4}
                      width={(footprint.width - (footprint.reculs?.side ?? 0) * 2) * 8}
                      height={(footprint.depth - (footprint.reculs?.front ?? 0) - (footprint.reculs?.rear ?? 0)) * 4}
                      fill="#bbf7d0" stroke="#22c55e" strokeWidth={1.5} rx={2}
                    />
                    <text
                      x={20 + (footprint.reculs?.side ?? 0) * 8 + ((footprint.width - (footprint.reculs?.side ?? 0) * 2) * 8) / 2}
                      y={20 + (footprint.reculs?.front ?? 0) * 4 + ((footprint.depth - (footprint.reculs?.front ?? 0) - (footprint.reculs?.rear ?? 0)) * 4) / 2}
                      textAnchor="middle" fontSize={10} fill="#15803d" fontWeight={500}
                    >
                      Emprise
                    </text>
                  </svg>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 5 : Estimation budget */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CircleDollarSign size={18} className="text-emerald-500" />
                <CardTitle className="text-base">Estimation budgétaire</CardTitle>
              </div>
              <CardDescription>Fourchette indicative</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
                  <p className="text-xs text-emerald-600 font-medium mb-1">Minimum</p>
                  <p className="text-xl font-bold text-emerald-800">
                    {budget ? `${(budget.min / 1000).toFixed(0)}k €` : '—'}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
                  <p className="text-xs text-blue-600 font-medium mb-1">Moyenne</p>
                  <p className="text-xl font-bold text-blue-800">
                    {budget ? `${(budget.avg / 1000).toFixed(0)}k €` : '—'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <p className="text-xs text-slate-600 font-medium mb-1">Maximum</p>
                  <p className="text-xl font-bold text-slate-800">
                    {budget ? `${(budget.max / 1000).toFixed(0)}k €` : '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Wallet size={14} className="text-slate-500" />
                  <span className="text-sm text-slate-600">Prix au m² :</span>
                  <span className="text-sm font-bold text-slate-800">
                    {budget ? `${budget.pricePerM2.toLocaleString('fr-FR')} €` : '—'}
                  </span>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  Estimation indicative
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* CTA vers Design */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={() => navigate(`/design/${projectId}`)}
              className="bg-orange-600 hover:bg-orange-700 gap-2 px-6"
              size="lg"
            >
              Générer les variantes de conception
              <ChevronRight size={16} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
