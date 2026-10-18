import { Mesh, VertexData } from '@babylonjs/core';
import type { Scene } from '@babylonjs/core';
import type { ShipMaterials } from './materials';
import { block } from './architecture';
import { layout } from './layout';

export function createCeiling(scene: Scene, m: ShipMaterials) {
  // Separate roof sections allow each area's lights to affect only that section.
  for (const [name,z,depth] of [['Forward',-9,12],['Crew',2.5,11],['Aft',11.6,7.2]] as const) {
    block(scene, 'mainCeiling' + name, [30.4,0.25,depth], [0,layout.ceilingY+0.125,z],m.ceiling);
  }
  // Envelope covers the full rotated wall thickness, not merely the segment centers.
  // Meet the main roof at Z=-15 without coplanar overlapping underside faces.
  const points = [[-15.7,-15],[15.7,-15],[5.6,-25.65],[-5.6,-25.65]];
  const mesh = new Mesh('proaCeiling', scene);
  const data = new VertexData();
  data.positions = points.flatMap(([x,z]) => [x, layout.ceilingY, z]);
  data.indices = [0,2,1,0,3,2];
  data.normals = points.flatMap(() => [0,-1,0]);
  data.applyToMesh(mesh);
  m.ceiling.backFaceCulling = false;
  mesh.material = m.ceiling; mesh.checkCollisions = true;
  mesh.metadata = { blocksHead: true };
  // Window headers already extend to the roof. Do not clone coplanar upper
  // window walls. The replacement rear partition is also already full height.
  const originalWalls = ['leftWall','rightWall','frontLeftHull','frontRightHull'];
  for (const name of originalWalls) {
    const original = scene.getMeshByName(name)!;
    const upper = original.clone(name + 'Upper', null, true)!;
    upper.scaling.y = 0.5; upper.position.y = 5;
    upper.material = m.wall; upper.checkCollisions = true;
    upper.metadata = { blocksHead: true };
  }
  for (const z of [-14,-10,-6,0,6,9,12]) {
    block(scene, 'ceilingRib' + z, [29.5, 0.18, 0.22], [0, 5.88, z], m.trim, false);
    for (const side of [-1,1]) {
      const brace = block(scene, 'ceilingHaunch' + side + z, [1.1,0.2,0.3], [side*14.3,5.5,z],m.trim,false);
      brace.rotation.z=side*Math.PI/4;
    }
  }
  for (const [z,width] of [[-18,23],[-21,17],[-24,11]]) {
    block(scene, 'bowRoofRib' + z, [width,0.18,0.24], [0,5.86,z],m.trim,false);
  }
}
