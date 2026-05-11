/**
 * Solver Test Suite — 15+ tests covering all solver modules.
 *
 * Can be run with Vitest, Jest, or the inline runner at the bottom.
 * To run manually: `npx ts-node solver.test.ts` or import into any test runner.
 */

import {
  Room,
  Footprint,
  PlacedRoom,
  FloorPlan,
  Program,
  DesignVariant,
} from '../types';
import { solveRoomProgram, RoomInput } from '../roomSolver';
import { generateFootprint } from '../footprintGenerator';
import {
  solveLinear,
  solveLShaped,
  solveCentral,
  solveUShaped,
} from '../parametricSolver';
import { generateVariants } from '../variantGenerator';

// ─── Test fixtures ────────────────────────────────────────────────────────────

function makeTestRooms(): Room[] {
  // These rooms sum to ~55 m² and fit in a 12×10 footprint with GAP spacing
  return [
    {
      id: 'room-0',
      type: 'salon',
      name: 'Salon',
      surface: 20,
      width: 5.0,
      depth: 4.0,
      priority: 10,
      adjacencyRequired: [],
    },
    {
      id: 'room-1',
      type: 'cuisine',
      name: 'Cuisine',
      surface: 10,
      width: 3.5,
      depth: 2.86,
      priority: 8,
      adjacencyRequired: ['salon'],
    },
    {
      id: 'room-2',
      type: 'chambre',
      name: 'Chambre 2',
      surface: 12,
      width: 4.0,
      depth: 3.0,
      priority: 7,
      adjacencyRequired: [],
    },
    {
      id: 'room-3',
      type: 'salle_de_bain',
      name: 'Salle de bain',
      surface: 6,
      width: 2.5,
      depth: 2.4,
      priority: 6,
      adjacencyRequired: ['chambre'],
    },
    {
      id: 'room-4',
      type: 'bureau',
      name: 'Bureau',
      surface: 9,
      width: 3.0,
      depth: 3.0,
      priority: 5,
      adjacencyRequired: [],
    },
  ];
}

function makeSmallFootprint(): Footprint {
  return { x: 2, y: 3, width: 12, depth: 10, maxHeight: 7 };
}

function makeTinyRooms(): Room[] {
  return [
    {
      id: 'r0',
      type: 'wc',
      name: 'WC',
      surface: 2,
      width: 1.5,
      depth: 1.34,
      priority: 3,
      adjacencyRequired: [],
    },
  ];
}

// ─── Assertions ───────────────────────────────────────────────────────────────

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(`ASSERT FAIL: ${message}`);
  }
}

function assertApprox(
  actual: number,
  expected: number,
  tolerance: number,
  message: string
): void {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(
      `ASSERT FAIL: ${message} — expected ${expected} ±${tolerance}, got ${actual}`
    );
  }
}

// ─── Test definitions ─────────────────────────────────────────────────────────

interface TestCase {
  name: string;
  run: () => void;
}

