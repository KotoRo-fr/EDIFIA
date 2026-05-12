import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface FootprintData {
  surface: number;
  cos: number;
  width: number;
  depth: number;
  heightMax: number;
  reculs: { front: number; side: number; rear: number };
  buildableWidth: number;
  buildableDepth: number;
}

const defaultFootprint: FootprintData = {
  surface: 0,
  cos: 0.5,
  width: 15,
  depth: 15,
  heightMax: 12,
  reculs: { front: 3, side: 1.5, rear: 3 },
  buildableWidth: 10,
  buildableDepth: 10,
};

const SVG_WIDTH = 300;
const SVG_HEIGHT = 200;
const PARCEL_X = 20;
const PARCEL_Y = 20;
const PARCEL_W = 260;
const PARCEL_H = 160;

function formatReculs(reculs: FootprintData['reculs']): string {
  return `${reculs.front} / ${reculs.side} / ${reculs.rear}`;
}

export default function ProgEmpriseSection({ data }: { data: FootprintData | null | undefined }) {
  const fp = data ?? defaultFootprint;

  const scaleX = PARCEL_W / fp.width;
  const scaleY = PARCEL_H / fp.depth;

  const empriseX = PARCEL_X + fp.reculs.side * scaleX;
  const empriseY = PARCEL_Y + fp.reculs.front * scaleY;
  const empriseW = fp.buildableWidth * scaleX;
  const empriseH = fp.buildableDepth * scaleY;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Emprise au sol</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 4 stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 text-center">
            <p className="text-xs text-slate-500 mb-1">COS</p>
            <p className="text-lg font-bold text-slate-800">{fp.cos}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 text-center">
            <p className="text-xs text-slate-500 mb-1">Hauteur max</p>
            <p className="text-lg font-bold text-slate-800">{fp.heightMax} m</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 text-center">
            <p className="text-xs text-slate-500 mb-1">Surface emprise</p>
            <p className="text-lg font-bold text-slate-800">{fp.surface} m²</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 text-center">
            <p className="text-xs text-slate-500 mb-1">Reculs (F / L / R)</p>
            <p className="text-lg font-bold text-slate-800">{formatReculs(fp.reculs)}</p>
          </div>
        </div>

        {/* SVG top-down diagram */}
        <div className="flex justify-center">
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="w-full max-w-sm rounded-lg border border-slate-200 bg-white"
          >
            {/* Parcel (grey) */}
            <rect
              x={PARCEL_X}
              y={PARCEL_Y}
              width={PARCEL_W}
              height={PARCEL_H}
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 2"
            />
            <text x={PARCEL_X + 6} y={PARCEL_Y + 14} fontSize={9} fill="#64748b">
              Parcelle ({fp.width} m × {fp.depth} m)
            </text>

            {/* Footprint (green) */}
            <rect
              x={empriseX}
              y={empriseY}
              width={empriseW}
              height={empriseH}
              fill="#bbf7d0"
              stroke="#22c55e"
              strokeWidth={1.5}
              rx={2}
            />

            {/* Dimensions — width */}
            <text
              x={empriseX + empriseW / 2}
              y={empriseY - 6}
              textAnchor="middle"
              fontSize={8}
              fill="#15803d"
            >
              {fp.buildableWidth} m
            </text>

            {/* Dimensions — depth */}
            <text
              x={empriseX + empriseW + 10}
              y={empriseY + empriseH / 2}
              textAnchor="start"
              dominantBaseline="middle"
              fontSize={8}
              fill="#15803d"
            >
              {fp.buildableDepth} m
            </text>

            {/* Center label */}
            <text
              x={empriseX + empriseW / 2}
              y={empriseY + empriseH / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fill="#15803d"
              fontWeight={500}
            >
              Emprise
            </text>

            {/* Recul labels */}
            <text x={SVG_WIDTH / 2} y={PARCEL_Y + PARCEL_H + 16} textAnchor="middle" fontSize={8} fill="#94a3b8">
              Avant: {fp.reculs.front} m
            </text>
            <text x={6} y={SVG_HEIGHT / 2} textAnchor="start" dominantBaseline="middle" fontSize={8} fill="#94a3b8" transform={`rotate(-90, 6, ${SVG_HEIGHT / 2})`}>
              Latéral: {fp.reculs.side} m
            </text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
