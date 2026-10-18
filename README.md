# SYSTEM FAILURE

**SYSTEM FAILURE** is a cooperative multiplayer sci-fi game set aboard the **LUNARIS-01**.

Two crew members awaken aboard a spacecraft controlled by **AURA**, the ship's artificial intelligence. When a catastrophic system failure separates the crew, survival depends on communication: each player has access to different spaces, information, and ship systems.

> Easy to understand. Difficult to coordinate. Hilarious to fail.

## 🚀 Current Development Status

SYSTEM FAILURE is an active prototype being developed for the **Handshake AI Skills Studio x OpenAI Multiplayer Game Challenge**.

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

Both players face the same emergency, but they do not always see the same information or have access to the same controls. Operations may be able to diagnose a failing system while the Engineer must physically locate and repair the corresponding machinery.

The goal is to make communication part of the game itself: knowing the solution is not enough if your crewmate is the one who has to carry it out.

Planned and developing ship systems include power, coolant and machinery, oxygen and ventilation, hull integrity, emergency systems, cameras, and security.

## 🛰️ LUNARIS-01

The current ship layout progresses through interconnected functional spaces:

**Engineering Machinery / Maintenance → Engineering Control → Crew Quarters & Lounge → Emergency Bulkhead → Command / Operations → Observation Window**

The two current players begin in separate cryopod rooms. Each room contains an additional cryopod reserved for possible future expansion beyond the current two-player design.

Engineering is intentionally split between a control area and a physical machinery bay so future failures can require one player to interpret system information while the other works directly with pipes, pumps, valves, electrical equipment, and other machinery.

## 🤖 AURA

**AURA** is the artificial intelligence aboard the LUNARIS-01.

She assists the crew, reports ship conditions, reacts to emergencies, and occasionally comments on the crew's questionable survival decisions.

`AURA: All systems operational. Probably. ^_^`

## 🟦 Cubito

Cubito is a small blue cube aboard the LUNARIS-01.

His operational purpose remains classified.

His survival rate is currently exceptional.

## 🛠️ Technology

- TypeScript
- Vite
- Babylon.js
- Node.js
- Express
- Socket.IO

## ▶️ Local Development

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
