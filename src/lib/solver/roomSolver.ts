/**
 * Room Program Solver
 * Converts a list of room requirements into a structured architectural program
 * with adjacency analysis, solar recommendations, and budget estimation.
 */

import {
  Room,
  Program,
  AdjacencyEdge,
  SunRecommendation,
  BudgetEstimate,
} from './types';

// ─── Architectural Rules ──────────────────────────────────────────────────────

/** Encoded adjacency rules: which room types should be adjacent to which */
const ADJACENCY_RULES: Record<string, string[]> = {
  cuisine: ['salon', 'sejour'],
  chambre_parentale: ['salle_de_bain'],
  salle_de_bain: ['chambre_parentale', 'chambre'],
  wc: ['couloir', 'salle_de_bain'],
  entree: ['couloir'],
};

/** Solar exposure rules per room type (optimal, acceptable, avoid orientations) */
const SUN_RULES: Record<
  string,
  { optimal: string[]; acceptable: string[]; avoid: string[] }
> = {
  salon: { optimal: ['S', 'W'], acceptable: ['SE', 'SW'], avoid: ['N'] },
  sejour: { optimal: ['S', 'W'], acceptable: ['SE', 'SW'], avoid: ['N'] },
  chambre: { optimal: ['E'], acceptable: ['SE', 'NE'], avoid: ['W'] },
  chambre_parentale: { optimal: ['E', 'S'], acceptable: ['SE'], avoid: ['N'] },
  cuisine: { optimal: ['N', 'E'], acceptable: ['NE'], avoid: ['S', 'W'] },
  salle_de_bain: { optimal: ['S'], acceptable: ['SE', 'SW'], avoid: ['N'] },
  bureau: { optimal: ['N', 'E'], acceptable: ['NE', 'NW'], avoid: ['S'] },
};

/** Price lookup table: projectType_material → min/max €/m² */
const PRICE_PER_M2: Record<string, { min: number; max: number }> = {
  extension_under_40_bois: { min: 1800, max: 2500 },
  extension_under_40_traditionnelle: { min: 2200, max: 3200 },
  mob_under_150_bois: { min: 1600, max: 2400 },
  mob_under_150_traditionnelle: { min: 2000, max: 3000 },
};

// ─── Public API ───────────────────────────────────────────────────────────────

export interface RoomInput {
  type: string;
  surface: number;
  orientation?: string;
  priority: number;
}

/**
 * Solves a room program: converts raw requirements into a structured Program
 * with dimensions, adjacencies, solar analysis and budget.
 */
export function solveRoomProgram(
  rooms: RoomInput[],
  projectType: string,
  style: string
): Program {
  // 1. Convert each requirement into a Room with computed dimensions
  const solvedRooms: Room[] = rooms.map((r, i) => {
    const aspectRatio =
      r.type === 'salon' || r.type === 'sejour'
        ? 1.5
        : r.type === 'chambre' || r.type === 'chambre_parentale'
          ? 1.3
          : 1.0;
    const width = Math.sqrt(r.surface * aspectRatio);
    const depth = r.surface / width;

    return {
      id: `room-${i}`,
      type: r.type,
      name: formatRoomName(r.type, i),
      surface: r.surface,
      width: Math.round(width * 100) / 100,
      depth: Math.round(depth * 100) / 100,
      orientation: r.orientation as 'N' | 'S' | 'E' | 'W' | undefined,
      priority: r.priority,
      adjacencyRequired: ADJACENCY_RULES[r.type] || [],
    };
  });

  // 2. Sort by priority descending (most important first)
  solvedRooms.sort((a, b) => b.priority - a.priority);

  // 3. Generate adjacency graph from encoded rules
  const adjacencyGraph = generateAdjacencyGraph(solvedRooms);

  // 4. Solar orientation analysis per room
  const sunRecommendations = solvedRooms.map((r) => ({
    roomId: r.id,
    ...getSunRecommendation(r.type),
  }));

  // 5. Surface calculations
  const totalCHA = solvedRooms.reduce((sum, r) => sum + r.surface, 0);
  const totalCAO = totalCHA * 1.18; // +18% for circulations, walls, shafts
  const circulationArea = totalCAO - totalCHA;

  // 6. Budget estimation
  const budgetEstimate = estimateBudget(totalCHA, projectType, style);

  // Legacy-format adjacencies for existing page compatibility
  const adjacencies = adjacencyGraph.map((e) => ({
    roomA: e.from,
    roomB: e.to,
    type: e.relation === 'direct' ? ('direct' as const) : ('proximite' as const),
  }));

  const circulationRatio = totalCHA > 0 ? circulationArea / totalCHA : 0;

  return {
    rooms: solvedRooms,
    circulationArea: Math.round(circulationArea * 100) / 100,
    totalCAO: Math.round(totalCAO * 100) / 100,
    totalCHA,
    adjacencyGraph,
    sunRecommendations,
    budgetEstimate,
    // Legacy compatibility fields
    adjacencies,
    surfaces: {
      CAO: Math.round(totalCAO),
      CHA: Math.round(totalCHA * 1.12),
      circulation: Math.round(circulationArea),
      total: Math.round(totalCAO),
    },
    ratios: {
      CHA_CAO: Math.round(((totalCHA * 1.12) / totalCAO) * 100),
      circulation_ratio: Math.round(circulationRatio * 100),
    },
  };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Builds adjacency edges from encoded architectural rules */
function generateAdjacencyGraph(rooms: Room[]): AdjacencyEdge[] {
  const edges: AdjacencyEdge[] = [];
  for (const room of rooms) {
    for (const required of room.adjacencyRequired || []) {
      const target = rooms.find((r) => r.type === required);
      if (target) {
        edges.push({ from: room.id, to: target.id, relation: 'direct' });
      }
    }
  }
  return edges;
}

/** Retrieves solar recommendation for a given room type */
function getSunRecommendation(roomType: string): {
  optimal: string[];
  acceptable: string[];
  avoid: string[];
} {
  const rule = SUN_RULES[roomType];
  if (!rule) {
    return { optimal: ['S'], acceptable: ['E', 'W'], avoid: ['N'] };
  }
  return rule;
}

/** Estimates budget based on surface, project type and architectural style */
function estimateBudget(
  surfaceCHA: number,
  projectType: string,
  style: string
): BudgetEstimate {
  const material =
    style === 'contemporain' || style === 'moderne'
      ? 'bois'
      : 'traditionnelle';

  // Build lookup key from project type and material
  let key = `${projectType}_${material}`;
  let prices = PRICE_PER_M2[key];

  // Fallback to extension_under_40_traditionnelle if key not found
  if (!prices) {
    prices =
      PRICE_PER_M2['extension_under_40_traditionnelle'] || {
        min: 2200,
        max: 3200,
      };
  }

  return {
    min: Math.round(surfaceCHA * prices.min),
    max: Math.round(surfaceCHA * prices.max),
    avg: Math.round(surfaceCHA * ((prices.min + prices.max) / 2)),
    currency: 'EUR',
  };
}

/** Human-readable French name for a room type */
function formatRoomName(type: string, index: number): string {
  const names: Record<string, string> = {
    salon: 'Salon',
    sejour: 'Sejour',
    cuisine: 'Cuisine',
    chambre: `Chambre ${index}`,
    chambre_parentale: 'Chambre parentale',
    salle_de_bain: 'Salle de bain',
    wc: 'WC',
    bureau: 'Bureau',
    dressing: 'Dressing',
    buanderie: 'Buanderie',
  };
  return names[type] || type;
}
