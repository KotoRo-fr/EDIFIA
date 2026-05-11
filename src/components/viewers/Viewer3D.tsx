import { useMemo } from 'react';
import type { Variant, Footprint } from '@/types/solver';

interface Viewer3DProps {
  variant?: Variant;
  footprint?: Footprint;
  width?: number;
  height?: number;
}

const ROOM_COLORS_3D: Record<string, { wall: string; roof: string }> = {
  'Séjour': { wall: '#93c5fd', roof: '#60a5fa' },
  'Salon': { wall: '#93c5fd', roof: '#60a5fa' },
  'Cuisine': { wall: '#fcd34d', roof: '#fbbf24' },
  'Salle à manger': { wall: '#f9a8d4', roof: '#f472b6' },
  'Chambre': { wall: '#c4b5fd', roof: '#a78bfa' },
  'Chambre 1': { wall: '#c4b5fd', roof: '#a78bfa' },
  'Chambre 2': { wall: '#ddd6fe', roof: '#c4b5fd' },
  'Salle de bain': { wall: '#67e8f9', roof: '#22d3ee' },
  "Salle d'eau": { wall: '#67e8f9', roof: '#22d3ee' },
  'Bureau': { wall: '#d1d5db', roof: '#9ca3af' },
  'Dressing': { wall: '#fde047', roof: '#facc15' },
  'Rangement': { wall: '#d1d5db', roof: '#9ca3af' },
  'Véranda': { wall: '#6ee7b7', roof: '#34d399' },
  'Studio': { wall: '#93c5fd', roof: '#60a5fa' },
  default: { wall: '#d1d5db', roof: '#9ca3af' },
};

/**
 * Viewer3D — Vue isométrique simplifiée en SVG
 * Dessine une projection isométrique de la maison
 */
