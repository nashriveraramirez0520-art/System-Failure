# SYSTEM FAILURE

System Failure is a game I'm trying to develop without much experience in coding. It was first a project for an school competition, but I never submitted it because it was still in early develpment. 

The game is designed to have similar mechanics as the steam game "BoomBanana" where every player is needed to finish the game.

System Failure would follow this story line: First, the two team members wake up aboard the LUNARIS-01, a spacecraft controlled by an artificial intelligence called *Aura*. She gives kind of a tutorial mission in which the two players would need to go to their respective work station and fix a system error inside the spaceship. The players would be able to select between two roles; Engineer and Operations. Engineer would be in charge of the engine room and systems room, while the operator would be in charge of the bow( controls room). After they complete the tutorial, a catastrophic system failure (hence the name of the game) would separate the crew, their survival depends on how they communicate.

> Easy to understand. Difficult to coordinate. Hilarious to fail.

## 🚀 Current Development Status

### Implemented

- Babylon.js 3D environment and first-person controller
- Walking, sprinting, jumping, gravity, and collision handling
- Node.js + Socket.IO multiplayer server
- Create/join room system for two players
- Separate player spawns and synchronized remote-player movement/look direction
- Modular LUNARIS-01 interior
- Two enclosed cryopod rooms with four total cryopods
- Central crew lounge / common area with AURA station
- Command / Operations section
- Engineering Control section
- Engineering Machinery / Maintenance Bay
- Emergency bulkhead architecture
- Panoramic observation window and surrounding space environment
- Distinct lighting and atmosphere between crew, command, and engineering areas

### In Development

The next major milestone is the core cooperative gameplay loop:

- Engineer and Operations roles
- Opening / pre-failure sequence
- Catastrophic ship failure event
- Emergency doors and bulkhead behavior
- AURA emergency responses
- Asymmetric diagnostics and physical repairs
- Multiplayer-synchronized interactions and ship state
- Progression and end condition

## 🎮 Game Concept

SYSTEM FAILURE is built around **asymmetric cooperation**.

The goal is to make communication part of the game itself: knowing the solution is not enough if your crewmate is the one who has to carry it out.

Planned and developing ship systems include power, coolant and machinery, oxygen and ventilation, hull integrity, emergency systems, cameras, and security.

## 🛰️ LUNARIS-01

The current ship layout progresses through interconnected functional spaces:

**Engineering Machinery / Maintenance → Engineering Control → Crew Quarters & Lounge → Emergency Bulkhead → Command / Operations → Observation Window**

As of right now, the two players would spawn in one of the cryopod rooms, but there is another cryopod room reserved for a possible expansion beyond the two player desing. 

Engineering is intentionally split between a control area and a physical machinery bay so future failures can require one player to interpret system information while the other works directly with pipes, pumps, valves, electrical equipment, and other machinery.

## 🤖 AURA

**AURA** is the artificial intelligence aboard the LUNARIS-01.

Aura is going to be desing to develop a personality through the game, she initially would just assit the crew and comment on the ship conditions, but if the players fail some mission, she would start to comment on the crew's questionable survival decisions. 

`AURA: All systems operational. Probably. ^_^`

## 🟦 Cubito

Cubito is a small blue cube aboard the LUNARIS-01.

His operational purpose remains classified.

His survival rate is currently exceptional.

(as context for this information, I added "cubito", a blue square, into the ship by error, I don't know how I was trying to code the floor, but it gave me this blue square, which I decided to keep an later hide or something so it is an easter egg)

## 🛠️ Technology

- TypeScript
- Vite
- Babylon.js
- Node.js
- Express
- Socket.IO

## ▶️ Local Development

The current online development build can be played here:

https://system-failure-game.onrender.com/

The game is currently in active development, so systems, visuals, performance, and gameplay may change as development continues.

To run the game on your computer via Vs Code:

Install dependencies:

```bash
npm install
```

Build the client:

```bash
npm run build
```

Start the integrated Node.js / Socket.IO server:

```bash
node ./server/server.js
```

Then open `http://localhost:3000`.

For frontend development with Vite:

```bash
npm run dev
```

## 🔒 Source & License

Copyright © 2026 Nash Andrés Rivera Ramírez. All rights reserved.

This repository is publicly viewable for project review, demonstration, and source inspection. **SYSTEM FAILURE is not an open-source project.** Public access to the repository does not grant permission to copy, redistribute, sell, sublicense, create derivative works from, or reuse substantial portions of the project.

See [LICENSE](./LICENSE) for the complete terms.

Third-party dependencies remain subject to their respective licenses.

---

**Current objective:** Turn the completed multiplayer and LUNARIS-01 environment foundation into a playable cooperative failure-and-repair loop.
