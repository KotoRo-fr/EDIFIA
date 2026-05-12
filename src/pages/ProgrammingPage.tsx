import { useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { mockProjects } from '@/mocks/data';
import { solveRoomProgram, generateFootprint, estimateBudget, analyzeSunExposure } from '@/lib/solver';

// Lazy load section components — CRUCIAL for performance
const ProgPiecesSection = lazy(() => import('@/components/programming/ProgPiecesSection'));
const ProgAdjacencesSection = lazy(() => import('@/components/programming/ProgAdjacencesSection'));
const ProgEnsoleillementSection = lazy(() => import('@/components/programming/ProgEnsoleillementSection'));
const ProgEmpriseSection = lazy(() => import('@/components/programming/ProgEmpriseSection'));
const ProgBudgetSection = lazy(() => import('@/components/programming/ProgBudgetSection'));

// Simple loading fallback
const SectionLoader = () => (
  <div className="p-8 text-center">
    <div className="animate-spin h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2" />
    <p className="text-sm text-slate-500">Chargement...</p>
  </div>
);

export default function ProgrammingPage() {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('pieces');
  const [programGenerated, setProgramGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [programData, setProgramData] = useState<any>(null);
  const [footprint, setFootprint] = useState<any>(null);
  const [, setSunAnalysis] = useState<any>(null);
  const [budget, setBudget] = useState<any>(null);

  // Get project
  const project = mockProjects.find((p: any) => p.id === projectId);

  const handleGenerate = () => {
    if (!project?.brief) return;
    setIsLoading(true);
    setTimeout(() => {
      try {
        const brief = project.brief!;
        const style = (brief.preferences?.style as string) || 'moderne';
        const prog = solveRoomProgram(brief.rooms, project.project_type, style);
        const parcelWidth = Math.max(15, Math.sqrt(project.surface_approx * 2));
        const parcelDepth = Math.max(15, project.surface_approx * 2 / parcelWidth);
        const fp = generateFootprint(parcelWidth, parcelDepth, 0.5, 12, { front: 3, side: 1.5, rear: 3 });
        const sun = analyzeSunExposure(prog);
        const bud = estimateBudget(prog.surfaces?.total ?? 0, project.project_type);
        setProgramData(prog);
        setFootprint(fp);
        setSunAnalysis(sun);
        setBudget(bud);
        setProgramGenerated(true);
      } catch (e) {
        console.error('Generation error:', e);
      } finally {
        setIsLoading(false);
      }
    }, 50);
  };

  if (!project) {
    return <div className="p-8 text-center text-slate-500">Projet non trouve</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Programmation architecturale</h1>
            <p className="text-sm text-slate-500">{project.name}</p>
          </div>
          {!programGenerated && (
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isLoading ? 'Generation...' : 'Generer le programme'}
            </Button>
          )}
          {programGenerated && (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Programme genere
            </Badge>
          )}
        </div>

        {/* Summary card when generated */}
        {programGenerated && programData && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-lg">Resume du programme</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Surface CAO</p>
                  <p className="text-lg font-bold text-slate-800">{programData.surfaces?.CAO ?? 0} m²</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Surface CHA</p>
                  <p className="text-lg font-bold text-slate-800">{programData.surfaces?.CHA ?? 0} m²</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Circulation</p>
                  <p className="text-lg font-bold text-slate-800">{programData.surfaces?.circulation ?? 0} m²</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Budget est.</p>
                  <p className="text-lg font-bold text-slate-800">{budget ? `${(budget.avg / 1000).toFixed(0)}k` : '—'} €</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs with lazy-loaded sections */}
        {programGenerated && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="pieces">Pieces</TabsTrigger>
              <TabsTrigger value="adjacences">Adjacences</TabsTrigger>
              <TabsTrigger value="ensoleillement">Ensoleillement</TabsTrigger>
              <TabsTrigger value="emprise">Emprise</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
            </TabsList>
            <TabsContent value="pieces">
              <Suspense fallback={<SectionLoader />}>
                <ProgPiecesSection data={programData} />
              </Suspense>
            </TabsContent>
            <TabsContent value="adjacences">
              <Suspense fallback={<SectionLoader />}>
                <ProgAdjacencesSection data={programData} />
              </Suspense>
            </TabsContent>
            <TabsContent value="ensoleillement">
              <Suspense fallback={<SectionLoader />}>
                <ProgEnsoleillementSection data={programData} />
              </Suspense>
            </TabsContent>
            <TabsContent value="emprise">
              <Suspense fallback={<SectionLoader />}>
                <ProgEmpriseSection data={footprint} />
              </Suspense>
            </TabsContent>
            <TabsContent value="budget">
              <Suspense fallback={<SectionLoader />}>
                <ProgBudgetSection data={budget} />
              </Suspense>
            </TabsContent>
          </Tabs>
        )}

        {/* Empty state */}
        {!programGenerated && !isLoading && (
          <Card className="border-dashed border-slate-300">
            <CardContent className="p-12 text-center">
              <p className="text-slate-400 mb-4">Cliquez sur "Generer le programme" pour creer le programme architectural</p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
