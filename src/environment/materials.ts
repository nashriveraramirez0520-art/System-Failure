import { Color3, StandardMaterial } from '@babylonjs/core';
import type { Scene } from '@babylonjs/core';
export function createMaterials(scene: Scene) {
  function material(name: string, color: string, glow = false) {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = Color3.FromHexString(color);
    m.specularColor = new Color3(0.15, 0.18, 0.2);
    if (glow) m.emissiveColor = m.diffuseColor.scale(0.8);
    return m;
  }
  return {
    wall: material('shipWall', '#344854'),
    floor: material('shipDeck', '#202c35'),
    ceiling: material('shipCeiling', '#192630'),
    trim: material('shipRibs', '#607580'),
    equipment: material('equipment', '#293840'),
    blue: material('operationsAccent', '#46bddb', true),
    amber: material('engineeringAccent', '#e7a14c', true),
    white: material('commonAccent', '#b4e2e8', true),
    fabric: material('crewUpholstery', '#405966'),
    podGlass: material('podLid', '#183642'),
    screen: material('inactiveDisplay', '#11232e'),
  };
}
export type ShipMaterials = ReturnType<typeof createMaterials>;
