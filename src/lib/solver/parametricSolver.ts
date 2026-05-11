/**
 * Parametric Spatial Solver
 * 4 deterministic placement strategies for architectural room layout.
 * All coordinates are in meters. Origin (0,0) is bottom-left of the footprint.
 */

import type {
  Room,
  Footprint,
  PlacedRoom,
  FloorPlan,
  Wall,
  Door,
  Point,
} from './types';

// ─── Constants ────────────────────────────────────────────────────────────────

const GAP = 0.1; // 10 cm gap between rooms (partitions)
const WALL_THICKNESS = 0.15; // 15 cm structural wall thickness
const DOOR_WIDTH = 0.9; // 90 cm standard door width
// MIN_CIRCULATION = 0.9; // 90 cm minimum circulation width (reserved)

// ─── Public Strategy API ──────────────────────────────────────────────────────

export function solveLinear(rooms: Room[], footprint: Footprint): FloorPlan {
  return buildFloorPlan(executeShelfPacking(rooms, footprint), footprint);
}

export function solveLShaped(rooms: Room[], footprint: Footprint): FloorPlan {
  const sorted = sortRoomsByArea(rooms);
  if (sorted.length === 0) return emptyFloorPlan();

  const placed: PlacedRoom[] = [];

  // L-geometry parameters
  const armHDepth = Math.min(
    footprint.depth * 0.55,
    sorted[0].depth + GAP * 2
  );
  const armVWidth = Math.min(
    footprint.width * 0.45,
    sorted[0].width + GAP * 2
  );

  // Zone definitions
  const cornerZone = {
    x: GAP,
    y: GAP,
    w: armVWidth - GAP,
    h: armHDepth - GAP,
  };
  const hArmZone = {
    x: armVWidth,
    y: GAP,
    w: footprint.width - armVWidth - GAP,
    h: armHDepth - GAP,
  };
  const vArmZone = {
    x: GAP,
    y: armHDepth,
    w: armVWidth - GAP,
    h: footprint.depth - armHDepth - GAP,
  };
  const remainingZone = {
    x: armVWidth,
    y: armHDepth,
    w: footprint.width - armVWidth - GAP,
    h: footprint.depth - armHDepth - GAP,
  };

  // Place main room in the corner
  const main = placeRoomInZone(sorted[0], cornerZone, placed);
  if (main) placed.push(main);

  // Distribute remaining rooms across the three arms
  const hArmRooms: Room[] = [];
  const vArmRooms: Room[] = [];
  const remRooms: Room[] = [];

  sorted.slice(1).forEach((r, i) => {
    if (i % 3 === 0) hArmRooms.push(r);
    else if (i % 3 === 1) vArmRooms.push(r);
    else remRooms.push(r);
  });

  // Horizontal arm (bottom-right)
  let cursorX = hArmZone.x;
  for (const r of sortRoomsByDepth(hArmRooms)) {
    const candidate: Zone = {
      x: cursorX,
      y: hArmZone.y,
      w: r.width,
      h: hArmZone.h,
    };
    const p = placeRoomInZone(r, candidate, placed);
    if (p) {
      placed.push(p);
      cursorX += r.width + GAP;
    }
  }

  // Vertical arm (top-left)
  let cursorY = vArmZone.y;
  for (const r of sortRoomsByWidth(vArmRooms)) {
    const candidate: Zone = {
      x: vArmZone.x,
      y: cursorY,
      w: vArmZone.w,
      h: r.depth,
    };
    const p = placeRoomInZone(r, candidate, placed);
    if (p) {
      placed.push(p);
      cursorY += r.depth + GAP;
    }
  }

  // Remaining zone (top-right)
  const packed = executeShelfPacking(remRooms, {
    ...footprint,
    width: remainingZone.w,
    depth: remainingZone.h,
  });
  // Offset packed rooms into the remaining zone
  for (const p of packed) {
    placed.push({
      ...p,
      x: p.x + remainingZone.x,
      y: p.y + remainingZone.y,
    });
  }

  return buildFloorPlan(placed, footprint);
}

