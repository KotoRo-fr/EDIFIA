import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, FileText, Calculator, ShieldCheck, Map, Package, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CerfaViewer from '@/components/deliverables/CerfaViewer';
import NoticeCalculViewer from '@/components/deliverables/NoticeCalculViewer';
import RapportConformiteViewer from '@/components/deliverables/RapportConformiteViewer';
import PlansViewer from '@/components/deliverables/PlansViewer';
import { mockProjects } from '@/mocks/data';
import { mockEvaluationResult } from '@/mocks/complianceData';
import { toast } from 'sonner';

const DOCUMENTS = [
  { id: 'cerfa', title: 'CERFA Permis de construire', icon: FileText, status: 'generated', description: 'Formulaire CERFA 13406*05 rempli automatiquement' },
  { id: 'notice', title: 'Notice de calcul', icon: Calculator, status: 'generated', description: 'Calculs structures, thermiques et reglementaires' },
  { id: 'rapport', title: 'Rapport de conformite', icon: ShieldCheck, status: 'generated', description: 'Synthese des 70 verifications reglementaires' },
  { id: 'plans', title: 'Plans architecturaux', icon: Map, status: 'generated', description: 'Plans de situation, masse et niveau RDC' },
  { id: 'pack', title: 'Pack complet de depot', icon: Package, status: 'pending', description: 'Assemblage de tous les documents pour la mairie' },
];

export default function DeliverablesPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cerfa');

  const project = mockProjects.find(p => p.id === projectId);
  const profile = { first_name: 'Marie', last_name: 'Dubois' };

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
          onClick={() => {
            toast.info('Generation en cours', {
              description: 'Preparation de tous les documents de depot...',
            });
            setTimeout(() => {
              toast.success('Document genere', {
                description: 'Tous les documents de depot sont prets.',
              });
            }, 2000);
          }}
        >
          <Download size={16} className="mr-2" /> Generer tous les documents
        </Button>
      </div>

      {/* Cards documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {DOCUMENTS.map((doc) => {
          const Icon = doc.icon;
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
          {activeTab === 'cerfa' && <CerfaViewer project={project} profile={profile} />}
          {activeTab === 'notice' && <NoticeCalculViewer project={project} complianceResult={mockEvaluationResult} />}
          {activeTab === 'rapport' && <RapportConformiteViewer project={project} complianceResult={mockEvaluationResult} />}
          {activeTab === 'plans' && <PlansViewer project={project} />}
          {activeTab === 'pack' && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Pack de depot</h3>
              <p className="text-sm text-slate-500 mb-4">4 documents generes, prets pour assemblage.</p>
              <Button variant="outline" onClick={() => {
                toast.success('Document genere', {
                  description: 'Le pack complet a ete telecharge.',
                });
              }}>
                Telecharger le pack
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
