import type { Scene } from '@babylonjs/core';
import type { ShipMaterials } from './materials';
import { block, consoleStation, sign } from './architecture';

export function createCommon(scene: Scene, m: ShipMaterials) {
  // Fourteen-unit lounge, with clear circulation at X=+/-3.8 and through both room doors.
  block(scene, 'auraCore', [1.1, 1.7, 1.1], [0, 0.85, 3.8], m.equipment);
  block(scene, 'auraBeacon', [0.55, 0.8, 0.55], [0, 2.1, 3.8], m.blue, false);
  sign(scene, 'auraId', 'AURA', [0, 1.5, 4.37], 0.6);
  for (const side of [-1, 1]) {
    consoleStation(scene, side < 0 ? 'operationsRole' : 'engineerRole', side * 1.55, 3.8, m.equipment, side < 0 ? m.blue : m.amber, m.screen);
    sign(scene, 'stationId' + side, side < 0 ? 'OPS-01' : 'ENG-01', [side * 1.55, 0.9, 4.36], 0.65);
    // Seating faces the open lounge; furniture stays outside the main walking lanes.
    block(scene, 'loungeSofaSeat' + side, [1.25, 0.55, 2.8], [side * 5.8, 0.55, 5.4], m.fabric);
    block(scene, 'loungeSofaBack' + side, [0.25, 1.3, 2.8], [side * 6.35, 0.9, 5.4], m.fabric);
    for (const z of [4.05, 6.75]) block(scene, 'sofaArm' + side + z, [1.25, 0.25, 0.18], [side * 5.8, 0.95, z], m.trim);
    block(scene, 'loungeTableTop' + side, [0.8, 0.1, 1.1], [side * 4.65, 0.65, 5.4], m.trim);
    block(scene, 'loungeTableLeg' + side, [0.2, 0.6, 0.2], [side * 4.65, 0.3, 5.4], m.equipment);
    block(scene, 'crewMug' + side, [0.12, 0.16, 0.12], [side * 4.65, 0.78, 5.4], m.white, false);
  }
  // Compact galley sits near the forward-left wall, away from Cubito and the bulkhead route.
  block(scene, 'galleyBase', [2.4, 1.05, 0.85], [-5.4, 0.525, -0.9], m.equipment);
  block(scene, 'galleyWorktop', [2.5, 0.1, 0.95], [-5.4, 1.1, -0.9], m.trim);
  block(scene, 'foodDispenser', [0.8, 1, 0.55], [-5.9, 1.65, -0.9], m.equipment);
  block(scene, 'foodDispenserSlot', [0.5, 0.2, 0.03], [-5.9, 1.5, -0.61], m.screen, false);
  block(scene, 'galleySink', [0.75, 0.02, 0.5], [-4.6, 1.16, -0.9], m.screen, false);
  block(scene, 'galleyTap', [0.08, 0.35, 0.08], [-4.25, 1.3, -1.15], m.trim, false);
  block(scene, 'crewStorage', [2.4, 2, 0.65], [5.4, 1, -0.95], m.equipment);
  for (const x of [4.4, 5.2, 6]) block(scene, 'lockerSeam' + x, [0.02, 1.8, 0.02], [x, 1, -0.61], m.trim, false);
}