export function solveCentral(rooms: Room[], footprint: Footprint): FloorPlan {
  const sorted = sortRoomsByArea(rooms);
  if (sorted.length === 0) return emptyFloorPlan();

  const placed: PlacedRoom[] = [];

  // Main room at center
  const main = sorted[0];
  const mainX = (footprint.width - main.width) / 2;
  const mainY = (footprint.depth - main.depth) / 2;
  const mainPlaced: PlacedRoom = {
    ...main,
    x: Math.round(mainX * 100) / 100,
    y: Math.round(mainY * 100) / 100,
    rotation: 0,
    wallThickness: WALL_THICKNESS,
  };
  placed.push(mainPlaced);

  // Place surrounding rooms on 4 sides
  const remaining = sorted.slice(1);
  const sides: Array<'north' | 'south' | 'east' | 'west'> = [
    'south',
    'north',
    'east',
    'west',
  ];

  remaining.forEach((r, i) => {
    const side = sides[i % 4];
    const pos = computeSidePosition(
      r,
      mainPlaced,
      side,
      footprint,
      placed
    );
    if (pos) placed.push(pos);
  });

  // Try to place any remaining unplaced rooms via shelf packing in free areas
  const placedIds = new Set(placed.map((p) => p.id));
  const unplaced = remaining.filter((r) => !placedIds.has(r.id));
  if (unplaced.length > 0) {
    const extra = executeShelfPacking(unplaced, footprint);
    for (const e of extra) {
      if (!hasCollision(e, placed)) {
        placed.push(e);
      } else {
        // Nudge until no collision
        const nudged = findFreePosition(e, footprint, placed);
        if (nudged) placed.push(nudged);
      }
    }
  }

  return buildFloorPlan(placed, footprint);
}

export function solveUShaped(rooms: Room[], footprint: Footprint): FloorPlan {
  const sorted = sortRoomsByArea(rooms);
  if (sorted.length === 0) return emptyFloorPlan();

  const placed: PlacedRoom[] = [];

  // U-wing dimensions
  const bottomDepth = Math.min(footprint.depth * 0.35, sorted[0].depth + GAP * 3);
  const sideWidth = Math.min(footprint.width * 0.28, sorted[0].width + GAP * 3);
  const wingHeight = footprint.depth - bottomDepth;

  // Three wing zones
  const bottomZone: Zone = {
    x: GAP,
    y: GAP,
    w: footprint.width - GAP * 2,
    h: bottomDepth - GAP,
  };
  const leftZone: Zone = {
    x: GAP,
    y: bottomDepth,
    w: sideWidth - GAP * 2,
    h: wingHeight - GAP,
  };
  const rightZone: Zone = {
    x: footprint.width - sideWidth + GAP,
    y: bottomDepth,
    w: sideWidth - GAP * 2,
    h: wingHeight - GAP,
  };

  // Distribute rooms into 3 groups
  const bottomRooms: Room[] = [];
  const leftRooms: Room[] = [];
  const rightRooms: Room[] = [];

  sorted.forEach((r, i) => {
    if (i === 0) bottomRooms.push(r); // largest on bottom wing
    else if (i % 3 === 1) leftRooms.push(r);
    else if (i % 3 === 2) rightRooms.push(r);
    else bottomRooms.push(r);
  });

  // Bottom wing: horizontal shelf
  let cursorX = bottomZone.x;
  for (const r of sortRoomsByDepth(bottomRooms)) {
    const z: Zone = {
      x: cursorX,
      y: bottomZone.y,
      w: r.width,
      h: bottomZone.h,
    };
    const p = placeRoomInZone(r, z, placed);
    if (p) {
      placed.push(p);
      cursorX += r.width + GAP;
    }
  }

  // Left wing: vertical shelf (bottom to top)
  let cursorY = leftZone.y;
  for (const r of sortRoomsByWidth(leftRooms)) {
    const z: Zone = {
      x: leftZone.x,
      y: cursorY,
      w: leftZone.w,
      h: r.depth,
    };
    const p = placeRoomInZone(r, z, placed);
    if (p) {
      placed.push(p);
      cursorY += r.depth + GAP;
    }
  }

  // Right wing: vertical shelf (bottom to top)
  cursorY = rightZone.y;
  for (const r of sortRoomsByWidth(rightRooms)) {
    const z: Zone = {
      x: rightZone.x,
      y: cursorY,
      w: rightZone.w,
      h: r.depth,
    };
    const p = placeRoomInZone(r, z, placed);
    if (p) {
      placed.push(p);
      cursorY += r.depth + GAP;
    }
  }

  return buildFloorPlan(placed, footprint);
}

