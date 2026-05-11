/**
 * Core types for the spatial programming and generative design solver.
 * All geometric coordinates are in meters unless otherwise specified.
 */

/** Represents a room requirement before placement */
export interface Room {
  id: string;
  type: string;
  name: string;
  surface: number;
  width: number;
  depth: number;
  orientation?: 'N' | 'S' | 'E' | 'W';
  priority: number;
  adjacencyRequired?: string[];
}

/** Complete architectural program output from the room solver */
export interface Program {
  rooms: Room[];
  circulationArea: number;
  totalCAO: number;
  totalCHA: number;
  adjacencyGraph: AdjacencyEdge[];
  sunRecommendations: SunRecommendation[];
  budgetEstimate: BudgetEstimate;
  // ─── Legacy compatibility (used by existing pages) ─────────────────────────
  surfaces?: { CAO: number; CHA: number; circulation: number; total: number };
  ratios?: { CHA_CAO: number; circulation_ratio: number };
  adjacencies?: Array<{ roomA: string; roomB: string; type: 'direct' | 'proximite' }>;
}

/** Directed edge in the adjacency graph between two rooms */
export interface AdjacencyEdge {
  from: string;
  to: string;
  relation: 'direct' | 'proximity';
}

/** Solar exposure recommendation for a specific room */
export interface SunRecommendation {
  roomId: string;
  optimal: string[];
  acceptable: string[];
  avoid: string[];
}

/** Budget estimate for the architectural program */
export interface BudgetEstimate {
  min: number;
  max: number;
  avg: number;
  currency: string;
}

/** Buildable footprint envelope on the parcel */
export interface Footprint {
  x: number;
  y: number;
  width: number;
  depth: number;
  maxHeight: number;
  // ─── Legacy compatibility (used by existing pages) ─────────────────────────
  surface?: number;
  cos?: number;
  reculs?: { front: number; side: number; rear: number };
  buildableWidth?: number;
  buildableDepth?: number;
}

/** Complete floor plan with placed rooms and architectural elements */
export interface FloorPlan {
  rooms: PlacedRoom[];
  walls: Wall[];
  doors: Door[];
  circulationPaths: Point[][];
}

/** A room that has been positioned within the floor plan envelope */
export interface PlacedRoom extends Room {
  x: number;
  y: number;
  rotation: number;
  wallThickness: number;
}

/** A wall segment (exterior or interior partition) */
export interface Wall {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
}

/** A door connecting two adjacent rooms */
export interface Door {
  x: number;
  y: number;
  width: number;
  orientation: 'N' | 'S' | 'E' | 'W';
  connects: string[];
}

/** 2D geometric point */
export interface Point {
  x: number;
  y: number;
}

/** A generated design variant with its performance scores */
export interface DesignVariant {
  id: string;
  name: string;
  strategy: string;
  floorPlan: FloorPlan;
  scores: VariantScores;
  conformityScore: number;
}

/** Weighted performance scores for a design variant */
export interface VariantScores {
  surface: number;
  sunExposure: number;
  costEfficiency: number;
  aesthetics: number;
  overall: number;
}
