// Headless architecture checks. The canvas stub supports labels, not visual rendering.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
global.OffscreenCanvas = class {
  constructor(width, height) { this.width = width; this.height = height; }
  getContext() { return { measureText: text => ({ width: text.length * 32 }), fillRect() {}, clearRect() {}, fillText() {} }; }
};
const B = require('@babylonjs/core');
const scene = new B.Scene(new B.NullEngine());
const root = path.join(__dirname, '../src/environment');
const { raisedBulkhead, cryoDoors } = require(path.join(root, 'createLunarisInterior.ts')).createLunarisInterior(scene);
const { playerSpawns, crewPods } = require(path.join(root, 'layout.ts'));
scene.meshes.forEach(mesh => mesh.computeWorldMatrix(true));
const assert = (condition, message) => { if (!condition) throw Error(message); };
const solid = mesh => mesh.isEnabled() && mesh.checkCollisions;
function ray(a, b, predicate = solid) {
  const origin = new B.Vector3(...a), delta = new B.Vector3(...b).subtract(origin);
  return scene.pickWithRay(new B.Ray(origin, delta.normalizeToNew(), delta.length()), predicate);
}
function route(points, name) {
  for (let i = 1; i < points.length; i++) {
    // Parallel sweeps cover a player-width envelope at three heights.
    for (const lateral of [-0.48, 0, 0.48]) for (const y of [0.95, 1.8, 2.65]) {
      const a = points[i - 1], b = points[i], dx = b[0] - a[0], dz = b[1] - a[1], length = Math.hypot(dx, dz);
      const offset = [-dz / length * lateral, dx / length * lateral];
      const hit = ray([a[0] + offset[0], y, a[1] + offset[1]], [b[0] + offset[0], y, b[1] + offset[1]]);
      assert(!hit?.hit, name + ' blocked by ' + hit?.pickedMesh?.name);
    }
  }
}
try {
  for (const [role, p] of Object.entries(playerSpawns)) {
    assert(!ray([p.x, p.y, p.z], [p.x, p.y + 1.8, p.z])?.hit, role + ' headroom');
    assert(ray([p.x, p.y, p.z], [p.x, p.y - 2, p.z])?.hit, role + ' pod support');
  }
  assert(crewPods.length === 4 && cryoDoors.length === 2, 'crew fixtures missing');
  assert(!scene.getMeshByName('box').checkCollisions, 'Cubito changed');
  for (const side of [-1, 1]) {
    route([[side * 10, 1.6], [side * 3.5, 1.6], [side * 3.5, -1.8], [side * 2, -1.8], [side * 2, -10], [0, -10], [0, -23]], 'cryo -> command ' + side);
    route([[side * 10, 1.6], [side * 3.5, 1.6], [side * 3.5, 7], [side * 2.8, 7], [side * 2.8, 12.3]], 'cryo -> aft ' + side);
    for (const z of [-0.8, 4, 6.8]) assert(ray([side * 6, 1.8, z], [side * 8, 1.8, z])?.hit, 'cryo alternate exit');
  }
  for (let x = -14.5; x <= 14.5; x += 0.25) {
    if (Math.abs(x) < 2.9) continue;
    assert(ray([x, 1.8, -2], [x, 1.8, -4])?.hit, 'bulkhead side bypass ' + x);
  }
  // Test hypothetical closed positions only in this disposable scene. No game logic is added.
  raisedBulkhead.position.y = 2.15; raisedBulkhead.computeWorldMatrix(true);
  for (let x = -14.5; x <= 14.5; x += 0.25) assert(ray([x, 1.8, -2], [x, 1.8, -4])?.hit, 'closed boundary leak ' + x);
  for (const door of cryoDoors) { door.position.y = 2.15; door.computeWorldMatrix(true); }
  for (const side of [-1, 1]) for (const z of [0.3, 1.6, 2.9]) assert(ray([side * 6, 1.8, z], [side * 8, 1.8, z])?.hit, 'closed cryo doorway leak');
  let roofSamples = 0;
  for (let z = -25; z < 14.8; z += 0.5) {
    const width = z < -15 ? 15.1 + (z + 15) * 1.025 : 14.7;
    for (let x = -width + 0.3; x < width - 0.3; x += 0.5) {
      assert(ray([x, 4, z], [x, 6.4, z], mesh => solid(mesh) && /Ceiling|Upper/.test(mesh.name))?.hit, 'roof hole at ' + x + ',' + z);
      roofSamples++;
    }
  }
  for (const name of ['frontCenterHull','frontLeftCurve','frontRightCurve']) {
    const collider=scene.getMeshByName(name),glass=scene.getMeshByName(name+'Glazing');
    assert(collider.checkCollisions && !collider.isVisible, 'collision-only window hull');
    assert(glass.material.alpha<1 && glass.getTotalVertices()===4, 'single-layer window glass');
    assert(!scene.getMeshByName(name+'Upper'), 'duplicate window header/upper hull');
    const bounds=glass.getBoundingInfo().boundingBox;
    assert(bounds.minimumWorld.y>1.1 && bounds.maximumWorld.y<3.7,'glass overlaps sill/header');
  }
  route([[2.8,12.3],[10.5,12.3],[10.5,18],[10.5,30]], 'Control -> machinery aisle');
  for (let z=15.5;z<=30;z+=0.5) {
    for (const x of [10,10.5,11]) {
      assert(ray([x,1.8,z],[x,-0.1,z])?.hit,'machinery floor gap');
      assert(ray([x,4,z],[x,6,z],mesh=>solid(mesh)&&/Ceiling/.test(mesh.name))?.hit,'machinery roof gap');
    }
  }
  for (const z of [19,23,27,30]) {
    assert(ray([10.5,1.8,z],[16,1.8,z])?.hit,'machinery right containment');
    assert(ray([10.5,1.8,z],[5,1.8,z])?.hit,'machinery left containment');
  }
  assert(ray([10.5,1.8,30],[10.5,1.8,32])?.hit,'machinery rear containment');
  const sky=scene.getMeshByName('spaceSurround');
  for (const direction of [[0,0,-1],[-1,0,0],[1,0,0],[0,1,0],[0,0,1],[0,-1,0],[-1,1,-1],[1,1,-1]]) {
    const end=new B.Vector3(...direction).normalize().scale(500).add(new B.Vector3(0,2.4,-23));
    assert(ray([0,2.4,-23],end.asArray(),mesh=>mesh===sky)?.hit,'space environment coverage');
  }
  assert(scene.getMeshByName('surroundingStars').getTotalVertices()===6000,'combined surrounding starfield');
  console.log('PASS: four pods; both spawn supports/headroom; player-width routes; cryo door boundaries; open/closed bulkhead; ' + roofSamples + ' ceiling samples; single-layer glazing; machinery clearance/containment; surrounding space.');
} finally { scene.dispose(); }