// ─── Packing primitives ───────────────────────────────────────────────────────

interface Zone {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Shelf packing: arranges rooms in horizontal rows within the footprint */
function executeShelfPacking(
  rooms: Room[],
  footprint: Footprint
): PlacedRoom[] {
  const sorted = sortRoomsByDepth([...rooms]);
  const placed: PlacedRoom[] = [];

  let cursorX = GAP;
  let cursorY = GAP;
  let rowHeight = 0;
  const maxW = footprint.width - GAP;
  const maxH = footprint.depth - GAP;

  for (const room of sorted) {
    // Start new row if current room doesn't fit horizontally
    if (cursorX + room.width > maxW && placed.length > 0) {
      cursorX = GAP;
      cursorY += rowHeight + GAP;
      rowHeight = 0;
    }

    // If we overflow vertically, try compact placement anyway
    if (cursorY + room.depth > maxH) {
      // Fallback: try to fit anywhere using free-position search
      const fallback = createPlacedRoom(room, cursorX, cursorY);
      const freePos = findFreePosition(fallback, footprint, placed);
      if (freePos) {
        placed.push(freePos);
        continue;
      }
    }

    const p = createPlacedRoom(room, cursorX, cursorY);
    placed.push(p);
    cursorX += room.width + GAP;
    rowHeight = Math.max(rowHeight, room.depth);
  }

  return placed;
}

// ─── Placement helpers ────────────────────────────────────────────────────────

function createPlacedRoom(room: Room, x: number, y: number): PlacedRoom {
  return {
    ...room,
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
    rotation: 0,
    wallThickness: WALL_THICKNESS,
  };
}

function placeRoomInZone(
  room: Room,
  zone: Zone,
  existing: PlacedRoom[]
): PlacedRoom | null {
  if (room.width > zone.w || room.depth > zone.h) return null;
  const p = createPlacedRoom(room, zone.x, zone.y);
  if (hasCollision(p, existing)) return null;
  return p;
}

function computeSidePosition(
  room: Room,
  main: PlacedRoom,
  side: 'north' | 'south' | 'east' | 'west',
  footprint: Footprint,
  existing: PlacedRoom[]
): PlacedRoom | null {
  let x = 0;
  let y = 0;

  switch (side) {
    case 'south':
      x = main.x + (main.width - room.width) / 2;
      y = Math.max(0, main.y - room.depth - GAP);
      break;
    case 'north':
      x = main.x + (main.width - room.width) / 2;
      y = main.y + main.depth + GAP;
      break;
    case 'east':
      x = main.x + main.width + GAP;
      y = main.y + (main.depth - room.depth) / 2;
      break;
    case 'west':
      x = Math.max(0, main.x - room.width - GAP);
      y = main.y + (main.depth - room.depth) / 2;
      break;
  }

  x = Math.round(x * 100) / 100;
  y = Math.round(y * 100) / 100;

  const candidate = createPlacedRoom(room, x, y);

  // Must be inside footprint
  if (
    candidate.x < 0 ||
    candidate.y < 0 ||
    candidate.x + candidate.width > footprint.width ||
    candidate.y + candidate.depth > footprint.depth
  ) {
    return null;
  }

  if (hasCollision(candidate, existing)) return null;
  return candidate;
}

function findFreePosition(
  room: PlacedRoom,
  footprint: Footprint,
  existing: PlacedRoom[]
): PlacedRoom | null {
  // Grid-based search for a collision-free position
  const step = Math.max(room.width, room.depth) / 2;
  for (let y = GAP; y + room.depth <= footprint.depth - GAP; y += step) {
    for (let x = GAP; x + room.width <= footprint.width - GAP; x += step) {
      const candidate = createPlacedRoom(room, x, y);
      if (!hasCollision(candidate, existing)) return candidate;
    }
  }
  return null;
}

// ─── Collision & geometry ─────────────────────────────────────────────────────

function hasCollision(room: PlacedRoom, others: PlacedRoom[]): boolean {
  for (const o of others) {
    if (rectsOverlap(room, o)) return true;
  }
  return false;
}

function rectsOverlap(a: PlacedRoom, b: PlacedRoom): boolean {
  return (
    a.x < b.x + b.width + GAP &&
    a.x + a.width + GAP > b.x &&
    a.y < b.y + b.depth + GAP &&
    a.y + a.depth + GAP > b.y
  );
}

function isInsideEnvelope(
  room: PlacedRoom,
  footprint: Footprint
): boolean {
  return (
    room.x >= 0 &&
    room.y >= 0 &&
    room.x + room.width <= footprint.width &&
    room.y + room.depth <= footprint.depth
  );
}

function sortRoomsByArea(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => b.surface - a.surface);
}