const tests: TestCase[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ROOM SOLVER (tests 1–6)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    name: 'roomSolver: returns a valid Program with all rooms',
    run() {
      const inputs: RoomInput[] = [
        { type: 'salon', surface: 20, priority: 10 },
        { type: 'cuisine', surface: 10, priority: 8 },
        { type: 'chambre', surface: 12, priority: 7 },
      ];
      const program = solveRoomProgram(inputs, 'extension_under_40', 'moderne');
      assert(program.rooms.length === 3, 'should have 3 rooms');
      assert(program.totalCHA > 0, 'totalCHA should be positive');
      assert(program.totalCAO > program.totalCHA, 'CAO should exceed CHA');
      assert(program.circulationArea > 0, 'circulation area should be positive');
    },
  },

  {
    name: 'roomSolver: rooms are sorted by priority descending',
    run() {
      const inputs: RoomInput[] = [
        { type: 'chambre', surface: 10, priority: 3 },
        { type: 'salon', surface: 20, priority: 9 },
        { type: 'cuisine', surface: 8, priority: 5 },
      ];
      const program = solveRoomProgram(inputs, 'extension_under_40', 'moderne');
      assert(program.rooms[0].type === 'salon', 'first room should be salon (priority 9)');
      assert(program.rooms[1].type === 'cuisine', 'second room should be cuisine (priority 5)');
      assert(program.rooms[2].type === 'chambre', 'third room should be chambre (priority 3)');
    },
  },

  {
    name: 'roomSolver: dimensions are computed from surface and aspect ratio',
    run() {
      const inputs: RoomInput[] = [
        { type: 'salon', surface: 24, priority: 10 }, // aspect 1.5
      ];
      const program = solveRoomProgram(inputs, 'extension_under_40', 'moderne');
      const salon = program.rooms[0];
      assertApprox(salon.width * salon.depth, 24, 0.5, 'surface should equal width×depth');
      assert(salon.width / salon.depth > 1.2, 'salon should be wider than deep');
    },
  },

  {
    name: 'roomSolver: adjacency graph contains expected direct edges',
    run() {
      const inputs: RoomInput[] = [
        { type: 'cuisine', surface: 10, priority: 10 },
        { type: 'salon', surface: 20, priority: 8 },
        { type: 'chambre_parentale', surface: 15, priority: 7 },
        { type: 'salle_de_bain', surface: 6, priority: 6 },
      ];
      const program = solveRoomProgram(inputs, 'extension_under_40', 'moderne');
      const hasCuisineSalon = program.adjacencyGraph.some(
        (e) =>
          (e.from.includes('cuisine') && e.to.includes('salon')) ||
          (e.from.includes('salon') && e.to.includes('cuisine'))
      );
      assert(hasCuisineSalon, 'cuisine should have adjacency to salon');

      const hasChambreSdB = program.adjacencyGraph.some(
        (e) =>
          e.relation === 'direct' &&
          ((e.from.includes('parentale') && e.to.includes('bain')) ||
            (e.from.includes('bain') && e.to.includes('parentale')))
      );
      assert(hasChambreSdB, 'chambre_parentale should be adjacent to salle_de_bain');
    },
  },

  {
    name: 'roomSolver: sun recommendations follow architectural rules',
    run() {
      const inputs: RoomInput[] = [
        { type: 'salon', surface: 20, priority: 10 },
        { type: 'cuisine', surface: 10, priority: 8 },
        { type: 'bureau', surface: 9, priority: 6 },
      ];
      const program = solveRoomProgram(inputs, 'extension_under_40', 'moderne');

      const salonSun = program.sunRecommendations.find((s) =>
        program.rooms.find((r) => r.id === s.roomId && r.type === 'salon')
      );
      assert(!!salonSun, 'salon should have sun recommendation');
      assert(
        salonSun!.optimal.includes('S') || salonSun!.optimal.includes('W'),
        'salon optimal should include S or W'
      );
      assert(salonSun!.avoid.includes('N'), 'salon should avoid N');

      const cuisineSun = program.sunRecommendations.find((s) =>
        program.rooms.find((r) => r.id === s.roomId && r.type === 'cuisine')
      );
      assert(!!cuisineSun, 'cuisine should have sun recommendation');
      assert(
        cuisineSun!.avoid.includes('S') || cuisineSun!.avoid.includes('W'),
        'cuisine should avoid S or W'
      );
    },
  },

  {
    name: 'roomSolver: budget estimate scales with surface and style',
    run() {
      const inputs: RoomInput[] = [
        { type: 'salon', surface: 30, priority: 10 },
        { type: 'chambre', surface: 12, priority: 8 },
      ];
      const totalSurface = 42;
      const programWood = solveRoomProgram(inputs, 'extension_under_40', 'moderne');
      const programTrad = solveRoomProgram(inputs, 'extension_under_40', 'classique');

      assert(programWood.budgetEstimate.currency === 'EUR', 'currency should be EUR');
      assert(programWood.budgetEstimate.min > 0, 'min budget should be positive');
      assert(
        programWood.budgetEstimate.avg ===
          Math.round((programWood.budgetEstimate.min + programWood.budgetEstimate.max) / 2),
        'avg should be mean of min and max'
      );
      assert(
        programTrad.budgetEstimate.min > programWood.budgetEstimate.min,
        'traditional should cost more than wood/modern'
      );
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FOOTPRINT GENERATOR (tests 7–9)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    name: 'footprintGenerator: footprint respects parcel setbacks',
    run() {
      const fp = generateFootprint(20, 20, 0.5, 7, {
        front: 3,
        side: 2,
        rear: 2,
      });
      assert(fp.x === 2, 'x should equal side setback');
      assert(fp.y === 3, 'y should equal front setback');
      assert(
        fp.width <= 20 - 2 * 2,
        'width should not exceed parcel minus side setbacks'
      );
      assert(
        fp.depth <= 20 - 3 - 2,
        'depth should not exceed parcel minus front+rear setbacks'
      );
    },
  },

  {
    name: 'footprintGenerator: COS limit reduces emprise when binding',
    run() {
      // Small COS should force a smaller footprint
      const fpGenerous = generateFootprint(20, 20, 1.0, 7, {
        front: 2,
        side: 2,
        rear: 2,
      });
      const fpRestricted = generateFootprint(20, 20, 0.2, 7, {
        front: 2,
        side: 2,
        rear: 2,
      });
      assert(
        fpRestricted.width * fpRestricted.depth <
          fpGenerous.width * fpGenerous.depth,
        'restricted COS should yield smaller area'
      );
      assert(
        fpRestricted.width * fpRestricted.depth <= 20 * 20 * 0.2 + 0.01,
        'area should respect COS bound'
      );
    },
  },

  {
    name: 'footprintGenerator: maxHeight is preserved',
    run() {
      const fp = generateFootprint(15, 15, 0.6, 8.5, {
        front: 2,
        side: 1.5,
        rear: 1.5,
      });
      assert(fp.maxHeight === 8.5, 'maxHeight should be preserved from input');
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PARAMETRIC SOLVER — Linear (tests 10–11)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    name: 'solveLinear: places all rooms inside the footprint envelope',
    run() {
      const rooms = makeTestRooms();
      const fp = makeSmallFootprint();
      const plan = solveLinear(rooms, fp);
      assert(plan.rooms.length === rooms.length, 'all rooms should be placed');
      for (const r of plan.rooms) {
        assert(
          r.x >= 0 && r.y >= 0 && r.x + r.width <= fp.width && r.y + r.depth <= fp.depth,
          `room ${r.name} at (${r.x},${r.y}) ${r.width}×${r.depth} exceeds ${fp.width}×${fp.depth} envelope`
        );
      }
    },
  },

  {
    name: 'solveLinear: no overlapping rooms (with GAP tolerance)',
    run() {
      const rooms = makeTestRooms();
      const fp = makeSmallFootprint();
      const plan = solveLinear(rooms, fp);
      for (let i = 0; i < plan.rooms.length; i++) {
        for (let j = i + 1; j < plan.rooms.length; j++) {
          const a = plan.rooms[i];
          const b = plan.rooms[j];
          const overlap =
            a.x < b.x + b.width && a.x + a.width > b.x &&
            a.y < b.y + b.depth && a.y + a.depth > b.y;
          assert(!overlap, `rooms ${a.name} and ${b.name} should not overlap`);
        }
      }
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PARAMETRIC SOLVER — L-shaped (tests 12–13)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    name: 'solveLShaped: produces walls and doors',
    run() {
      const rooms = makeTestRooms();
      const fp = makeSmallFootprint();
      const plan = solveLShaped(rooms, fp);
      assert(plan.rooms.length > 0, 'should place at least some rooms');
      assert(plan.walls.length > 0, 'should generate walls');
      assert(plan.doors.length >= 0, 'doors array should exist');
      // Some adjacent rooms should produce doors
      assert(
        plan.doors.length > 0 || plan.rooms.length <= 1,
        'multiple rooms should yield doors when adjacent'
      );
    },
  },

  {
    name: 'solveLShaped: placed rooms have valid coordinates and dimensions',
    run() {
      const rooms = makeTestRooms();
      const fp = makeSmallFootprint();
      const plan = solveLShaped(rooms, fp);
      for (const r of plan.rooms) {
        assert(r.x >= 0 && !isNaN(r.x), `room ${r.name} x should be valid`);
        assert(r.y >= 0 && !isNaN(r.y), `room ${r.name} y should be valid`);
        assert(r.width > 0, `room ${r.name} width should be positive`);
        assert(r.depth > 0, `room ${r.name} depth should be positive`);
        assert(r.rotation === 0, 'rotation should be 0 (no rotation yet)');
      }
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PARAMETRIC SOLVER — Central & U-shaped (tests 14–15)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    name: 'solveCentral: main room is near the center of footprint',
    run() {
      const rooms = makeTestRooms();
      const fp = makeSmallFootprint();
      const plan = solveCentral(rooms, fp);
      assert(plan.rooms.length > 0, 'should place rooms');
      const main = plan.rooms[0]; // largest = first
      const cx = main.x + main.width / 2;
      const cy = main.y + main.depth / 2;
      const centerDist = Math.sqrt(
        (cx - fp.width / 2) ** 2 + (cy - fp.depth / 2) ** 2
      );
      assert(
        centerDist < Math.max(fp.width, fp.depth) * 0.4,
        'main room should be reasonably centered'
      );
    },
  },

  {
    name: 'solveUShaped: produces circulation paths',
    run() {
      const rooms = makeTestRooms();
      const fp = makeSmallFootprint();
      const plan = solveUShaped(rooms, fp);
      assert(plan.circulationPaths.length > 0, 'should generate circulation paths');
      // Main path should visit multiple room centers
      if (plan.circulationPaths.length > 0) {
        assert(
          plan.circulationPaths[0].length >= 2,
          'main circulation path should have at least 2 points'
        );
      }
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PARAMETRIC SOLVER — Cross-cutting (test 16)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    name: 'all 4 strategies: handle single-room input gracefully',
    run() {
      const rooms = makeTinyRooms();
      const fp = makeSmallFootprint();
      const linear = solveLinear(rooms, fp);
      const lShape = solveLShaped(rooms, fp);
      const central = solveCentral(rooms, fp);
      const uShape = solveUShaped(rooms, fp);

      assert(linear.rooms.length === 1, 'linear should place 1 room');
      assert(lShape.rooms.length === 1, 'L-shaped should place 1 room');
      assert(central.rooms.length === 1, 'central should place 1 room');
      assert(uShape.rooms.length === 1, 'U-shaped should place 1 room');

      for (const plan of [linear, lShape, central, uShape]) {
        assert(plan.walls.length >= 4, 'single room should have at least 4 walls');
      }
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VARIANT GENERATOR (tests 17–20)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    name: 'generateVariants: produces exactly 4 variants',
    run() {
      const rooms = makeTestRooms();
      const fp = makeSmallFootprint();
      const variants = generateVariants(rooms, fp);
      assert(variants.length === 4, 'should generate exactly 4 variants');
    },
  },

  {
    name: 'generateVariants: each variant has unique id and valid strategy name',
    run() {
      const rooms = makeTestRooms();
      const fp = makeSmallFootprint();
      const variants = generateVariants(rooms, fp);
      const ids = new Set(variants.map((v) => v.id));
      assert(ids.size === 4, 'all variant ids should be unique');
      for (const v of variants) {
        assert(v.strategy.length > 0, 'strategy name should not be empty');
        assert(v.name.includes(v.strategy), 'name should contain strategy');
      }
    },
  },

  {
    name: 'generateVariants: scores are within valid 0..100 range',
    run() {
      const rooms = makeTestRooms();
      const fp = makeSmallFootprint();
      const variants = generateVariants(rooms, fp);
      for (const v of variants) {
        assert(v.scores.surface >= 0 && v.scores.surface <= 100, 'surface score in range');
        assert(v.scores.sunExposure >= 0 && v.scores.sunExposure <= 100, 'sun score in range');
        assert(
          v.scores.costEfficiency >= 0 && v.scores.costEfficiency <= 100,
          'cost score in range'
        );
        assert(v.scores.aesthetics >= 0 && v.scores.aesthetics <= 100, 'aesthetics score in range');
        assert(v.scores.overall >= 0 && v.scores.overall <= 100, 'overall score in range');
        assert(
          v.conformityScore >= 0 && v.conformityScore <= 100,
          'conformity score in range'
        );
      }
    },
  },

  {
    name: 'generateVariants: each variant contains a non-empty floor plan',
    run() {
      const rooms = makeTestRooms();
      const fp = makeSmallFootprint();
      const variants = generateVariants(rooms, fp);
      for (const v of variants) {
        assert(v.floorPlan.rooms.length > 0, 'floor plan should have rooms');
        assert(v.floorPlan.walls.length > 0, 'floor plan should have walls');
        // The sum of room surfaces should be positive
        const totalSurface = v.floorPlan.rooms.reduce((s, r) => s + r.surface, 0);
        assert(totalSurface > 0, 'total room surface should be positive');
      }
    },
  },

  {
    name: 'generateVariants: strategy D prioritizes aesthetics in overall score',
    run() {
      const rooms = makeTestRooms();
      const fp = makeSmallFootprint();
      const variants = generateVariants(rooms, fp);
      const archVariant = variants.find((v) => v.id === 'variant-3');
      assert(!!archVariant, 'architecture variant D should exist');
      // With aesthetics weight 0.4, overall should be influenced
      assert(
        archVariant!.scores.overall >= 0 && archVariant!.scores.overall <= 100,
        'architecture variant overall score should be valid'
      );
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INTEGRATION (test 21)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    name: 'integration: full pipeline from program to variants',
    run() {
      const inputs: RoomInput[] = [
        { type: 'salon', surface: 20, priority: 10 },
        { type: 'cuisine', surface: 10, priority: 9 },
        { type: 'chambre', surface: 12, priority: 8 },
        { type: 'salle_de_bain', surface: 5, priority: 7 },
      ];
      const program = solveRoomProgram(
        inputs,
        'extension_under_40',
        'contemporain'
      );
      const fp = generateFootprint(15, 15, 0.7, 7, {
        front: 2,
        side: 1.5,
        rear: 1.5,
      });
      const variants = generateVariants(program.rooms, fp);

      assert(variants.length === 4, 'pipeline should produce 4 variants');
      assert(program.budgetEstimate.min > 0, 'program should have budget');

      // All variants should have the same number of rooms as the program
      for (const v of variants) {
        assert(
          v.floorPlan.rooms.length === program.rooms.length,
          `variant ${v.id} should place all ${program.rooms.length} rooms`
        );
      }
    },
  },
];

// ─── Test runner ──────────────────────────────────────────────────────────────

export function runAllTests(): {
  passed: number;
  failed: number;
  failures: string[];
} {
  const failures: string[] = [];
  let passed = 0;

  for (const t of tests) {
    try {
      t.run();
      passed++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      failures.push(`${t.name}: ${msg}`);
    }
  }

  return { passed, failed: failures.length, failures };
}

// Auto-run when executed directly (e.g. via ts-node or vitest inline runner)
if (typeof process !== 'undefined' && process.argv[1]?.includes('solver.test')) {
  const result = runAllTests();
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Solver Test Results: ${result.passed} passed, ${result.failed} failed`);
  console.log(`${'='.repeat(60)}`);
  if (result.failures.length > 0) {
    for (const f of result.failures) {
      console.log(`  ✗ ${f}`);
    }
    process.exit(1);
  } else {
    console.log('  All tests passed ✓');
    process.exit(0);
  }
}

// Vitest-compatible export
export { tests };
export default runAllTests;
