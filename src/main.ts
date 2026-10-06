import './style.css';
import { io } from 'socket.io-client';
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

  // =========================================================
  // MULTIPLAYER - SOCKET.IO
  // =========================================================

  const socket = io('http://localhost:3000');

  const createRoomButton = document.getElementById(
    'createRoomButton'
  ) as HTMLButtonElement;

  const joinRoomButton = document.getElementById(
    'joinRoomButton'
  ) as HTMLButtonElement;

  const roomCodeInput = document.getElementById(
    'roomCodeInput'
  ) as HTMLInputElement;

  const roomStatus = document.getElementById(
    'roomStatus'
  ) as HTMLParagraphElement;

  socket.on('connect', () => {
    console.log(`Conectado al servidor LUNARIS-01: ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log('Desconectado del servidor LUNARIS-01');
  });

  socket.on('room-created', (roomCode) => {
    console.log(`Sala creada: ${roomCode}`);
    roomStatus.textContent = `Room created: ${roomCode}`;
  });

  socket.on('room-joined', (roomCode) => {
    console.log(`Entraste a la sala: ${roomCode}`);
    roomStatus.textContent = `Joined room: ${roomCode}`;
  });

  socket.on('players-ready', () => {
    console.log('¡Los dos jugadores están listos!');
    roomStatus.textContent = '2/2 PLAYERS READY';
  });

  socket.on('join-error', (message) => {
    console.error(`Error al entrar: ${message}`);
    roomStatus.textContent = message;
  });

  createRoomButton.addEventListener('click', () => {
    socket.emit('create-room');
  });

  joinRoomButton.addEventListener('click', () => {
    const roomCode = roomCodeInput.value.trim().toUpperCase();

    if (!roomCode) {
      roomStatus.textContent = 'Enter a room code.';
      return;
    }

    socket.emit('join-room', roomCode);
  });

  // =========================================================
  // BABYLON.JS
  // =========================================================

  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  scene.collisionsEnabled = true;
  scene.gravity = new Vector3(0, -0.15, 0);

  // =========================================================
  // CAMERA / PLAYER
  // =========================================================

  const camera = new FreeCamera(
    'cam',
    new Vector3(0, 1.8, 0),
    scene
  );

  camera.attachControl(canvas, true);

  canvas.addEventListener('click', () => {
    canvas.requestPointerLock();
  });

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

  // =========================================================
  // LIGHT
  // =========================================================

  new HemisphericLight(
    'light',
    new Vector3(0, 1, 0),
    scene
  );

  // =========================================================
  // FLOOR
  // =========================================================

  const floor = MeshBuilder.CreateGround(
    'floor',
    {
      width: 30,
      height: 30
    },
    scene
  );

  floor.checkCollisions = true;

  // =========================================================
  // WALLS - LUNARIS-01 BLOCKOUT
  // =========================================================

  const backWall = MeshBuilder.CreateBox(
    'backWall',
    {
      width: 30,
      height: 4,
      depth: 0.3
    },
    scene
  );

  backWall.position = new Vector3(0, 2, 15);
  backWall.checkCollisions = true;

  const frontWall = MeshBuilder.CreateBox(
    'frontWall',
    {
      width: 30,
      height: 4,
      depth: 0.3
    },
    scene
  );

  frontWall.position = new Vector3(0, 2, -15);
  frontWall.checkCollisions = true;

  const leftWall = MeshBuilder.CreateBox(
    'leftWall',
    {
      width: 0.3,
      height: 4,
      depth: 30
    },
    scene
  );

  leftWall.position = new Vector3(-15, 2, 0);
  leftWall.checkCollisions = true;

  const rightWall = MeshBuilder.CreateBox(
    'rightWall',
    {
      width: 0.3,
      height: 4,
      depth: 30
    },
    scene
  );

  rightWall.position = new Vector3(15, 2, 0);
  rightWall.checkCollisions = true;

  // =========================================================
  // NUESTRO CUBITO AZUL 💙
  // =========================================================

  const box = MeshBuilder.CreateBox(
    'box',
    { size: 2 },
    scene
  );

  box.position.y = 0.5;

  const mat = new StandardMaterial('mat', scene);

  mat.diffuseColor = new Color3(
    0.2,
    0.6,
    1
  );

  box.material = mat;

  // =========================================================
  // CRYOPODS - PRIMER BLOCKOUT
  // =========================================================

  const cryopod1 = MeshBuilder.CreateBox(
    'cryopod1',
    {
      width: 2.2,
      height: 1.2,
      depth: 4
    },
    scene
  );

  cryopod1.position = new Vector3(
    -3,
    1.5,
    13.5
  );

  cryopod1.checkCollisions = true;
  cryopod1.rotation.x = -Math.PI / 6;

  const cryopod2 = MeshBuilder.CreateBox(
    'cryopod2',
    {
      width: 2.2,
      height: 1.2,
      depth: 4
    },
    scene
  );

  cryopod2.position = new Vector3(
    3,
    1.5,
    13.5
  );

  cryopod2.checkCollisions = true;
  cryopod2.rotation.x = -Math.PI / 6;

  // =========================================================
  // GAME LOOP
  // =========================================================

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });
};