function sortRoomsByDepth(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => b.depth - a.depth);
}

function sortRoomsByWidth(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => b.width - a.width);
}

// ─── FloorPlan assembly ───────────────────────────────────────────────────────

function emptyFloorPlan(): FloorPlan {
  return { rooms: [], walls: [], doors: [], circulationPaths: [] };
}

function buildFloorPlan(
  placed: PlacedRoom[],
  footprint: Footprint
): FloorPlan {
  // Filter out rooms that fell outside the envelope
  const validRooms = placed.filter((r) => isInsideEnvelope(r, footprint));

  const walls = generateWallsFromRooms(validRooms, footprint);
  const doors = generateDoors(validRooms);
  const circulationPaths = generateCirculationPaths(validRooms);

  return {
    rooms: validRooms,
    walls,
    doors,
    circulationPaths,
  };
}

// ─── Wall generation ──────────────────────────────────────────────────────────

interface RawEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  ownerId: string;
}

/** Normalized edge key for deduplication (order-independent) */
function edgeKey(e: RawEdge): string {
  const a = `${e.x1.toFixed(3)},${e.y1.toFixed(3)}`;
  const b = `${e.x2.toFixed(3)},${e.y2.toFixed(3)}`;
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

function generateWallsFromRooms(rooms: PlacedRoom[], footprint: Footprint): Wall[] {
  // 1. Collect all edges from all room perimeters
  const edges: RawEdge[] = [];
  for (const r of rooms) {
    const x1 = r.x;
    const y1 = r.y;
    const x2 = r.x + r.width;
    const y2 = r.y + r.depth;
    // Bottom
    edges.push({ x1, y1, x2: x2, y2: y1, ownerId: r.id });
    // Top
    edges.push({ x1, y1: y2, x2, y2: y2, ownerId: r.id });
    // Left
    edges.push({ x1, y1, x2: x1, y2, ownerId: r.id });
    // Right
    edges.push({ x1: x2, y1, x2, y2, ownerId: r.id });
  }

  // 2. Deduplicate: edges appearing twice are shared walls (partitions)
  // edges appearing once are exterior walls
  const counts = new Map<string, number>();
  const edgeMap = new Map<string, RawEdge>();
  for (const e of edges) {
    const k = edgeKey(e);
    counts.set(k, (counts.get(k) || 0) + 1);
    edgeMap.set(k, e);
  }

  // 3. Build Wall objects
  const walls: Wall[] = [];
  for (const [k, count] of counts.entries()) {
    const e = edgeMap.get(k)!;
    walls.push({
      x1: Math.round(e.x1 * 1000) / 1000,
      y1: Math.round(e.y1 * 1000) / 1000,
      x2: Math.round(e.x2 * 1000) / 1000,
      y2: Math.round(e.y2 * 1000) / 1000,
      thickness: count >= 2 ? 0.1 : WALL_THICKNESS,
    });
  }

  // 4. Add footprint boundary walls (envelope perimeter)
  // These represent the outer shell even if no room touches them
  walls.push(
    { x1: 0, y1: 0, x2: footprint.width, y2: 0, thickness: WALL_THICKNESS },
    {
      x1: 0,
      y1: footprint.depth,
      x2: footprint.width,
      y2: footprint.depth,
      thickness: WALL_THICKNESS,
    },
    { x1: 0, y1: 0, x2: 0, y2: footprint.depth, thickness: WALL_THICKNESS },
    {
      x1: footprint.width,
      y1: 0,
      x2: footprint.width,
      y2: footprint.depth,
      thickness: WALL_THICKNESS,
    }
  );

  return walls;
}

// ─── Door generation ──────────────────────────────────────────────────────────

function generateDoors(rooms: PlacedRoom[]): Door[] {
  const doors: Door[] = [];

  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const a = rooms[i];
      const b = rooms[j];
      const shared = findSharedSegment(a, b);
      if (shared) {
        const cx = (shared.x1 + shared.x2) / 2;
        const cy = (shared.y1 + shared.y2) / 2;
        const orientation = doorOrientation(shared);
        doors.push({
          x: Math.round(cx * 1000) / 1000,
          y: Math.round(cy * 1000) / 1000,
          width: DOOR_WIDTH,
          orientation,
          connects: [a.id, b.id],
        });
      }
    }
  }

  return doors;
}

