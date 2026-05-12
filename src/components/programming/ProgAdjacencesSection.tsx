import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface ProgramData {
  rooms: Array<{
    id: string;
    type: string;
    name: string;
    surface: number;
    width: number;
    depth: number;
    orientation?: string;
    priority: number;
    adjacencyRequired?: string[];
  }>;
  adjacencies: Array<{ roomA: string; roomB: string; type: string }>;
  sunRecommendations: Array<{
    roomId: string;
    optimal: string[];
    acceptable: string[];
    avoid: string[];
    score: number;
  }>;
  surfaces: { CAO: number; CHA: number; circulation: number; total: number };
  ratios: { CHA_CAO: number; circulation_ratio: number };
  circulationArea: number;
  totalCAO: number;
  totalCHA: number;
}

const typeLabels: Record<string, string> = {
  salon: 'Salon',
  sejour: 'Séjour',
  cuisine: 'Cuisine',
  chambre: 'Chambre',
  chambre_parentale: 'Chambre parentale',
  salle_de_bain: 'Salle de bain',
  wc: 'WC',
  bureau: 'Bureau',
  dressing: 'Dressing',
  buanderie: 'Buanderie',
  entree: 'Entrée',
  couloir: 'Couloir',
};

function formatRoomName(roomId: string): string {
  return typeLabels[roomId] || roomId;
}

/** Encoded adjacency rules for display */
const adjacencyRules: Record<string, string[]> = {
  Cuisine: ['Salon', 'Séjour'],
  'Chambre parentale': ['Salle de bain'],
  'Salle de bain': ['Chambre parentale', 'Chambre'],
  WC: ['Couloir', 'Salle de bain'],
};

export default function ProgAdjacencesSection({ data }: { data: ProgramData }) {
  if (!data) {
    return <div>Chargement...</div>;
  }

  const { adjacencies } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <span>Graphe d'adjacences</span>
          <Badge variant="secondary" className="text-xs">
            {adjacencies.length} adjacence{adjacencies.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Tableau des adjacences */}
        {adjacencies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="p-2 font-medium">Pièce A</th>
                  <th className="p-2 font-medium"></th>
                  <th className="p-2 font-medium">Pièce B</th>
                  <th className="p-2 font-medium">Type de relation</th>
                </tr>
              </thead>
              <tbody>
                {adjacencies.map((adj, index) => (
                  <tr
                    key={index}
                    className={`border-b ${index % 2 === 1 ? 'bg-slate-50' : ''}`}
                  >
                    <td className="p-2 font-medium">
                      {formatRoomName(adj.roomA)}
                    </td>
                    <td className="p-2 text-slate-400">→</td>
                    <td className="p-2 font-medium">
                      {formatRoomName(adj.roomB)}
                    </td>
                    <td className="p-2">
                      <Badge
                        variant={adj.type === 'direct' ? 'default' : 'secondary'}
                        className={
                          adj.type === 'direct'
                            ? 'bg-blue-600 text-xs'
                            : 'text-xs'
                        }
                      >
                        {adj.type === 'direct' ? 'Direct' : 'Proximité'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Aucune adjacence requise.</p>
        )}

        {/* Règles d'adjacence encodées */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">
            Règles d'adjacence
          </h4>
          <ul className="space-y-1">
            {Object.entries(adjacencyRules).map(([source, targets]) => (
              <li key={source} className="text-sm text-slate-600">
                <span className="font-medium">{source}</span>
                <span className="text-slate-400 mx-1">→</span>
                {targets.join(', ')}
              </li>
            ))}
          </ul>
        </div>

        {/* Box info */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-700">
            Les adjacences optimisent les circulations et réduisent les coûts de
            construction.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
