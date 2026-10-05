import './style.css';
import {
  Engine,
  Scene,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3
} from '@babylonjs/core';

window.onload = function () {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;

  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);
  scene.collisionsEnabled = true;
  scene.gravity = new Vector3(0, -0.15, 0);

  const camera = new FreeCamera(
    'cam',
    new Vector3(0, 1.8, 0),
    scene
  );

  camera.attachControl(canvas, true);
  canvas.addEventListener('click', () => {canvas.requestPointerLock();});
  camera.speed = 0.23;
  camera.minZ = 0.05;
  camera.applyGravity = true;
  camera.checkCollisions = true;
  camera.ellipsoid = new Vector3(0.5, 0.9, 0.5);
  camera.ellipsoidOffset = new Vector3(0, 0.9, 0);
  camera.keysUp.push(87);
  camera.keysDown.push(83);
  camera.keysLeft.push(65);
  camera.keysRight.push(68);

  const light = new HemisphericLight(
    'light',
    new Vector3(0, 1, 0),
    scene
  );

  const floor = MeshBuilder.CreateGround(
    'floor',
    { width: 30, height: 30 },
    scene
  );

  floor.checkCollisions = true;

  // --- PAREDES DE PRUEBA DE LUNARIS-01 ---

const backWall = MeshBuilder.CreateBox(
  'backWall',
  { width: 30, height: 4, depth: 0.3 },
  scene
);
backWall.position = new Vector3(0, 2, 15);
backWall.checkCollisions = true;

const frontWall = MeshBuilder.CreateBox(
  'frontWall',
  { width: 30, height: 4, depth: 0.3 },
  scene
);
frontWall.position = new Vector3(0, 2, -15);
frontWall.checkCollisions = true;

const leftWall = MeshBuilder.CreateBox(
  'leftWall',
  { width: 0.3, height: 4, depth: 30 },
  scene
);
leftWall.position = new Vector3(-15, 2, 0);
leftWall.checkCollisions = true;

const rightWall = MeshBuilder.CreateBox(
  'rightWall',
  { width: 0.3, height: 4, depth: 30 },
  scene
);
rightWall.position = new Vector3(15, 2, 0);
rightWall.checkCollisions = true;

  const box = MeshBuilder.CreateBox('box', {size: 2}, scene);
  box.position.y = 0.5

  const mat = new StandardMaterial('mat', scene);
  mat.diffuseColor = new Color3(0.2, 0.6, 1);
  box.material = mat;

  // --- CRYOPODS: PRIMER BLOCKOUT ---

const cryopod1 = MeshBuilder.CreateBox(
  'cryopod1',
  { width: 2.2, height: 1.2, depth: 4 },
  scene
);

cryopod1.position = new Vector3(-3, 1.5, 13.5);
cryopod1.checkCollisions = true;
cryopod1.rotation.x = -Math.PI / 6;


const cryopod2 = MeshBuilder.CreateBox(
  'cryopod2',
  { width: 2.2, height: 1.2, depth: 4 },
  scene
);

cryopod2.position = new Vector3(3, 1.5, 13.5);
cryopod2.checkCollisions = true;
cryopod2.rotation.x = -Math.PI / 6;

  engine.runRenderLoop(function () {
    scene.render();
  });
};