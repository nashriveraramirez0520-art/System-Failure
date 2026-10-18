import './style.css';
import { playerSpawns } from './environment/layout';
import { createLunarisInterior } from './environment/createLunarisInterior';
import { io } from 'socket.io-client';
import {
  Engine,
  Scene,
  FreeCamera,
  Vector3,
  Ray,
  MeshBuilder,
  StandardMaterial,
  Color3
} from '@babylonjs/core';

window.onload = function () {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;

  // =========================================================
  // MULTIPLAYER - SOCKET.IO
  // =========================================================

  const socket = io();

  socket.on('connect', () => {
  console.log('Socket transport:', socket.io.engine.transport.name);

  socket.io.engine.on('upgrade', (transport) => {
    console.log('Socket upgraded to:', transport.name);
  });
});

  let remotePlayer: any = null;

  type PlayerSnapshot = {
    time: number;
    position: Vector3;
  };

  const remotePlayerSnapshots: PlayerSnapshot[] = [];

  let verticalVelocity = 0;
  let horizontalVelocity = Vector3.Zero();
  let isGrounded = true;

  const jumpForce = 0.18;
  const gravityForce = 0.012;

  const floorCameraY = 1.8;
  const landingOffset = 1.153;
  const landingDetectionDistance = 1.85;

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

  let myPlayerRole = '';

  socket.on('player-role', (role) => {
    myPlayerRole = role;
    console.log(`My player role: ${myPlayerRole}`);

    if (myPlayerRole === 'player1') {
      camera.position.set(playerSpawns.player1.x, playerSpawns.player1.y, playerSpawns.player1.z);
      camera.rotation.set(0, Math.PI + Math.PI / 16, 0);
    }

    if (myPlayerRole === 'player2') {
      camera.position.set(playerSpawns.player2.x, playerSpawns.player2.y, playerSpawns.player2.z);
      camera.rotation.set(0, Math.PI + Math.PI / 16, 0);
    }
  });

  socket.on('join-error', (message) => {
    console.error(`Error al entrar: ${message}`);
    roomStatus.textContent = message;
  });

  let lastReceivedMovement = performance.now();

  socket.on('player-moved', (playerData) => {

   const nowReived = performance.now();
   console.log(nowReived - lastReceivedMovement);
   lastReceivedMovement = nowReived;

    if (!remotePlayer) {
      return;
    }

   remotePlayerSnapshots.push({
    time: performance.now(),
    position: new Vector3(
      playerData.position.x,
      playerData.position.y - 0.9,
      playerData.position.z
    )
   });

   if (remotePlayerSnapshots.length > 20) {
    remotePlayerSnapshots.shift();
   }

    remotePlayer.rotation.y = playerData.rotation.y;
    remotePlayerHead.rotation.x = playerData.rotation.x;
  });

  socket.on('player-left', () => {
    if (!remotePlayer) {
      return;
    }

    remotePlayer.position.set(0, -10, 0);
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

  camera.applyGravity = false;
  camera.checkCollisions = true;

  camera.ellipsoid = new Vector3(0.5, 0.9, 0.5);
  camera.ellipsoidOffset = new Vector3(0, 0.9, 0);

  // Babylon default WASD movement disabled.
  // camera.keysUp.push(87);
  // camera.keysDown.push(83);
  // camera.keysLeft.push(65);
  // camera.keysRight.push(68);

  const keysPressed = new Set<string>();

  window.addEventListener('keydown', (event) => {
    keysPressed.add(event.code);
  });

  window.addEventListener('keyup', (event) => {
    keysPressed.delete(event.code);
  });

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && isGrounded && !event.repeat) {
      verticalVelocity = jumpForce;
      isGrounded = false;
    }
  });

  createLunarisInterior(scene);

  // =========================================================
  // REMOTE PLAYER
  // =========================================================

  remotePlayer = MeshBuilder.CreateCapsule(
    'remotePlayer',
    {
      height: 1.8,
      radius: 0.4
    },
    scene
  );

  remotePlayer.position = new Vector3(0, -10, 0);

  const remotePlayerMaterial = new StandardMaterial(
    'remotePlayerMaterial',
    scene
  );

  remotePlayerMaterial.diffuseColor = new Color3(
    1,
    0.25,
    0.25
  );

  remotePlayer.material = remotePlayerMaterial;

  //==========================================================
  // REMOTE PLAYER - HEAD
  //==========================================================

  const remotePlayerHead = MeshBuilder.CreateSphere('remotePlayerHead', { diameter: 0.75 }, scene);
  remotePlayerHead.parent = remotePlayer;
  remotePlayerHead.position = new Vector3(0, 1.05, 0);

  remotePlayerHead.material = remotePlayerMaterial;
  
  //==========================================================
  // REMOTE PLAYER - VISOR
  //==========================================================

  const remotePlayerVisor = MeshBuilder.CreateBox('remotePlayerVisor',
    {
      width: 0.5,
      height: 0.22,
      depth: 0.08
    }, scene);
  
    remotePlayerVisor.parent = remotePlayerHead;
    remotePlayerVisor.position = new Vector3(0, 0, 0.37);

    const remotePlayerVisorMaterial = new StandardMaterial('remotePlayerVisorMaterial', scene);
    remotePlayerVisorMaterial.diffuseColor = new Color3(0.05, 0.1, 0.15);
    remotePlayerVisor.material = remotePlayerVisorMaterial;

  // =========================================================
  // GAME LOOP
  // =========================================================

  let lastMovementUpdate = 0;

  engine.runRenderLoop(() => {
    // ========================================================
    // PLAYER MOVEMENT
    // ========================================================

    const walkSpeed = 0.008;
    const sprintSpeed = 0.018;

    const forward = camera.getDirection(new Vector3(0, 0, 1));
    forward.y = 0;
    forward.normalize();

    const right = camera.getDirection(new Vector3(1, 0, 0));
    right.y = 0;
    right.normalize();

    const movement = Vector3.Zero();

    if (keysPressed.has('KeyW')) {
      movement.addInPlace(forward);
    }

    if (keysPressed.has('KeyS')) {
      movement.subtractInPlace(forward);
    }

    if (keysPressed.has('KeyD')) {
      movement.addInPlace(right);
    }

    if (keysPressed.has('KeyA')) {
      movement.subtractInPlace(right);
    }

    // --------------------------------------------------------
    // MOVEMENT INPUT
    // --------------------------------------------------------

    if (movement.lengthSquared() > 0) {
      movement.normalize();

      const currentSpeed =
        keysPressed.has('ShiftLeft') ||
        keysPressed.has('ShiftRight')
          ? sprintSpeed
          : walkSpeed;

      movement.scaleInPlace(currentSpeed);

      // While grounded, remember our current horizontal speed.
      // This becomes our momentum when we leave the ground.
      if (isGrounded) {
        horizontalVelocity.copyFrom(movement);
        camera.cameraDirection.addInPlace(movement);
      }
    }

    if (
      isGrounded &&
      !keysPressed.has('KeyW') &&
      !keysPressed.has('KeyS') &&
      !keysPressed.has('KeyA') &&
      !keysPressed.has('KeyD') 
    ) {
      horizontalVelocity.set(0, 0, 0);
    }

    // --------------------------------------------------------
    // AIR MOMENTUM + AIR CONTROL
    // --------------------------------------------------------

    if (!isGrounded) {
      // Momentum continues even when WASD is released.
      camera.cameraDirection.addInPlace(horizontalVelocity);

      // WASD can still make a limited directional correction.
      if (movement.lengthSquared() > 0) {
        const airControl = movement.clone();

        const sameDirection =
          Vector3.Dot(
            horizontalVelocity.normalizeToNew(),
            airControl.normalizeToNew()
          ) > 0.95;

        // Avoid doubling our speed when input points in
        // essentially the same direction as our momentum.
        if (!sameDirection) {
          camera.cameraDirection.addInPlace(airControl);
        }
      }
    }

    // ========================================================
    // JUMP PHYSICS
    // ========================================================

    const groundRay = new Ray(
      camera.position,
      new Vector3(0, -1, 0),
      2
    );

    const groundHit = scene.pickWithRay(groundRay, (mesh) => mesh.isPickable && mesh.isEnabled() && mesh.metadata?.groundRayIgnore !== true);

    const hasGroundBelow =
      groundHit?.hit === true &&
      groundHit.distance <= landingDetectionDistance;

    if (isGrounded && !hasGroundBelow) {
      isGrounded = false;
      verticalVelocity = 0;
    }

    if (!isGrounded) {
      if (verticalVelocity > 0) {
        const headClearance = 1.8; // Matches ellipsoid + offset above the camera.
        const ceilingHit = scene.pickWithRay(
          new Ray(camera.position, Vector3.Up(), headClearance + verticalVelocity),
          (mesh) => mesh.isEnabled() && mesh.metadata?.blocksHead === true
        );
        if (ceilingHit?.hit && ceilingHit.distance < headClearance + verticalVelocity) {
          verticalVelocity = Math.max(0, ceilingHit.distance - headClearance - 0.01);
          camera.position.y += verticalVelocity;
          verticalVelocity = 0;
        } else {
          camera.position.y += verticalVelocity;
        }
      } else {
        camera.position.y += verticalVelocity;
      }
      verticalVelocity -= gravityForce;

      if (
        verticalVelocity <= 0 &&
        groundHit?.hit === true &&
        groundHit.distance <= landingDetectionDistance
      ) {
        if (groundHit.pickedPoint) {
          camera.position.y =
            groundHit.pickedPoint.y + landingOffset;
        }

        verticalVelocity = 0;
        isGrounded = true;
      }

      if (camera.position.y <= floorCameraY) {
        camera.position.y = floorCameraY;
        verticalVelocity = 0;
        isGrounded = true;
      }
    }

    // ========================================================
    // REMOTE PLAYER SMOOTHING
    // ========================================================

    if (remotePlayer && remotePlayerSnapshots.length >= 2)
    {
      const interpolationDelay = 100;
      const renderTime = performance.now() - interpolationDelay;

      while (
        remotePlayerSnapshots.length >= 2 && remotePlayerSnapshots[1].time <= renderTime
      ) {
        remotePlayerSnapshots.shift();
      }

      if (remotePlayerSnapshots.length >= 2) {
        const olderSnapshot = remotePlayerSnapshots[0];
        const newerSnapshot = remotePlayerSnapshots[1];

        const snapshotDuration = newerSnapshot.time - olderSnapshot.time;

        if (snapshotDuration > 0) {
          const interpolationAmount = (renderTime - olderSnapshot.time) / snapshotDuration;

          const clampedAmount = Math.max(
            0,
            Math.min(1, interpolationAmount)
          );
            remotePlayer.position = Vector3.Lerp(
              olderSnapshot.position,
              newerSnapshot.position,
              clampedAmount
            );
          
        }
      }
    }

    // ========================================================
    // NETWORK MOVEMENT UPDATE
    // ========================================================

    const now = performance.now();

    if (now - lastMovementUpdate >= 33) {
  console.log('SEND', now - lastMovementUpdate);

  lastMovementUpdate = now;

  socket.emit('player-move', {
        position: {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z
        },

        rotation: {
          x: camera.rotation.x,
          y: camera.rotation.y
        }
      });
    }

    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });
}