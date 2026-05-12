import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Info, Sun } from 'lucide-react';

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

const orientationLabels: Record<string, string> = {
  N: 'Nord',
  S: 'Sud',
  E: 'Est',
  W: 'Ouest',
  NE: 'Nord-Est',
  NW: 'Nord-Ouest',
  SE: 'Sud-Est',
  SW: 'Sud-Ouest',
};

function formatOrientation(value: string): string {
  return orientationLabels[value] || value;
}

/** Get room display name from roomId */
function getRoomName(
  rooms: ProgramData['rooms'],
  roomId: string
): string {
  const room = rooms.find((r) => r.id === roomId);
  if (room) return room.name;
  // Fallback: try to format from roomId itself
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
  return typeLabels[roomId] || roomId;
}

export default function ProgEnsoleillementSection({
  data,
}: {
  data: ProgramData;
}) {
  if (!data) {
    return <div>Chargement...</div>;
  }

  const { rooms, sunRecommendations } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sun size={18} className="text-amber-500" />
          <span>Analyse ensoleillement</span>
          <Badge
            variant="outline"
            className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
          >
            Recommandations RE2020
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Cards for each room */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sunRecommendations.map((rec) => {
            const scoreColor =
              rec.score >= 80
                ? 'text-emerald-600'
                : rec.score >= 60
                  ? 'text-amber-600'
                  : 'text-red-500';

            return (
              <div
                key={rec.roomId}
                className="p-4 rounded-lg border border-slate-200 bg-white space-y-3"
              >
                {/* Room name */}
                <h4 className="text-sm font-semibold text-slate-800">
                  {getRoomName(rooms, rec.roomId)}
                </h4>

                {/* Optimal orientation */}
                {rec.optimal.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-slate-500 mt-0.5 shrink-0">
                      Optimale
                    </span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-xs">
                      {rec.optimal.map(formatOrientation).join(', ')}
                    </Badge>
                  </div>
                )}

                {/* Acceptable orientations */}
                {rec.acceptable.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-slate-500 mt-0.5 shrink-0">
                      Acceptable
                    </span>
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 text-xs">
                      {rec.acceptable.map(formatOrientation).join(', ')}
                    </Badge>
                  </div>
                )}

                {/* Avoid orientations */}
                {rec.avoid.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-slate-500 mt-0.5 shrink-0">
                      À éviter
                    </span>
                    <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 text-xs">
                      {rec.avoid.map(formatOrientation).join(', ')}
                    </Badge>
                  </div>
                )}

                {/* Score */}
                <div className="flex items-center gap-2 pt-1">
                  <Progress value={rec.score} className="h-1.5 flex-1" />
                  <span className={`text-xs font-medium ${scoreColor}`}>
                    {rec.score}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Box info */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
          <Info size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700">
            L'ensoleillement optimal réduit les besoins de chauffage de 30%.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
