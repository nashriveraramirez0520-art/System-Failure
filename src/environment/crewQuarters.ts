import type { Scene } from '@babylonjs/core';
import type { ShipMaterials } from './materials';
import { block } from './architecture';
import { layout } from './layout';

export function createCrewQuarters(scene: Scene, m: ShipMaterials) {
  const doors = [];
  for (const side of [-1, 1]) {
    const x = side * layout.crewRoomWallX;
    // Enclosed rooms: outer hull, forward/aft walls, and a lounge-facing wall.
    for (const z of [-1.5, 7.5]) {
      block(scene, 'cryoEndWall' + side + z, [7.9, 6, 0.25], [side * 10.95, 3, z], m.wall);
    }
    // Door aperture: Z=0..3.2, floor to Y=4.3. No alternate room exit.
    block(scene, 'cryoDoorWallForward' + side, [0.3, 6, 1.5], [x, 3, -0.75], m.wall);
    block(scene, 'cryoDoorWallAft' + side, [0.3, 6, 4.3], [x, 3, 5.35], m.wall);
    block(scene, 'cryoDoorHeader' + side, [0.5, 1.7, 3.2], [x, 5.15, 1.6], m.equipment);
    for (const z of [0, 3.2]) {
      block(scene, 'cryoDoorJamb' + side + z, [0.55, 4.3, 0.15], [x, 2.15, z], m.trim);
      block(scene, 'cryoDoorStatus' + side + z, [0.58, 0.65, 0.04], [x, 2.8, z + (z === 0 ? 0.1 : -0.1)], m.blue, false);
    }
    // Full-size vertical sliding leaf parked above the opening. Expose it for future animation.
    const leaf = block(scene, 'cryoDoorRaised' + side, [0.18, 4.3, 3.05], [x, 6.45, 1.6], m.trim);
    block(scene, 'cryoDoorPocket' + side, [0.7, 2.7, 3.5], [x, 7.35, 1.6], m.wall);
    doors.push(leaf);
    block(scene, 'cryoRoomLocker' + side, [1.3, 2.4, 0.5], [side * 11, 1.2, -1.1], m.equipment);
    block(scene, 'cryoCeilingFixture' + side, [4.8, 0.06, 0.18], [side * 11, 5.8, 2.3], m.white, false);
  }
  return doors;
}
