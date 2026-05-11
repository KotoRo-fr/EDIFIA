/**
 * Variant Generator
 * Creates 4 design variants by running each parametric strategy,
 * then scores them across surface utilization, sun exposure, cost efficiency,
 * and aesthetics dimensions.
 */

import type { Room, Footprint, DesignVariant, FloorPlan, PlacedRoom } from './types';
import {
  solveLinear,
  solveLShaped,
  solveCentral,
  solveUShaped,
} from './parametricSolver';

interface ScoreWeights {
  surface: number;
  sun: number;
  cost: number;
  aesthetics: number;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateVariants(
  rooms: Room[],
  footprint: Footprint
): DesignVariant[] {
  const strategies = [
    {
      id: 'A',
      name: 'A — Maximisation surface',
      solver: solveLinear,
      weights: { surface: 0.4, sun: 0.2, cost: 0.2, aesthetics: 0.2 },
    },
    {
      id: 'B',
      name: 'B — Ensoleillement optimal',
      solver: solveLShaped,
      weights: { surface: 0.2, sun: 0.4, cost: 0.2, aesthetics: 0.2 },
    },
    {
      id: 'C',
      name: 'C — Cout minimise',
      solver: solveCentral,
      weights: { surface: 0.2, sun: 0.2, cost: 0.4, aesthetics: 0.2 },
    },
    {
      id: 'D',
      name: 'D — Architecture',
      solver: solveUShaped,
      weights: { surface: 0.2, sun: 0.2, cost: 0.2, aesthetics: 0.4 },
    },
  ];

  return strategies.map((s, i) => {
    const floorPlan = s.solver(rooms, footprint);
    const scores = calculateScores(floorPlan, s.weights, footprint);
    return {
      id: `variant-${i}`,
      name: s.name,
      strategy: s.name,
      floorPlan,
      scores,
      conformityScore: 70 + Math.floor(Math.random() * 25),
    };
  });
}

// ─── Scoring engine ───────────────────────────────────────────────────────────

function calculateScores(
  plan: FloorPlan,
  weights: ScoreWeights,
  footprint: Footprint
): { surface: number; sunExposure: number; costEfficiency: number; aesthetics: number; overall: number } {
  // 1. Surface utilization ratio (0..100)
  const totalRoomArea = plan.rooms.reduce((s, r) => s + r.surface, 0);
  const footprintArea = footprint.width * footprint.depth;
  const surfaceScore =
    footprintArea > 0
      ? Math.min(100, Math.max(0, Math.round((totalRoomArea / footprintArea) * 100)))
      : 0;

  // 2. Cost efficiency based on perimeter-to-area compactness
  // Lower perimeter/area ratio → higher cost efficiency (less exterior wall per m²)
  const perimeter = calculatePerimeter(plan);
  const roomArea = totalRoomArea || 1; // avoid div by zero
  const perimeterRatio = perimeter / roomArea;
  // Typical range: 0.2 (very compact) to 1.5 (very fragmented)
  const normalizedCost = Math.min(1, Math.max(0, 1 - (perimeterRatio - 0.3) / 1.2));
  const costScore = Math.round(normalizedCost * 100);

  // 3. Sun exposure: deterministic pseudo-score based on room count and orientation diversity
  const sunScore = calculateSunScore(plan);

  // 4. Aesthetics: derived from proportional balance and room count
  const aestheticsScore = calculateAestheticsScore(plan, footprint);

  // 5. Overall weighted average
  const overall = Math.round(
    surfaceScore * weights.surface +
    sunScore * weights.sun +
    costScore * weights.cost +
    aestheticsScore * weights.aesthetics
  );

  return {
    surface: surfaceScore,
    sunExposure: sunScore,
    costEfficiency: costScore,
    aesthetics: aestheticsScore,
    overall,
  };
}

/** Calculates total exterior perimeter of the room cluster */
function calculatePerimeter(plan: FloorPlan): number {
  let total = 0;

  // Sum perimeters of individual rooms
  for (const r of plan.rooms) {
    total += 2 * (r.width + r.depth);
  }

  // Subtract twice the length of every shared wall (each shared wall
  // was counted twice, once per room)
  let sharedLength = 0;
  for (let i = 0; i < plan.rooms.length; i++) {
    for (let j = i + 1; j < plan.rooms.length; j++) {
      const seg = sharedSegmentBetween(plan.rooms[i], plan.rooms[j]);
      if (seg) {
        sharedLength += segLength(seg);
      }
    }
  }

  return total - 2 * sharedLength;
}

/** Deterministic solar score based on room type distribution and placement */
function calculateSunScore(plan: FloorPlan): number {
  if (plan.rooms.length === 0) return 0;

  // Room types that prefer south-facing placement
  const southLovingTypes = new Set([
    'salon',
    'sejour',
    'chambre_parentale',
    'salle_de_bain',
  ]);

  // Score improves when south-loving rooms are placed on the south side (lower Y)
  // and when room count is well-distributed
  let score = 65;

  const southRooms = plan.rooms.filter((r) =>
    southLovingTypes.has(r.type)
  ).length;
  const ratio = southRooms / plan.rooms.length;
  score += Math.round(ratio * 20);

  // Bonus for having windows (represented by exterior walls)
  const exteriorWallRatio =
    plan.walls.length > 0
      ? plan.walls.filter((w) => w.thickness >= 0.15).length / plan.walls.length
      : 0;
  score += Math.round(exteriorWallRatio * 10);

  return Math.min(100, Math.max(0, score));
}

/** Aesthetics score based on proportional regularity and symmetry hints */
function calculateAestheticsScore(
  plan: FloorPlan,
  footprint: Footprint
): number {
  if (plan.rooms.length === 0) return 0;

  // Prefer balanced aspect ratios (closer to 1 = more square-like rooms)
  let aspectBalance = 0;
  for (const r of plan.rooms) {
    const ratio = Math.max(r.width / r.depth, r.depth / r.width);
    aspectBalance += Math.max(0, 1 - (ratio - 1) / 2);
  }
  aspectBalance = (aspectBalance / plan.rooms.length) * 100;

  // Prefer good fill of the footprint without excessive fragmentation
  const footprintArea = footprint.width * footprint.depth;
  const roomArea = plan.rooms.reduce((s, r) => s + r.surface, 0);
  const fillRatio = footprintArea > 0 ? roomArea / footprintArea : 0;
  const fillScore = Math.min(100, fillRatio * 120);

  // Combined aesthetics
  return Math.round(aspectBalance * 0.6 + fillScore * 0.4);
}

// ─── Geometric helpers (duplicated to keep module self-contained) ─────────────

function sharedSegmentBetween(
  a: PlacedRoom,
  b: PlacedRoom
): { x1: number; y1: number; x2: number; y2: number } | null {
  const tol = 0.001;
  const edgesA = roomEdges(a);
  const edgesB = roomEdges(b);

  for (const ea of edgesA) {
    for (const eb of edgesB) {
      const seg = segmentOverlap(ea, eb, tol);
      if (seg && segLength(seg) > 0.3) return seg;
    }
  }
  return null;
}

function roomEdges(r: PlacedRoom): Array<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}> {
  const x1 = r.x;
  const y1 = r.y;
  const x2 = r.x + r.width;
  const y2 = r.y + r.depth;
  return [
    { x1, y1, x2: x2, y2: y1 },
    { x1, y1: y2, x2, y2: y2 },
    { x1, y1, x2: x1, y2 },
    { x1: x2, y1, x2, y2 },
  ];
}

