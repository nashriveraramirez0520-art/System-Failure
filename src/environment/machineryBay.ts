import { Color3, Mesh, MeshBuilder, PointLight, Quaternion, ShadowGenerator, SpotLight, TransformNode, Vector3 } from '@babylonjs/core';
import type { Material, Scene } from '@babylonjs/core';
import type { ShipMaterials } from './materials';
import { block, sign } from './architecture';

// Physical systems have stable names and grouping nodes for later interaction work.
// They intentionally contain no input handlers, state machines or failure logic.
export function createMachineryBay(scene: Scene, m: ShipMaterials) {
  const start = scene.meshes.length;
  const systems = {
    coolant: new TransformNode('machineryCoolant', scene),
    power: new TransformNode('machineryPower', scene),
    ventilation: new TransformNode('machineryVentilation', scene),
    pumps: new TransformNode('machineryPumps', scene),
  };
  for (const [id,node] of Object.entries(systems)) node.metadata = { systemId: id };

  // A short enclosed throat follows the existing starboard service doorway.
  block(scene,'machineryThroatFloor',[3.2,0.2,2],[10.5,-0.1,16],m.floor);
  for (const x of [8.75,12.25]) block(scene,'machineryThroatWall'+x,[0.3,5.5,2.3],[x,2.75,16.05],m.wall);
  block(scene,'machineryThroatCeiling',[3.8,0.2,2],[10.5,5.6,16],m.ceiling);
  block(scene,'machineryDeck',[9,0.2,14.2],[10.5,-0.1,24.1],m.floor);
  block(scene,'machineryCeiling',[9.3,0.25,14.2],[10.5,5.625,24.1],m.ceiling);
  for (const x of [6,15]) block(scene,'machinerySideWall'+x,[0.3,5.5,14.3],[x,2.75,24.05],m.wall);
  block(scene,'machineryRearWall',[9.3,5.5,0.3],[10.5,2.75,31.1],m.wall);
  // Front wall seals the shoulders; the throat is the only connection to Control.
  block(scene,'machineryFrontLeft',[2.9,5.5,0.3],[7.45,2.75,17],m.wall);
  block(scene,'machineryFrontRight',[2.9,5.5,0.3],[13.55,2.75,17],m.wall);
  block(scene,'machineryFrontLintel',[3.2,1.2,0.3],[10.5,4.9,17],m.wall);

  function pipe(name: string, path: number[][], radius: number, material: Material, parent: TransformNode) {
    const tube = MeshBuilder.CreateTube(name, {
      path: path.map(p => new Vector3(p[0],p[1],p[2])), radius, tessellation: 10, cap: Mesh.CAP_ALL,
    }, scene);
    tube.material=material;tube.parent=parent;tube.isPickable=false;
    tube.metadata={ groundRayIgnore:true, blocksHead:true };
    return tube;
  }
  function cylinder(name: string, x: number, y: number, z: number, diameter: number, height: number, parent: TransformNode) {
    const mesh=MeshBuilder.CreateCylinder(name,{diameter,height,tessellation:16},scene);
    mesh.position.set(x,y,z);mesh.material=m.trim;mesh.parent=parent;mesh.checkCollisions=true;
    mesh.metadata={blocksHead:true};return mesh;
  }

  // Port coolant reservoirs, large feed/return lines and readable hand-wheel valves.
  for (const [i,z] of [20,25,28.8].entries()) {
    cylinder('coolantTank'+i,7.5,1.65,z,1.7,3.3,systems.coolant);
    for (const y of [0.45,2.9]) {
      const band=MeshBuilder.CreateTorus('tankBand'+i+y,{diameter:1.73,thickness:0.09,tessellation:16},scene);
      band.position.set(7.5,y,z);band.material=m.equipment;band.parent=systems.coolant;band.isPickable=false;
    }
    pipe('tankFeed'+i,[[7.5,3.3,z],[7.5,4.2,z],[6.5,4.2,z]],0.16,m.trim,systems.coolant);
    pipe('tankOutlet'+i,[[7.5,0.8,z],[8.5,0.8,z],[8.5,1.6,z]],0.1,m.trim,systems.coolant);
    const wheel=MeshBuilder.CreateTorus('coolantValve'+i,{diameter:0.5,thickness:0.07,tessellation:12},scene);
    wheel.position.set(8.5,1.65,z);wheel.rotation.x=Math.PI/2;wheel.material=m.amber;wheel.parent=systems.coolant;wheel.isPickable=false;
    const hub=block(scene,'valveHub'+i,[0.09,0.45,0.09],[8.5,1.65,z],m.trim,false);hub.parent=systems.coolant;
    sign(scene,'coolantTankId'+i,'CLT-0'+(i+1),[7.5,2.4,z-0.86],0.55).parent=systems.coolant;
  }
  for (const [i,y] of [1,3.7,4.6].entries()) {
    pipe('coolantMain'+i,[[6.4,y,17.5],[6.4,y,30.4],[8,y,30.4]],i===1?0.22:0.1,m.trim,systems.coolant);
  }

  // Starboard power cabinets, pumps and motor housings. Central aisle stays clear.
  for (const [i,z] of [19.8,24,28.3].entries()) {
    const cabinet=block(scene,'powerCabinet'+i,[1.25,2.8,1.45],[14.1,1.4,z],m.equipment);cabinet.parent=systems.power;
    block(scene,'cabinetRecess'+i,[0.06,2.3,1.1],[13.44,1.5,z],m.screen,false).parent=systems.power;
    block(scene,'cabinetWarning'+i,[0.08,0.6,0.06],[13.38,2.2,z-0.4],m.amber,false).parent=systems.power;
    const skid=block(scene,'pumpSkid'+i,[1.4,0.25,1.6],[12.5,0.125,z],m.equipment);skid.parent=systems.pumps;
    const motor=cylinder('pumpMotor'+i,12.6,0.85,z,0.8,1.25,systems.pumps);
    motor.rotationQuaternion=Quaternion.RotationAxis(Vector3.Right(),Math.PI/2);
    pipe('pumpFeed'+i,[[12.6,0.85,z-0.7],[12.6,0.85,z-1.1],[14.5,0.85,z-1.1]],0.13,m.trim,systems.pumps);
    pipe('powerCable'+i,[[14.65,3.4,z],[14.65,4.5,z],[12.9,4.5,z]],0.045,m.amber,systems.power);
    sign(scene,'pumpId'+i,'PMP-0'+(i+1),[12.6,1.5,z-0.86],0.5).parent=systems.pumps;
  }
  block(scene,'overheadDuct',[1.1,0.65,12.5],[13.2,4.9,24],m.equipment).parent=systems.ventilation;
  for (const z of [18.5,22,25.5,29]) {
    block(scene,'ductCollar'+z,[1.2,0.12,0.75],[13.2,4.9,z],m.trim,false).parent=systems.ventilation;
    block(scene,'cableTray'+z,[1.3,0.1,0.65],[7.5,4.9,z],m.equipment,false).parent=systems.power;
    pipe('overheadCoolant'+z,[[6.5,4.5,z],[9,4.5,z],[9,4.8,z+0.5],[12.3,4.8,z+0.5]],0.12,m.trim,systems.coolant);
  }
  for (const z of [18,22,26,30]) {
    for (const x of [6.3,14.7]) block(scene,'machinerySupport'+x+z,[0.3,5.4,0.25],[x,2.7,z],m.trim);
    block(scene,'machineryRoofRib'+z,[8.7,0.18,0.3],[10.5,5.35,z],m.trim,false);
    // Visible deck access plates with no raised collision seams.
    block(scene,'maintenanceDeckPlate'+z,[2.2,0.015,1.2],[10.5,0.012,z],m.equipment,false);
  }
  for (const x of [9.2,11.5]) block(scene,'aisleEdge'+x,[0.04,0.015,12.2],[x,0.012,24],m.amber,false);
  block(scene,'maintenanceToolbox',[1,0.55,0.6],[12.9,0.275,30.3],m.equipment);

  const bayMeshes=scene.meshes.slice(start);
  bayMeshes.forEach(mesh=>{mesh.receiveShadows=true;mesh.computeWorldMatrix(true);});
  for (const z of [18.5,24,29]) {
    block(scene,'machineryPractical'+z,[0.7,0.08,0.3],[10.5,5.25,z],m.amber,false);
    const light=new PointLight('machineryWorkLight'+z,new Vector3(10.5,4.2,z),scene);
    light.diffuse=Color3.FromHexString('#f0b479');light.intensity=0.85;light.range=8;
    light.includedOnlyMeshes=bayMeshes;
  }
  const task=new SpotLight('machineryTaskSpot',new Vector3(10.5,5.1,24),new Vector3(-0.4,-1,0),Math.PI/1.7,2,scene);
  task.diffuse=Color3.FromHexString('#e7b885');task.intensity=1.5;task.range=10;task.includedOnlyMeshes=bayMeshes;
  const shadow=new ShadowGenerator(512,task);shadow.usePercentageCloserFiltering=true;shadow.bias=0.002;
  for (const mesh of bayMeshes) if(mesh.checkCollisions) shadow.addShadowCaster(mesh);
  return systems;
}
