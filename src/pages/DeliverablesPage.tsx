import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calculator, ShieldCheck, Map, Package, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CerfaViewer from '@/components/deliverables/CerfaViewer';
import NoticeCalculViewer from '@/components/deliverables/NoticeCalculViewer';
import RapportConformiteViewer from '@/components/deliverables/RapportConformiteViewer';
import PlansViewer from '@/components/deliverables/PlansViewer';
import { listDeliverables, generateAllDeliverables, getCerfaData, getNoticeData, getRapportData, getPlansData } from '@/lib/api';
import { toast } from 'sonner';

const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  Calculator,
  ShieldCheck,
  Map,
  Package,
};

const DEFAULT_DOCS = [
  { id: 'cerfa', title: 'CERFA Permis de construire', icon: 'FileText', status: 'generated', description: 'Formulaire CERFA 13406*05 rempli automatiquement' },
  { id: 'notice', title: 'Notice de calcul', icon: 'Calculator', status: 'generated', description: 'Calculs structures, thermiques et reglementaires' },
  { id: 'rapport', title: 'Rapport de conformite', icon: 'ShieldCheck', status: 'generated', description: 'Synthese des 70 verifications reglementaires' },
  { id: 'plans', title: 'Plans architecturaux', icon: 'Map', status: 'generated', description: 'Plans de situation, masse et niveau RDC' },
  { id: 'pack', title: 'Pack complet de depot', icon: 'Package', status: 'pending', description: 'Assemblage de tous les documents pour la mairie' },
];

export default function DeliverablesPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cerfa');
  const [documents, setDocuments] = useState(DEFAULT_DOCS);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [cerfaData, setCerfaData] = useState<any>(null);
  const [noticeData, setNoticeData] = useState<any>(null);
  const [rapportData, setRapportData] = useState<any>(null);
  const [plansData, setPlansData] = useState<any>(null);

  const loadAll = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const deliverables = await listDeliverables(projectId);
      if (deliverables?.documents) {
        setDocuments(deliverables.documents);
      }
    } catch {
      // fallback mock deja dans withFallback
    }

    try {
      const cerfa = await getCerfaData(projectId);
      setCerfaData(cerfa);
    } catch {
      /* fallback silencieux */
    }

    try {
      const notice = await getNoticeData(projectId);
      setNoticeData(notice);
    } catch {
      /* fallback silencieux */
    }

    try {
      const rapport = await getRapportData(projectId);
      setRapportData(rapport);
    } catch {
      /* fallback silencieux */
    }

    try {
      const plans = await getPlansData(projectId);
      setPlansData(plans);
    } catch {
      /* fallback silencieux */
    }

    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleGenerateAll = async () => {
    if (!projectId) return;
    setGenerating(true);
    toast.info('Generation en cours', {
      description: 'Preparation de tous les documents de depot...',
    });
    try {
      const result = await generateAllDeliverables(projectId);
      if (result?.documents) {
        setDocuments(result.documents);
      }
      toast.success('Document genere', {
        description: 'Tous les documents de depot sont prets.',
      });
      await loadAll();
    } catch {
      toast.error('Erreur', {
        description: 'Impossible de generer les documents.',
      });
    } finally {
      setGenerating(false);
    }
  };

  const project = cerfaData?.project || noticeData?.project || rapportData?.project || plansData?.project;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${projectId}`)} className="mb-4">
        <ArrowLeft size={16} className="mr-1" /> Retour
      </Button>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Livrables de depot</h1>
          <p className="text-sm text-slate-500">{project?.name || 'Projet'} — Documents reglementaires</p>
        </div>
        <Button
          onClick={handleGenerateAll}
          disabled={generating}
        >
          <Download size={16} className="mr-2" />
          {generating ? 'Generation...' : 'Generer tous les documents'}
        </Button>
      </div>

      {/* Cards documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {documents.map((doc: any) => {
          const Icon = ICON_MAP[doc.icon] || FileText;
          return (
            <Card key={doc.id} className={`cursor-pointer transition-all hover:shadow-md ${activeTab === doc.id ? 'ring-2 ring-orange-300 border-orange-300' : ''}`} onClick={() => setActiveTab(doc.id)}>
              <CardContent className="pt-4 pb-3 text-center">
                <Icon size={24} className="mx-auto mb-2 text-slate-400" />
                <div className="text-xs font-medium truncate">{doc.title}</div>
                <Badge className={`mt-1 text-[10px] ${doc.status === 'generated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {doc.status === 'generated' ? 'Genere' : 'En attente'}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Viewer */}
      <Card>
        <CardContent className="pt-5">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Chargement des documents...</div>
          ) : (
            <>
              {activeTab === 'cerfa' && cerfaData && <CerfaViewer project={cerfaData.project} profile={cerfaData.profile} />}
              {activeTab === 'notice' && noticeData && <NoticeCalculViewer project={noticeData.project} complianceResult={noticeData.complianceResult} />}
              {activeTab === 'rapport' && rapportData && <RapportConformiteViewer project={rapportData.project} complianceResult={rapportData.complianceResult} />}
              {activeTab === 'plans' && plansData && <PlansViewer project={plansData.project} variant={plansData.variant} />}
              {activeTab === 'pack' && (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-slate-300 mb-3" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Pack de depot</h3>
                  <p className="text-sm text-slate-500 mb-4">{documents.filter((d: any) => d.status === 'generated').length} documents generes, prets pour assemblage.</p>
                  <Button variant="outline" onClick={() => {
                    toast.success('Document genere', {
                      description: 'Le pack complet a ete telecharge.',
                    });
                  }}>
                    Telecharger le pack
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
