import type { Scene } from '@babylonjs/core';
import type { ShipMaterials } from './materials';
import { block, consoleStation } from './architecture';
import { createObservationWindow } from './observationWindow';

export function createCommand(scene: Scene, m: ShipMaterials) {
  for (const side of [-1, 1]) {
    consoleStation(scene, 'commandStation' + side, side * 3.5, -19, m.equipment, m.blue, m.screen);
    // Angled cheeks give each workstation a deliberate housing.
    const cheek = block(scene, 'consoleCheek' + side, [0.18, 1.3, 1.4], [side * 4.6, 0.65, -19], m.trim);
    cheek.rotation.z = -side * 0.12;
    consoleStation(scene, 'sensorStation' + side, side * 10, -8, m.equipment, m.blue, m.screen);
    for (const z of [-7,-11,-14]) {
      block(scene, 'commandWallRecess' + side + z, [0.09, 2.5, 2.4], [side * 14.75, 2.4, z], m.equipment, false);
      block(scene, 'commandWallRib' + side + z, [0.35, 5.8, 0.25], [side * 14.55, 2.9, z - 1.3], m.trim);
    }
    block(scene, 'commandDisplay' + side, [3.8, 1.6, 0.18], [side * 7, 2.1, -13], m.screen);
    block(scene, 'commandDisplayRail' + side, [4, 0.06, 0.25], [side * 7, 2.95, -13], m.blue, false);
  }
  createObservationWindow(scene, m);
}
