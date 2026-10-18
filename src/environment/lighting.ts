import { HemisphericLight, PointLight, SpotLight, ShadowGenerator, Vector3, Color3 } from '@babylonjs/core';
import type { Scene } from '@babylonjs/core';
import type { ShipMaterials } from './materials';
import { block } from './architecture';

export function createLighting(scene: Scene, m: ShipMaterials) {
  const ambient = new HemisphericLight('light', new Vector3(0,1,0), scene);
  ambient.intensity = 0.23; ambient.groundColor = new Color3(0.08,0.1,0.13);
  for (const material of scene.materials) {
    if ('maxSimultaneousLights' in material) material.maxSimultaneousLights = 8;
  }
  // Scope practical lighting to architectural regions; light cannot wash through partitions.
  const meshes = scene.meshes.filter(mesh => mesh.metadata?.exterior !== true);
  meshes.forEach(mesh => mesh.computeWorldMatrix(true));
  const zoneMeshes = (minZ: number, maxZ: number) => meshes.filter(mesh => {
    const bounds = mesh.getBoundingInfo().boundingBox;
    return bounds.maximumWorld.z >= minZ && bounds.minimumWorld.z <= maxZ;
  });
  const loungeFill = new HemisphericLight('crewSoftFill', new Vector3(0,1,0), scene);
  loungeFill.intensity = 0.5; loungeFill.diffuse = Color3.FromHexString('#d7e8ef');
  loungeFill.includedOnlyMeshes = zoneMeshes(-2.65,7.8);
  const bridgeFill = new HemisphericLight('bridgeSoftFill', new Vector3(0,1,0), scene);
  bridgeFill.intensity = 0.4; bridgeFill.diffuse = Color3.FromHexString('#c1ddeb');
  bridgeFill.includedOnlyMeshes = zoneMeshes(-26,-3.35);
  function practical(name: string, x: number, z: number, color: string, intensity: number, minZ: number, maxZ: number) {
    const light = new PointLight(name, new Vector3(x,4.8,z),scene);
    light.diffuse=Color3.FromHexString(color); light.intensity=intensity; light.range=13;
    light.includedOnlyMeshes=zoneMeshes(minZ,maxZ);
    block(scene,name+'Fixture',[1.7,0.07,0.22],[x,5.8,z],z>=8?m.amber:m.white,false);
  }
  for (const z of [-20,-12,-6]) practical('bridgeLight'+z,0,z,'#a8dce9',1.05,-26,-3.35);
  for (const x of [-3.8,3.8]) {
    for (const z of [1.5,6]) practical('loungeLight'+x+z,x,z,'#d5e6ed',1.1,-2.65,7.8);
  }
  for (const x of [-11,11]) practical('cryoLight'+x,x,3,'#a6c9d8',0.7,-1.5,7.5);
  for (const x of [-10.5,10.5]) practical('aftTaskLight'+x,x,12,'#e7a76a',0.65,8.2,15);
  const task = new SpotLight('engineeringOverhead',new Vector3(0,5.5,10),new Vector3(0,-1,0.3),Math.PI/1.6,2,scene);
  task.diffuse=Color3.FromHexString('#edc093');task.intensity=2;task.range=14;
  task.includedOnlyMeshes=zoneMeshes(8.2,15);
  const shadows = new ShadowGenerator(1024,task);
  shadows.usePercentageCloserFiltering=true; shadows.bias=0.002; shadows.normalBias=0.03;
  for (const mesh of meshes) {
    mesh.receiveShadows=true;
    if (mesh.checkCollisions && mesh.getBoundingInfo().boundingBox.maximumWorld.z>8 && mesh.getBoundingInfo().boundingBox.minimumWorld.z<15.2) shadows.addShadowCaster(mesh);
  }
  block(scene,'aftOverheadFixture',[1.2,0.12,0.6],[0,5.8,10],m.amber,false);
}
