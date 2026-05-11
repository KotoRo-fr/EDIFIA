export interface SolverRoom {
  id: string;
  type: string;
  surface: number;
  orientation?: string;
  priority: number;
}

export interface SolvedRoom extends SolverRoom {
  suggestedOrientation: string;
  optimalOrientation: string;
  acceptableOrientations: string[];
  avoidOrientations: string[];
  priorityScore: number;
}

export interface Adjacency {
  roomA: string;
  roomB: string;
  type: 'direct' | 'proximite';
}

export interface RoomProgram {
  rooms: SolvedRoom[];
  adjacencies: Adjacency[];
  surfaces: {
    CAO: number;  // Surface Close et Ouverte
    CHA: number;  // Surface CHArgeable
    circulation: number;
    total: number;
  };
  ratios: {
    CHA_CAO: number;
    circulation_ratio: number;
  };
}

export interface Recul {
  front: number;
  side: number;
  rear: number;
}

export interface Footprint {
  width: number;
  depth: number;
  surface: number;
  cos: number;
  heightMax: number;
  reculs: Recul;
  buildableWidth: number;
  buildableDepth: number;
}

export interface VariantRoom {
  id: string;
  type: string;
  surface: number;
  x: number;
  y: number;
  width: number;
  depth: number;
}

export interface Variant {
  id: string;
  name: string;
  description: string;
  rooms: VariantRoom[];
  footprint: Footprint;
  scores: {
    surface: number;
    ensoleillement: number;
    cout: number;
    esthetique: number;
    total: number;
  };
  conformite: {
    score: number;
    checks: { label: string; pass: boolean }[];
  };
  isSelected?: boolean;
}

export interface SunAnalysis {
  roomId: string;
  roomType: string;
  optimal: string;
  acceptable: string[];
  avoid: string[];
  score: number;
}

export interface BudgetEstimate {
  min: number;
  avg: number;
  max: number;
  pricePerM2: number;
  currency: string;
}
