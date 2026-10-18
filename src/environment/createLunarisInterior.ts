import type { Scene } from '@babylonjs/core';
import { block } from './architecture';
import { createCrewQuarters } from './crewQuarters';
import { createHull } from './hull';
import { createOriginalProps } from './props';
import { createMaterials } from './materials';
import { createCommand } from './command';
import { createCommon } from './common';
import { createBulkhead } from './bulkhead';
import { createEngineering } from './engineering';
import { createMachineryBay } from './machineryBay';
import { createService } from './service';
import { createCeiling } from './ceiling';
import { createLighting } from './lighting';

export function createLunarisInterior(scene: Scene) {
  createHull(scene);
  const materials = createMaterials(scene);
  createOriginalProps(scene, materials);
  const cryoDoors = createCrewQuarters(scene, materials);
  for (const name of ['floor','frontFloor']) scene.getMeshByName(name)!.material = materials.floor;
  for (const name of ['backWall','frontWall','leftWall','rightWall','frontLeftHull','frontRightHull','frontCenterHull','frontLeftCurve','frontRightCurve']) {
    scene.getMeshByName(name)!.material = materials.wall;
  }
  // Separate visible deck skins keep region-scoped lights from affecting the entire
  // original 30x30 ground mesh. Original ground colliders remain untouched underneath.
  block(scene, 'commandDeckSkin', [29.7, 0.008, 11.9], [0, 0.002, -9], materials.floor, false);
  block(scene, 'crewDeckSkin', [29.7, 0.008, 10.9], [0, 0.002, 2.5], materials.floor, false);
  block(scene, 'engineeringDeckSkin', [29.7, 0.008, 6.85], [0, 0.002, 11.5], materials.floor, false);
  for (let z = -14; z <= 14; z += 2) {
    block(scene, 'deckSeam' + z, [29.5, 0.006, 0.025], [0, 0.004, z], materials.trim, false);
  }
  createCommand(scene, materials);
  createCommon(scene, materials);
  const raisedBulkhead = createBulkhead(scene, materials);
  createEngineering(scene, materials);
  createService(scene, materials);
  const machinerySystems = createMachineryBay(scene, materials);
  createCeiling(scene, materials);
  createLighting(scene, materials);
  return { raisedBulkhead, cryoDoors, machinerySystems };
}
