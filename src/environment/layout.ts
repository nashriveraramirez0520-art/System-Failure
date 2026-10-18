// Forward = -Z; aft = +Z. Keep spawn and pod coordinates together.
export const layout = {
  ceilingY: 6,
  bulkheadZ: -3,
  bulkheadOpening: 6,
  openingHeight: 4.3,
  crewRoomWallX: 7,
  engineeringStartZ: 8,
} as const;

export const crewPods = [
  { name: 'cryopod1', x: -10, z: 4.8, occupied: true },
  { name: 'cryopod2', x: 10, z: 4.8, occupied: true },
  { name: 'cryopod3', x: -13, z: 4.8, occupied: false },
  { name: 'cryopod4', x: 13, z: 4.8, occupied: false },
] as const;

// Retain the tested height and forward-facing rotation relative to each tilted pod.
export const playerSpawns = {
  player1: { x: crewPods[0].x, y: 3.8345, z: crewPods[0].z },
  player2: { x: crewPods[1].x, y: 3.8345, z: crewPods[1].z },
} as const;
