import { useMemo } from 'react';
import type { Variant, Footprint } from '@/types/solver';

interface Plan2DViewerProps {
  variant?: Variant;
  footprint?: Footprint;
  width?: number;
  height?: number;
}

const ROOM_COLORS: Record<string, string> = {
  'Séjour': '#dbeafe',
  'Salon': '#dbeafe',
  'Cuisine': '#fef3c7',
  'Salle à manger': '#fce7f3',
  'Chambre': '#ede9fe',
  'Chambre 1': '#ede9fe',
  'Chambre 2': '#ddd6fe',
  'Salle de bain': '#cffafe',
  "Salle d'eau": '#cffafe',
  'Bureau': '#f3f4f6',
  'Dressing': '#fef9c3',
  'Rangement': '#f3f4f6',
  'Véranda': '#ecfdf5',
  'Studio': '#dbeafe',
  default: '#f3f4f6',
};

const ROOM_BORDER_COLORS: Record<string, string> = {
  'Séjour': '#3b82f6',
  'Salon': '#3b82f6',
  'Cuisine': '#f59e0b',
  'Salle à manger': '#ec4899',
  'Chambre': '#8b5cf6',
  'Chambre 1': '#8b5cf6',
  'Chambre 2': '#7c3aed',
  'Salle de bain': '#06b6d4',
  "Salle d'eau": '#06b6d4',
  'Bureau': '#6b7280',
  'Dressing': '#ca8a04',
  'Rangement': '#6b7280',
  'Véranda': '#10b981',
  'Studio': '#3b82f6',
  default: '#6b7280',
};

export default function Plan2DViewer({ variant, footprint, width = 600, height = 500 }: Plan2DViewerProps) {
  const { scale, offsetX, offsetY, rooms, fp } = useMemo(() => {
    const fp = variant?.footprint || footprint;
    if (!fp) return { scale: 1, offsetX: 0, offsetY: 0, rooms: [], fp: null };

    const padding = 40;
    const availableW = width - padding * 2;
    const availableH = height - padding * 2;

    const scaleX = availableW / fp.width;
    const scaleY = availableH / fp.depth;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (width - fp.width * scale) / 2;
    const offsetY = (height - fp.depth * scale) / 2;

    const rooms = variant?.rooms || [];

    return { scale, offsetX, offsetY, rooms, fp };
  }, [variant, footprint, width, height]);

  if (!fp) {
    return (
      <div
        className="flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200"
        style={{ width, height }}
      >
        <p className="text-sm text-slate-400">Aucun plan à afficher</p>
      </div>
    );
  }

  const parcelRect = {
    x: offsetX,
    y: offsetY,
    w: fp.width * scale,
    h: fp.depth * scale,
  };

  const buildableRect = {
    x: offsetX + fp.reculs.side * scale,
    y: offsetY + fp.reculs.front * scale,
    w: fp.buildableWidth * scale,
    h: fp.buildableDepth * scale,
  };

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', maxWidth: width, height }}
        className="bg-white rounded-lg border border-slate-200"
      >
        {/* Parcelle */}
        <rect
          x={parcelRect.x}
          y={parcelRect.y}
          width={parcelRect.w}
          height={parcelRect.h}
          fill="#f1f5f9"
          stroke="#94a3b8"
          strokeWidth={2}
          strokeDasharray="4 2"
        />
        <text x={parcelRect.x + 4} y={parcelRect.y + 14} fontSize={10} fill="#64748b">
          Parcelle
        </text>

        {/* Zone constructible */}
        <rect
          x={buildableRect.x}
          y={buildableRect.y}
          width={buildableRect.w}
          height={buildableRect.h}
          fill="#f0fdf4"
          stroke="#22c55e"
          strokeWidth={1.5}
        />

        {/* Pièces */}
        {rooms.map((room) => {
          const rx = offsetX + room.x * scale;
          const ry = offsetY + room.y * scale;
          const rw = room.width * scale;
          const rh = room.depth * scale;

          const color = ROOM_COLORS[room.type] || ROOM_COLORS.default;
          const borderColor = ROOM_BORDER_COLORS[room.type] || ROOM_BORDER_COLORS.default;

          return (
            <g key={room.id}>
              <rect
                x={rx}
                y={ry}
                width={rw}
                height={rh}
                fill={color}
                stroke={borderColor}
                strokeWidth={1.5}
                rx={2}
              />
              {rw > 40 && rh > 20 && (
                <>
                  <text
                    x={rx + rw / 2}
                    y={ry + rh / 2 - 4}
                    textAnchor="middle"
                    fontSize={Math.min(11, rw / 8)}
                    fill="#334155"
                    fontWeight={500}
                  >
                    {room.type}
                  </text>
                  <text
                    x={rx + rw / 2}
                    y={ry + rh / 2 + 10}
                    textAnchor="middle"
                    fontSize={Math.min(9, rw / 10)}
                    fill="#64748b"
                  >
                    {room.surface}m²
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Dimensions */}
        <line
          x1={parcelRect.x}
          y1={parcelRect.y + parcelRect.h + 8}
          x2={parcelRect.x + parcelRect.w}
          y2={parcelRect.y + parcelRect.h + 8}
          stroke="#64748b"
          strokeWidth={1}
        />
        <text
          x={parcelRect.x + parcelRect.w / 2}
          y={parcelRect.y + parcelRect.h + 20}
          textAnchor="middle"
          fontSize={9}
          fill="#64748b"
        >
          {fp.width}m
        </text>

        <line
          x1={parcelRect.x + parcelRect.w + 8}
          y1={parcelRect.y}
          x2={parcelRect.x + parcelRect.w + 8}
          y2={parcelRect.y + parcelRect.h}
          stroke="#64748b"
          strokeWidth={1}
        />
        <text
          x={parcelRect.x + parcelRect.w + 14}
          y={parcelRect.y + parcelRect.h / 2}
          fontSize={9}
          fill="#64748b"
          transform={`rotate(90, ${parcelRect.x + parcelRect.w + 14}, ${parcelRect.y + parcelRect.h / 2})`}
          textAnchor="middle"
        >
          {fp.depth}m
        </text>
      </svg>

      {/* Légende */}
      <div className="mt-2 flex flex-wrap gap-2">
        {rooms.slice(0, 6).map((room) => {
          const color = ROOM_COLORS[room.type] || ROOM_COLORS.default;
          const borderColor = ROOM_BORDER_COLORS[room.type] || ROOM_BORDER_COLORS.default;
          return (
            <div key={room.id} className="flex items-center gap-1 text-xs">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: color, border: `1px solid ${borderColor}` }}
              />
              <span className="text-slate-600">{room.type}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
