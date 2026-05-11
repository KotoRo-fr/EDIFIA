/**
 * Footprint Generator
 * Computes the buildable envelope (emprise au sol) within a parcel,
 * respecting urban planning constraints: COS, setbacks, and height limits.
 */

import type { Footprint } from './types';

/**
 * Generates the buildable footprint inside a parcel.
 *
 * @param parcelWidth  - Parcel width in meters
 * @param parcelDepth  - Parcel depth in meters
 * @param cosMax       - Maximum Coefficient d'Occupation des Sols (0..1)
 * @param heightMax    - Maximum building height in meters
 * @param setbacks     - Minimum legal distances from parcel edges
 * @returns Footprint envelope (position, size, max height)
 */
export function generateFootprint(
  parcelWidth: number,
  parcelDepth: number,
  cosMax: number,
  heightMax: number,
  setbacks: { front: number; side: number; rear: number }
): Footprint {
  // Maximum allowed built area by COS
  const maxEmprise = parcelWidth * parcelDepth * cosMax;

  // Available dimensions after subtracting setbacks
  const availableWidth = parcelWidth - setbacks.side * 2;
  const availableDepth = parcelDepth - setbacks.front - setbacks.rear;

  // Raw emprise if we filled the available rectangle
  const actualEmprise = availableWidth * availableDepth;

  // We must respect both setbacks AND COS limit
  const effectiveEmprise = Math.min(actualEmprise, maxEmprise);

  // If COS forces a reduction, apply uniform scaling to keep proportions
  const ratio =
    actualEmprise > 0
      ? Math.sqrt(effectiveEmprise / actualEmprise)
      : 1.0;

  const finalWidth = Math.round(availableWidth * ratio * 100) / 100;
  const finalDepth = Math.round(availableDepth * ratio * 100) / 100;

  return {
    x: setbacks.side,
    y: setbacks.front,
    width: finalWidth,
    depth: finalDepth,
    maxHeight: heightMax,
    // Legacy compatibility fields
    surface: Math.round(finalWidth * finalDepth),
    cos: cosMax,
    reculs: setbacks,
    buildableWidth: Math.round(availableWidth * 10) / 10,
    buildableDepth: Math.round(availableDepth * 10) / 10,
  };
}
