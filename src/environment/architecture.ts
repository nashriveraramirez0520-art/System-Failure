import { MeshBuilder, Vector3, DynamicTexture, StandardMaterial } from '@babylonjs/core';
import type { Scene, Material } from '@babylonjs/core';

// Decorative geometry never participates in the player's downward landing ray.
export function block(scene: Scene, name: string, size: [number, number, number],
  position: [number, number, number], material: Material, solid = true) {
  const mesh = MeshBuilder.CreateBox(name, { width: size[0], height: size[1], depth: size[2] }, scene);
  mesh.position = new Vector3(...position);
  mesh.material = material;
  mesh.checkCollisions = solid;
  mesh.isPickable = solid;
  mesh.metadata = { groundRayIgnore: !solid, blocksHead: solid };
  return mesh;
}

export function sign(scene: Scene, name: string, text: string, position: [number, number, number], width = 4) {
  const texture = new DynamicTexture(name + 'Text', { width: 1024, height: 256 }, scene, false);
  texture.drawText(text, null, 155, 'bold 64px sans-serif', '#bce9ef', '#14232d', true);
  const material = new StandardMaterial(name + 'Material', scene);
  material.diffuseTexture = texture;
  material.emissiveTexture = texture;
  material.backFaceCulling = false;
  const mesh = MeshBuilder.CreatePlane(name, { width, height: width / 4 }, scene);
  mesh.position = new Vector3(...position);
  // Players approach from aft (+Z); text faces the opening route.
  mesh.rotation.y = Math.PI;
  mesh.material = material;
  mesh.isPickable = false;
  return mesh;
}

export function consoleStation(scene: Scene, name: string, x: number, z: number,
  body: Material, accent: Material, screen: Material) {
  block(scene, name + 'Base', [2, 1.15, 1.1], [x, 0.575, z], body);
  block(scene, name + 'Edge', [2.1, 0.08, 1.2], [x, 1.19, z], accent, false);
  const display = block(scene, name + 'Display', [1.8, 0.7, 0.12], [x, 1.6, z - 0.4], screen, false);
  display.rotation.x = -0.2;
}
