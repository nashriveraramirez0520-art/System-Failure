import type { Scene } from '@babylonjs/core';
import type { ShipMaterials } from './materials';
import { block, sign } from './architecture';

export function createService(scene: Scene, m: ShipMaterials) {
  // Open only SVC-02. Replace the old rear wall with a full-height partition
  // around its 3.2-unit opening; all other Engineering Control boundaries stay put.
  scene.getMeshByName('backWall')!.setEnabled(false);
  block(scene, 'rearWallLeft', [23.9,6,0.3], [-3.05,3,15],m.wall);
  block(scene, 'rearWallRight', [2.9,6,0.3], [13.55,3,15],m.wall);
  block(scene, 'rearServiceLintel', [3.2,2.2,0.3], [10.5,4.9,15],m.wall);
  for (const side of [-1, 1]) {
    for (const x of [8.7,12.3]) block(scene,'serviceJamb'+side+x,[0.25,4.2,1.8],[side*x,2.1,13.9],m.trim);
    block(scene,'serviceHeader'+side,[3.8,0.3,1.8],[side*10.5,4.1,13.9],m.trim);
    if (side < 0) {
      block(scene,'serviceDoor'+side,[3.2,3.8,0.15],[side*10.5,1.9,14.77],m.equipment);
      block(scene,'serviceDoorSeam'+side,[0.04,3.5,0.02],[side*10.5,1.9,14.67],m.amber,false);
      sign(scene,'serviceId'+side,'SVC-01',[side*10.5,3.5,14.66],0.8);
    } else {
      // Static raised panel, not an animated or interactive door.
      block(scene,'serviceDoorRaised',[3.2,3.8,0.15],[10.5,5.8,14.77],m.equipment);
      sign(scene,'serviceId'+side,'MNT-02',[11.6,3.5,14.65],0.65);
    }
  }
}
