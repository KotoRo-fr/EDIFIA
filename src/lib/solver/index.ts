/**
 * Spatial Programming & Generative Design Solver
 * Pure TypeScript engine for architectural room layout generation.
 *
 * Exported modules:
 * - types        : Core data structures (Room, Footprint, FloorPlan, ...)
 * - roomSolver   : Program solving from requirements (adjacency, sun, budget)
 * - footprintGenerator : Buildable envelope calculator (COS, setbacks)
 * - parametricSolver   : 4 deterministic 2D placement strategies
 * - variantGenerator   : Multi-strategy variant scoring and ranking
 */

// ─── New engine exports ───────────────────────────────────────────────────────

export * from './types';
export * from './roomSolver';
export * from './footprintGenerator';
export * from './parametricSolver';
export * from './variantGenerator';

// ─── Legacy compatibility wrappers ─────────────────────────────────────────────

import type { Program, SunRecommendation, BudgetEstimate } from './types';

/** Legacy sun-analysis wrapper (returns format expected by ProgrammingPage) */
export function analyzeSunExposure(program: Program): Array<{
  roomId: string;
  roomType: string;
  optimal: string;
  acceptable: string[];
  avoid: string[];
  score: number;
}> {
  return (program.sunRecommendations || []).map((sr: SunRecommendation) => ({
    roomId: sr.roomId,
    roomType: sr.roomId,
    optimal: sr.optimal.join(', ') || 'Sud',
    acceptable: sr.acceptable,
    avoid: sr.avoid,
    score: sr.optimal.includes('S') ? 100 : sr.acceptable.includes('S') ? 70 : 40,
  }));
}

/** Legacy budget wrapper (2-argument signature expected by ProgrammingPage) */
export function estimateBudget(
  totalSurface: number,
  projectType: string
): BudgetEstimate & { pricePerM2: number } {
  const style: string = 'moderne';
  const material =
    style === 'contemporain' || style === 'moderne' ? 'bois' : 'traditionnelle';

  const PRICE_PER_M2: Record<string, { min: number; max: number }> = {
    extension_under_40_bois: { min: 1800, max: 2500 },
    extension_under_40_traditionnelle: { min: 2200, max: 3200 },
    mob_under_150_bois: { min: 1600, max: 2400 },
    mob_under_150_traditionnelle: { min: 2000, max: 3000 },
  };

  const key = `${projectType}_${material}`;
  const prices = PRICE_PER_M2[key] || PRICE_PER_M2['extension_under_40_traditionnelle'] || { min: 2200, max: 3200 };
  const avg = (prices.min + prices.max) / 2;

  return {
    min: Math.round(totalSurface * prices.min),
    avg: Math.round(totalSurface * avg),
    max: Math.round(totalSurface * prices.max),
    pricePerM2: Math.round(avg),
    currency: 'EUR',
  };
}


