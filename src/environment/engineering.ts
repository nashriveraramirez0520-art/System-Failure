import { MeshBuilder, Vector3 } from '@babylonjs/core';
import type { Scene } from '@babylonjs/core';
import type { ShipMaterials } from './materials';
import { block, sign } from './architecture';
import { layout } from './layout';

export function createEngineering(scene: Scene, m: ShipMaterials) {
  const z = layout.engineeringStartZ;
  // One aft region with a broad central entrance. A short vestibule controls light spill.
  for (const side of [-1, 1]) {
    block(scene, 'aftWallLiner' + side, [0.08,5.8,6.8], [side*14.76,2.9,11.5],m.wall,false);
    block(scene, 'engineeringEntryWing' + side, [11, 6, 0.35], [side * 9.5, 3, z], m.wall);
    block(scene, 'engineeringEntryJamb' + side, [0.35, 4.5, 1.2], [side * 4, 2.25, z], m.trim);
    block(scene, 'engineeringEntryLight' + side, [0.06, 2.5, 1.25], [side * 3.78, 2.3, z], m.amber, false);
    for (let i = 0; i < 3; i++) {
      const x = side * (7 + i * 2.7);
      block(scene, 'aftEquipmentRack' + side + i, [1.8, 3.1, 1.6], [x, 1.55, 10.5], m.equipment);
      block(scene, 'rackRecess' + side + i, [1.45, 2.5, 0.06], [x, 1.6, 9.66], m.screen, false);
      block(scene, 'rackStatus' + side + i, [0.08, 1.4, 0.08], [x + 0.65, 1.7, 9.59], m.amber, false);
      sign(scene, 'rackId' + side + i, (side < 0 ? 'PWR-' : 'CLT-') + (i+1), [x, 2.8, 9.58], 0.65);
    }
    const pipe = MeshBuilder.CreateCylinder('coolantRiser' + side, { height: 4.8, diameter: 0.45, tessellation: 10 }, scene);
    pipe.position = new Vector3(side * 13.8, 2.4, 13); pipe.material = m.trim; pipe.checkCollisions = true;
    pipe.metadata = { blocksHead: true };
    block(scene, 'utilityPipe' + side, [9, 0.18, 0.18], [side * 9, 4.8, 12.5], m.trim, false);
    block(scene, 'maintenanceBench' + side, [3, 1.1, 0.9], [side * 5.7, 0.55, 13.9], m.equipment);
  }
  block(scene, 'engineeringEntryHeader', [8, 1.5, 1.2], [0, 5.25, z], m.equipment);
  block(scene, 'reactorServiceHousing', [3, 3.2, 1.25], [0, 1.6, 14.15], m.equipment);
  block(scene, 'reactorServiceInset', [2.1, 2.4, 0.06], [0, 1.7, 13.49], m.screen, false);
  block(scene, 'reactorServiceGlow', [0.12, 1.5, 0.08], [0, 1.7, 13.44], m.amber, false);
}
