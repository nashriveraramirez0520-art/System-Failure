import { Color3, MeshBuilder, StandardMaterial } from '@babylonjs/core';
import type { Scene } from '@babylonjs/core';
import type { ShipMaterials } from './materials';
import { block } from './architecture';
import { createSpaceEnvironment } from './spaceEnvironment';

export function createObservationWindow(scene: Scene, m: ShipMaterials) {
  const glass = new StandardMaterial('bowGlazing', scene);
  glass.diffuseColor = new Color3(0.08, 0.18, 0.23);
  glass.emissiveColor = new Color3(0.015, 0.035, 0.05);
  glass.specularColor = new Color3(0.3, 0.5, 0.6);
  glass.alpha = 0.16; glass.backFaceCulling = false;
  // Retain the existing hull segments as collision-only glazing boundaries.
  // Original angled side hull segments keep their opaque shape and position.
  for (const name of ['frontCenterHull','frontLeftCurve','frontRightCurve']) {
    const pane = scene.getMeshByName(name)!;
    // Original hull boxes now serve collision only: drawing both box faces through
    // transparent material creates overlapping glass layers at the shoulder joints.
    pane.isVisible = false;
    const glazing = MeshBuilder.CreatePlane(name + 'Glazing', {
      width: name === 'frontCenterHull' ? 6.72 : 4.7, height: 2.56,
    }, scene);
    glazing.position.set(pane.position.x, 2.4, pane.position.z);
    glazing.rotation.y = pane.rotation.y + (name === 'frontCenterHull' ? 0 : Math.PI / 2);
    glazing.material = glass; glazing.isPickable = false;
    const bounds = pane.getBoundingInfo().boundingBox.extendSize;
    const width = name === 'frontCenterHull' ? 7 : 0.3;
    const depth = name === 'frontCenterHull' ? 0.3 : 5;
    for (const [part,y,height] of [['sill',0.55,1.1],['header',4.85,2.3]] as const) {
      const frame = block(scene, name + part, [width + 0.12, height, depth + 0.12], [pane.position.x,y,pane.position.z], m.wall);
      frame.rotation.y = pane.rotation.y;
    }
    // Mullions follow each original segment, including the angled shoulder panes.
    const alongX = name === 'frontCenterHull';
    for (const offset of [-1,1]) {
      const support = block(scene, name + 'Mullion' + offset, [0.18,2.6,0.42], [0,2.4,0], m.trim);
      support.position.set(pane.position.x, 2.4, pane.position.z);
      const distance = offset * (alongX ? bounds.x * 0.96 : bounds.z * 0.94);
      support.position.x += alongX ? distance : Math.sin(pane.rotation.y) * distance;
      support.position.z += alongX ? 0 : Math.cos(pane.rotation.y) * distance;
      support.rotation.y = pane.rotation.y + (alongX ? 0 : Math.PI/2);
    }
  }
  createSpaceEnvironment(scene);
}
