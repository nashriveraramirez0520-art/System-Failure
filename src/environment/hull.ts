import { MeshBuilder, Vector3 } from '@babylonjs/core';
import type { Scene } from '@babylonjs/core';

// Original blockout: names, dimensions, transforms and collision flags preserved.
export function createHull(scene: Scene) {
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

  frontWall.setEnabled(false);
  

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

  //==========================================================
  // PROA LUNARIS-01
  //==========================================================
  
  const frontLeftHull = MeshBuilder.CreateBox('frontLeftHull',
    {
      width: 0.3,
      height: 4,
      depth: 14.5
    },
    scene
  );
  

  frontLeftHull.position = new Vector3(-10.2, 2, -20);
  frontLeftHull.rotation.y = -Math.PI / 4;
  frontLeftHull.checkCollisions = true;

  const frontRightHull = MeshBuilder.CreateBox(
    'frontRightHull',
    {
      width: 0.3,
      height: 4,
      depth: 14.5
    },
    scene
  );

  frontRightHull.position = new Vector3(10.2, 2, -20);
  frontRightHull.rotation.y = Math.PI / 4;
  frontRightHull.checkCollisions = true;

  const frontCenterHull = MeshBuilder.CreateBox(
    'frontCenterHull',
    {
      width: 7,
      height: 4,
      depth: 0.3
    },
    scene
  );

  frontCenterHull.position = new Vector3(0, 2, -25);
  frontCenterHull.checkCollisions = true;

  const frontLeftCurve = MeshBuilder.CreateBox(
    'frontLeftCurve',
    {
      width: 0.3,
      height: 4,
      depth: 5
    },
    scene
  );

  frontLeftCurve.position = new Vector3(-5.15, 2, -24.1);
  frontLeftCurve.rotation.y = -Math.PI / 3;
  frontLeftCurve.checkCollisions = true;
  
  const frontRightCurve = MeshBuilder.CreateBox(
    'frontRightCurve',
    {
      width: 0.3,
      height: 4,
      depth: 5
    },
    scene
  );

  frontRightCurve.position = new Vector3(5.15, 2, -24.1);
  frontRightCurve.rotation.y = Math.PI / 3;
  frontRightCurve.checkCollisions = true;

  const frontFloor = MeshBuilder.CreateBox(
    'frontFloor',
    {
      width: 30,
      height: 0.2,
      depth: 10
    },
    scene
  );

  frontFloor.position = new Vector3(0, -0.1, -20);
  frontFloor.checkCollisions = true;





}