function findSharedSegment(
  a: PlacedRoom,
  b: PlacedRoom
): { x1: number; y1: number; x2: number; y2: number } | null {
  const tol = 0.001;

  // All edges of a
  const edgesA = getEdges(a);
  const edgesB = getEdges(b);

  for (const ea of edgesA) {
    for (const eb of edgesB) {
      const seg = segmentOverlap(ea, eb, tol);
      if (seg && segmentLength(seg) > DOOR_WIDTH) {
        return seg;
      }
    }
  }
  return null;
}

function getEdges(r: PlacedRoom): Array<{ x1: number; y1: number; x2: number; y2: number }> {
  const x1 = r.x;
  const y1 = r.y;
  const x2 = r.x + r.width;
  const y2 = r.y + r.depth;
  return [
    { x1, y1, x2: x2, y2: y1 }, // bottom
    { x1, y1: y2, x2, y2: y2 }, // top
    { x1, y1, x2: x1, y2 }, // left
    { x1: x2, y1, x2, y2 }, // right
  ];
}

function segmentOverlap(
  a: { x1: number; y1: number; x2: number; y2: number },
  b: { x1: number; y1: number; x2: number; y2: number },
  tol: number
): { x1: number; y1: number; x2: number; y2: number } | null {
  // Check if segments are colinear and overlapping
  // Case: horizontal segments
  if (Math.abs(a.y1 - a.y2) < tol && Math.abs(b.y1 - b.y2) < tol && Math.abs(a.y1 - b.y1) < tol) {
    const xStart = Math.max(Math.min(a.x1, a.x2), Math.min(b.x1, b.x2));
    const xEnd = Math.min(Math.max(a.x1, a.x2), Math.max(b.x1, b.x2));
    if (xStart < xEnd - tol) {
      return { x1: xStart, y1: a.y1, x2: xEnd, y2: a.y1 };
    }
  }
  // Case: vertical segments
  if (Math.abs(a.x1 - a.x2) < tol && Math.abs(b.x1 - b.x2) < tol && Math.abs(a.x1 - b.x1) < tol) {
    const yStart = Math.max(Math.min(a.y1, a.y2), Math.min(b.y1, b.y2));
    const yEnd = Math.min(Math.max(a.y1, a.y2), Math.max(b.y1, b.y2));
    if (yStart < yEnd - tol) {
      return { x1: a.x1, y1: yStart, x2: a.x1, y2: yEnd };
    }
  }
  return null;
}

