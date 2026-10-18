import { Color3, Color4, Mesh, MeshBuilder, StandardMaterial, Vector3, VertexData } from '@babylonjs/core';
import type { Scene } from '@babylonjs/core';

// Two static draw calls surround the entire ship. No textures, downloads or per-frame work.
export function createSpaceEnvironment(scene: Scene) {
  scene.clearColor = new Color4(0.002, 0.004, 0.009, 1);
  const sky = MeshBuilder.CreateSphere('spaceSurround', { diameter: 700, segments: 16, sideOrientation: Mesh.BACKSIDE }, scene);
  const darkness = new StandardMaterial('spaceBlack', scene);
  darkness.disableLighting = true; darkness.emissiveColor = new Color3(0.002, 0.004, 0.009);
  sky.material = darkness; sky.isPickable = false; sky.metadata = { exterior: true };

  const positions: number[] = [], indices: number[] = [];
  let seed = 1731;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 1500; i++) {
    const y = random() * 2 - 1, azimuth = random() * Math.PI * 2;
    const horizontal = Math.sqrt(1 - y*y);
    const direction = new Vector3(horizontal*Math.cos(azimuth), y, horizontal*Math.sin(azimuth));
    const center = direction.scale(240 + random()*30);
    const tangent = Vector3.Cross(Math.abs(y) < 0.9 ? Vector3.Up() : Vector3.Right(), direction).normalize();
    const bitangent = Vector3.Cross(direction, tangent).normalize();
    const radius = 0.10 + random()*0.28, first = positions.length/3;
    for (const [u,v] of [[-1,-1],[1,-1],[1,1],[-1,1]]) {
      const point = center.add(tangent.scale(u*radius)).add(bitangent.scale(v*radius));
      positions.push(point.x,point.y,point.z);
    }
    indices.push(first,first+1,first+2,first,first+2,first+3);
  }
  const stars = new Mesh('surroundingStars', scene);
  const data = new VertexData(); data.positions=positions;data.indices=indices;data.applyToMesh(stars);
  const glow = new StandardMaterial('starGlow', scene);
  glow.disableLighting=true;glow.emissiveColor=new Color3(0.65,0.78,0.9);glow.backFaceCulling=false;
  stars.material=glow;stars.isPickable=false;stars.metadata={ exterior: true };
}
