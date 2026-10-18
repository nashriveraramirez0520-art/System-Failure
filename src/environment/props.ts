import { MeshBuilder, Vector3, StandardMaterial, Color3 } from '@babylonjs/core';
import type { Scene } from '@babylonjs/core';
import type { ShipMaterials } from './materials';
import { crewPods } from './layout';
import { block, sign } from './architecture';

export function createOriginalProps(scene: Scene, m: ShipMaterials) {
  // Cubito retains its original name, size, placement, material and collision behavior.
  const box = MeshBuilder.CreateBox('box', { size: 2 }, scene);
  box.position.y = 0.5;
  const mat = new StandardMaterial('mat', scene);
  mat.diffuseColor = new Color3(0.2, 0.6, 1);
  box.material = mat;

  for (const pod of crewPods) {
    const mesh = MeshBuilder.CreateBox(pod.name, { width: 2.2, height: 1.2, depth: 4 }, scene);
    mesh.position = new Vector3(pod.x, 1.5, pod.z);
    mesh.rotation.x = -Math.PI / 6;
    mesh.checkCollisions = true;
    mesh.material = m.equipment;
    // Decorative lids follow the original tilted shape without changing its collider.
    const lid = block(scene, pod.name + 'Lid', [1.85, 0.04, 3.35], [0, 0.62, 0], m.podGlass, false);
    lid.parent = mesh;
    for (const side of [-1, 1]) {
      const rail = block(scene, pod.name + 'Rail' + side, [0.08, 0.05, 3.5], [side * 1.02, 0.66, 0], pod.occupied ? m.blue : m.trim, false);
      rail.parent = mesh;
    }
    block(scene, pod.name + 'Plinth', [2.3, 0.3, 4.2], [pod.x, 0.15, pod.z], m.equipment);
    sign(scene, pod.name + 'Id', pod.name.replace('cryopod', 'CR-0'), [pod.x, 2.8, 6.95], 0.8).rotation.y = 0;
  }
}
