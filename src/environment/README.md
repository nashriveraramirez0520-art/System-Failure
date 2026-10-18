# LUNARIS-01 interior — Phase 2

Forward is negative Z; aft is positive Z. Deck collision surfaces remain at Y=0; ceiling height is 6.

## Layout

- Command and panoramic bow: Z=-25..-3.
- Emergency bulkhead: Z=-3, with a single six-unit crossing.
- Shared crew lounge: X=-7..7, approximately Z=-2.6..8. AURA has two placeholder stations, with open walking space around it. Cubito remains at the origin. Seating, tables, a galley and storage sit at the edges.
- Cryopod rooms: X=-15..-7 and X=7..15, Z=-1.5..7.5. Each contains two pods and has one doorway to the lounge at Z=0..3.2.
- Engineering: one coherent aft region, Z=8..15, with an eight-unit entrance, equipment banks, maintenance benches and rear service alcoves.

Player 1 spawns at (-10,3.8345,4.8); Player 2 at (10,3.8345,4.8). Both face toward negative Z as before. Walk off the front of the tilted pod, then toward the inner room doorway. CR-03 and CR-04 have no networking or gameplay role.

The future accident must put Operations forward of the bulkhead and Engineer aft before closure. No role assignment, teleport, accident, animation or interaction exists in this pass. All rooms and routes stay inside the hull and there is no corridor bypass of the transverse partition.

## Module map

- createLunarisInterior.ts: build order and deck skins/inlays.
- layout.ts: shared pod/spawn coordinates and major boundaries.
- hull.ts: original hull geometry and collision surfaces.
- props.ts: Cubito and four cryopods. Original tilted pod collider dimensions are retained.
- crewQuarters.ts: two enclosed rooms, framed doorways and raised sliding leaves.
- common.ts: AURA, lounge, galley and storage.
- command.ts / observationWindow.ts: bridge consoles, architecture, collidable transparent bow segments, framing and deterministic starfield.
- engineering.ts / service.ts: aft equipment and rear alcoves.
- bulkhead.ts: full-width emergency partition, overhead pocket, raised leaf and warning strips.
- ceiling.ts: overlapping regional roof sections, full proa envelope, upper hull and ribs.
- materials.ts / lighting.ts: shared materials, scoped regional lights and one 1024px Engineering spotlight shadow map.
- architecture.ts: reusable boxes, small static technical labels and station housings.

## Future doors

createLunarisInterior returns raisedBulkhead and cryoDoors. They are real full-size collidable meshes parked above their openings. Their current open center Y is 6.45; the planned closed center Y is 2.15. Door pockets allow the parked leaves to extend above the interior roof. Neither animation nor door state is implemented. Future synchronized state must be added deliberately.

## Collision and rendering

Original deck and hull transforms are preserved. The nose and angled shoulder segments use translucent material with collisions still enabled; opaque sills/headers and mullions frame the glazing. Deck skins are decorative and do not change landing. Small props, lids, light strips and signs do not collide.

Phase 1 controller safeguards are unchanged. Phase 2 only imports shared spawn coordinates into main.ts. The existing frame-dependent controller and landing offsets are deliberately retained.

Point/fill lights are scoped by region. Separate visible deck and roof meshes prevent a single full-length surface from receiving every region's lighting. Engineering retains low ambient fill, warm practical lights and a single shadow-casting spotlight for depth. The sky uses one combined star mesh and a dark backdrop, without external assets.

## Verification

Run npm run build and node scripts/verify-interior.cjs from punto. The headless script checks pod support/headroom, player-width walking routes, room doors, full-width bulkhead separation (including a hypothetical closed position only in the disposable test scene), roof coverage and window collisions. Its canvas stub supports label construction only; it does not validate visual rendering or actual controller/network behavior.

Serve the production build with node server/server.js. In two browser windows create/join a room, exit both pods, visit the lounge, AURA, Command/window, Engineering and service alcoves. Check jumping at door headers, corners and ceilings, remote position/yaw/head pitch, readable lighting, window transparency, star visibility, sign readability and frame rate near Engineering shadows. No doors should animate.

## Focused window / machinery pass

The three original bow boxes remain active colliders but are hidden. Each aperture now has one visible inset glass plane. Duplicate upper-window clones were removed: the original headers already fill Y=3.7..6. Roof sections meet at their edges without coplanar underside overlap. Command equipment and hull collider transforms remain unchanged.

spaceEnvironment.ts provides a dark 700-unit inward-facing sphere and one deterministic combined star mesh distributed over a surrounding spherical shell. Both are non-colliding, excluded from interior lighting and require no textures or external assets.

Engineering Control retains its existing room/equipment. SVC-01 remains sealed; SVC-02 (starboard/right at X=10.5) now connects through an open static service frame to a throat at Z=15..17, then Machinery/Maintenance at X=6..15, Z=17..31.1. The old aft wall is disabled and replaced with full-height pieces around this opening. This is the only small change to Control's envelope.

machineryBay.ts owns the bay shell, deck, ceiling, coolant tanks/lines/valves, pumps, power cabinets/cables, ventilation duct, supports and maintenance tools. It exposes four grouping nodes through machinerySystems for later development, with stable system and mesh names. These are architectural references only; no gameplay state or interaction exists. Small pipework does not affect landing rays; it participates in the existing upward head-clearance query. Equipment bodies and the room shell have collisions.

The machinery bay has warm scoped work lights plus one additional 512px spotlight shadow map. Its continuous central aisle is approximately 2.3 units wide. Deck/roof joins avoid coplanar overlapping surfaces. Existing spawn coordinates, controller and network source were not changed in this pass.

The geometry checker additionally validates a player-width path from Control through SVC-02 to the far end, floor/roof continuity, bay containment, one-plane glazing with no duplicated upper-window pieces, and surrounding space coverage in forward/side/upward/rear/downward directions. Visual temporal flicker, alpha rendering, warm-light readability and shadow performance still need a real browser walkthrough.