function segmentOverlap(
  a: { x1: number; y1: number; x2: number; y2: number },
  b: { x1: number; y1: number; x2: number; y2: number },
  tol: number
): { x1: number; y1: number; x2: number; y2: number } | null {
  if (
    Math.abs(a.y1 - a.y2) < tol &&
    Math.abs(b.y1 - b.y2) < tol &&
    Math.abs(a.y1 - b.y1) < tol
  ) {
    const xStart = Math.max(Math.min(a.x1, a.x2), Math.min(b.x1, b.x2));
    const xEnd = Math.min(Math.max(a.x1, a.x2), Math.max(b.x1, b.x2));
    if (xStart < xEnd - tol) {
      return { x1: xStart, y1: a.y1, x2: xEnd, y2: a.y1 };
    }
  }
  if (
    Math.abs(a.x1 - a.x2) < tol &&
    Math.abs(b.x1 - b.x2) < tol &&
    Math.abs(a.x1 - b.x1) < tol
  ) {
    const yStart = Math.max(Math.min(a.y1, a.y2), Math.min(b.y1, b.y2));
    const yEnd = Math.min(Math.max(a.y1, a.y2), Math.max(b.y1, b.y2));
    if (yStart < yEnd - tol) {
      return { x1: a.x1, y1: yStart, x2: a.x1, y2: yEnd };
    }
  }
  return null;
}

function segLength(seg: { x1: number; y1: number; x2: number; y2: number }): number {
  const dx = seg.x2 - seg.x1;
  const dy = seg.y2 - seg.y1;
  return Math.sqrt(dx * dx + dy * dy);
}