function segmentLength(seg: { x1: number; y1: number; x2: number; y2: number }): number {
  const dx = seg.x2 - seg.x1;
  const dy = seg.y2 - seg.y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function doorOrientation(
  seg: { x1: number; y1: number; x2: number; y2: number }
): 'N' | 'S' | 'E' | 'W' {
  const dx = Math.abs(seg.x2 - seg.x1);
  const dy = Math.abs(seg.y2 - seg.y1);
  if (dx > dy) {
    // Horizontal wall → door faces N or S depending on y position
    return seg.y1 < 5 ? 'N' : 'S';
  }
  // Vertical wall → door faces E or W depending on x position
  return seg.x1 < 5 ? 'E' : 'W';
}

// ─── Circulation path generation ──────────────────────────────────────────────

function generateCirculationPaths(rooms: PlacedRoom[]): Point[][] {
  if (rooms.length < 2) return [];

  // Nearest-neighbor TSP to visit all room centers
  const visited = new Set<string>();
  const path: Point[] = [];
  let current = rooms[0];
  visited.add(current.id);
  path.push({
    x: Math.round((current.x + current.width / 2) * 100) / 100,
    y: Math.round((current.y + current.depth / 2) * 100) / 100,
  });

  while (visited.size < rooms.length) {
    let nearest: PlacedRoom | null = null;
    let nearestDist = Infinity;

    for (const r of rooms) {
      if (visited.has(r.id)) continue;
      const d = distanceBetween(current, r);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = r;
      }
    }

    if (!nearest) break;
    current = nearest;
    visited.add(current.id);
    path.push({
      x: Math.round((current.x + current.width / 2) * 100) / 100,
      y: Math.round((current.y + current.depth / 2) * 100) / 100,
    });
  }

  // Secondary paths: connect adjacent rooms directly
  const directPaths: Point[][] = [];
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      if (areAdjacent(rooms[i], rooms[j])) {
        const a = rooms[i];
        const b = rooms[j];
        directPaths.push([
          {
            x: Math.round((a.x + a.width / 2) * 100) / 100,
            y: Math.round((a.y + a.depth / 2) * 100) / 100,
          },
          {
            x: Math.round((b.x + b.width / 2) * 100) / 100,
            y: Math.round((b.y + b.depth / 2) * 100) / 100,
          },
        ]);
      }
    }
  }

  return [path, ...directPaths];
}

function distanceBetween(a: PlacedRoom, b: PlacedRoom): number {
  const cx1 = a.x + a.width / 2;
  const cy1 = a.y + a.depth / 2;
  const cx2 = b.x + b.width / 2;
  const cy2 = b.y + b.depth / 2;
  return Math.sqrt((cx2 - cx1) ** 2 + (cy2 - cy1) ** 2);
}

function areAdjacent(a: PlacedRoom, b: PlacedRoom): boolean {
  const tol = GAP + 0.05;
  // Check if any edge is within tolerance
  const aRight = a.x + a.width;
  const bLeft = b.x;
  const aTop = a.y + a.depth;
  const bBottom = b.y;
  const bRight = b.x + b.width;
  const aLeft = a.x;
  const bTop = b.y + b.depth;
  const aBottom = a.y;

  // a right next to b left
  if (Math.abs(aRight - bLeft) < tol) {
    const yOverlap = Math.min(aTop, bTop) - Math.max(a.y, b.y);
    if (yOverlap > 0.5) return true;
  }
  // b right next to a left
  if (Math.abs(bRight - aLeft) < tol) {
    const yOverlap = Math.min(aTop, bTop) - Math.max(a.y, b.y);
    if (yOverlap > 0.5) return true;
  }
  // a top next to b bottom
  if (Math.abs(aTop - bBottom) < tol) {
    const xOverlap = Math.min(aRight, bRight) - Math.max(a.x, b.x);
    if (xOverlap > 0.5) return true;
  }
  // b top next to a bottom
  if (Math.abs(bTop - aBottom) < tol) {
    const xOverlap = Math.min(aRight, bRight) - Math.max(a.x, b.x);
    if (xOverlap > 0.5) return true;
  }
  return false;
}
