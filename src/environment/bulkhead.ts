import type { Scene } from '@babylonjs/core';
import type { ShipMaterials } from './materials';
import { block, sign } from './architecture';
import { layout } from './layout';
export function createBulkhead(scene: Scene, m: ShipMaterials) {
  const z = layout.bulkheadZ;
  // Full-width partition. Only the central six-unit opening crosses this plane.
  for (const side of [-1, 1]) {
    block(scene, 'bulkheadWing' + side, [12, 6, 0.7], [side * 9, 3, z], m.wall);
    block(scene, 'bulkheadTrack' + side, [0.25, 4.3, 0.95], [side * 3.12, 2.15, z], m.trim);
    block(scene, 'bulkheadWarning' + side, [0.08, 3.8, 0.98], [side * 3.28, 2, z], m.amber, false);
  }
  block(scene, 'bulkheadHousing', [6, 1.7, 1], [0, 5.15, z], m.equipment);
  // Full-size leaf parked inside an overhead pocket. No animation or state logic.
  const raisedLeaf = block(scene, 'emergencyBulkheadRaised', [6, 4.3, 0.35], [0, 6.45, z], m.trim);
  block(scene, 'bulkheadPocket', [6.6, 2.8, 1.1], [0, 7.4, z], m.wall);
  sign(scene, 'bulkheadId', 'E-01', [2.5, 3.85, z + 0.52], 0.6);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 7; i++) {
      const stripe = block(scene, 'bulkheadHazard' + side + i, [0.3, 0.12, 0.02], [side * 3.5, 0.5 + i * 0.48, z + 0.37], m.amber, false);
      stripe.rotation.z = side * Math.PI / 5;
    }
  }
  return raisedLeaf;
}