export default function Viewer3D({ variant, footprint, width = 600, height = 500 }: Viewer3DProps) {
  const { scale, offsetX, offsetY, rooms, fp } = useMemo(() => {
    const fp = variant?.footprint || footprint;
    if (!fp) return { scale: 1, offsetX: 0, offsetY: 0, rooms: [], fp: null };

    const padding = 60;
    const availableW = width - padding * 2;
    const availableH = height - padding * 2;

    // Isometric projection scale
    const isoScale = 0.8;
    const scaleX = (availableW / fp.width) * isoScale;
    const scaleY = (availableH / fp.depth) * isoScale;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = width / 2;
    const offsetY = height / 3;

    const rooms = variant?.rooms || [];

    return { scale, offsetX, offsetY, rooms, fp };
  }, [variant, footprint, width, height]);

  if (!fp) {
    return (
      <div
        className="flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200"
        style={{ width, height }}
      >
        <p className="text-sm text-slate-400">Aucun modèle 3D à afficher</p>
      </div>
    );
  }

  // Isometric projection helpers
  const toIso = (x: number, y: number, z: number) => {
    const isoX = offsetX + (x - y) * scale * 0.866;
    const isoY = offsetY + (x + y) * scale * 0.5 - z * scale * 0.6;
    return { x: isoX, y: isoY };
  };

  const wallHeight = 2.8; // mètres

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', maxWidth: width, height }}
        className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg border border-slate-200"
      >
        {/* Sol de la parcelle */}
        {(() => {
          const p1 = toIso(0, 0, 0);
          const p2 = toIso(fp.width, 0, 0);
          const p3 = toIso(fp.width, fp.depth, 0);
          const p4 = toIso(0, fp.depth, 0);
          return (
            <polygon
              points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth={1}
              strokeDasharray="4 2"
            />
          );
        })()}

        {/* Zone constructible */}
        {(() => {
          const b1 = toIso(fp.reculs.side, fp.reculs.front, 0);
          const b2 = toIso(fp.width - fp.reculs.side, fp.reculs.front, 0);
          const b3 = toIso(fp.width - fp.reculs.side, fp.depth - fp.reculs.rear, 0);
          const b4 = toIso(fp.reculs.side, fp.depth - fp.reculs.rear, 0);
          return (
            <polygon
              points={`${b1.x},${b1.y} ${b2.x},${b2.y} ${b3.x},${b3.y} ${b4.x},${b4.y}`}
              fill="#dcfce7"
              stroke="#22c55e"
              strokeWidth={1.5}
              opacity={0.6}
            />
          );
        })()}

        {/* Pièces en 3D isométrique */}
        {rooms.map((room) => {
          const colors = ROOM_COLORS_3D[room.type] || ROOM_COLORS_3D.default;

          // Base coordinates
          const x1 = room.x;
          const y1 = room.y;
          const x2 = room.x + room.width;
          const y2 = room.y + room.depth;

          // Floor corners
          const fl1 = toIso(x1, y1, 0);
          const fl2 = toIso(x2, y1, 0);
          const fl3 = toIso(x2, y2, 0);
          const fl4 = toIso(x1, y2, 0);

          // Roof corners
          const r1 = toIso(x1, y1, wallHeight);
          const r2 = toIso(x2, y1, wallHeight);
          const r3 = toIso(x2, y2, wallHeight);
          const r4 = toIso(x1, y2, wallHeight);

          // Wall faces (only draw visible faces: left and right)
          // Left wall (x1 face)
          const leftWall = [fl4, fl1, r1, r4];
          // Right wall (y1 face)
          const rightWall = [fl1, fl2, r2, r1];
          // Roof
          const roof = [r1, r2, r3, r4];

          const centerFloor = {
            x: (fl1.x + fl3.x) / 2,
            y: (fl1.y + fl3.y) / 2,
          };

          return (
            <g key={room.id}>
              {/* Left wall */}
              <polygon
                points={leftWall.map((p) => `${p.x},${p.y}`).join(' ')}
                fill={colors.wall}
                stroke="#64748b"
                strokeWidth={0.8}
                opacity={0.85}
              />
              {/* Right wall */}
              <polygon
                points={rightWall.map((p) => `${p.x},${p.y}`).join(' ')}
                fill={colors.roof}
                stroke="#64748b"
                strokeWidth={0.8}
                opacity={0.85}
              />
              {/* Roof */}
              <polygon
                points={roof.map((p) => `${p.x},${p.y}`).join(' ')}
                fill={colors.roof}
                stroke="#475569"
                strokeWidth={1}
                opacity={0.95}
              />
              {/* Floor label */}
              <text
                x={centerFloor.x}
                y={centerFloor.y}
                textAnchor="middle"
                fontSize={Math.max(8, Math.min(10, room.width * scale * 0.15))}
                fill="#334155"
                fontWeight={500}
              >
                {room.type}
              </text>
            </g>
          );
        })}

        {/* Indicateur Nord */}
        {(() => {
          const nx = width - 50;
          const ny = 30;
          return (
            <g>
              <text x={nx} y={ny} textAnchor="middle" fontSize={10} fill="#64748b" fontWeight={600}>
                N
              </text>
              <line x1={nx} y1={ny + 4} x2={nx} y2={ny + 20} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead)" />
              <defs>
                <marker id="arrowhead" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
                  <polygon points="0 0, 6 2, 0 4" fill="#64748b" />
                </marker>
              </defs>
            </g>
          );
        })()}
      </svg>

      {/* Légende */}
      <div className="mt-2 flex flex-wrap gap-2">
        {rooms.slice(0, 5).map((room) => {
          const colors = ROOM_COLORS_3D[room.type] || ROOM_COLORS_3D.default;
          return (
            <div key={room.id} className="flex items-center gap-1 text-xs">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: colors.wall }}
              />
              <span className="text-slate-600">{room.type}</span>
            </div>
          );
        })}
        <span className="text-xs text-slate-400 ml-1">(Vue isométrique simplifiée)</span>
      </div>
    </div>
  );
}
