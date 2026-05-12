import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

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

function formatRoomType(type: string): string {
  return typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

export default function ProgPiecesSection({ data }: { data: ProgramData }) {
  if (!data) {
    return <div>Chargement...</div>;
  }

  const { rooms, surfaces, ratios } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <span>Pièces du programme</span>
          <Badge variant="secondary" className="text-xs">
            {rooms.length} pièce{rooms.length > 1 ? 's' : ''} programmée{rooms.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Tableau des pièces */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="p-2 font-medium">Nom</th>
                <th className="p-2 font-medium">Type</th>
                <th className="p-2 font-medium">Surface</th>
                <th className="p-2 font-medium">Dimensions</th>
                <th className="p-2 font-medium">Priorité</th>
                <th className="p-2 font-medium">Orientation</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr
                  key={room.id}
                  className={`border-b ${index % 2 === 1 ? 'bg-slate-50' : ''}`}
                >
                  <td className="p-2 font-medium">{room.name}</td>
                  <td className="p-2 text-slate-600">{formatRoomType(room.type)}</td>
                  <td className="p-2 text-slate-600">{room.surface} m²</td>
                  <td className="p-2 text-slate-600">
                    {room.width} × {room.depth} m
                  </td>
                  <td className="p-2">
                    <Badge variant="outline" className="text-xs">
                      #{room.priority}
                    </Badge>
                  </td>
                  <td className="p-2 text-slate-600">
                    {room.orientation || (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Carte récap surfaces */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wider mb-1">
              CAO
            </p>
            <p className="text-2xl font-bold text-blue-800">{surfaces.CAO} m²</p>
            <p className="text-xs text-blue-600 mt-1">Close et Ouverte</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider mb-1">
              CHA
            </p>
            <p className="text-2xl font-bold text-emerald-800">{surfaces.CHA} m²</p>
            <p className="text-xs text-emerald-600 mt-1">Surface chargeable</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs text-amber-600 font-medium uppercase tracking-wider mb-1">
              Circulation
            </p>
            <p className="text-2xl font-bold text-amber-800">
              {surfaces.circulation} m²
            </p>
            <p className="text-xs text-amber-600 mt-1">
              {ratios.circulation_ratio}% du total
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 font-medium uppercase tracking-wider mb-1">
              Total
            </p>
            <p className="text-2xl font-bold text-slate-800">{surfaces.total} m²</p>
            <p className="text-xs text-slate-600 mt-1">Surface totale</p>
          </div>
        </div>

        {/* Ratio CHA/CAO */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <span className="text-sm text-slate-600">Ratio CHA/CAO :</span>
          <span className="text-sm font-bold text-slate-800">{ratios.CHA_CAO}%</span>
          <Progress value={Math.min(ratios.CHA_CAO, 100)} className="w-24 h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
