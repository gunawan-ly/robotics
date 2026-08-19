# AGENTS.md

# Project: Miniature AI Provider Room

This repository contains a small interactive 3D web visualization of AI providers working inside a miniature room.

The project's purpose is intentionally simple:

«Visualize real AI request activity as subtle, natural robot animations.»

This is not a game, not a full analytics dashboard, and not a complex 3D simulation.

---

## 1. Core Product Principle

The most important experience is:

```
Real 9Router request
        ↓
Correct provider detected
        ↓
Corresponding robot reacts
        ↓
Robot sits and works
        ↓
Floating thought text changes
        ↓
Request completes
        ↓
Robot returns to idle
```

The experience should feel:

- natural
- smooth
- calm
- miniature
- alive
- technically polished

Prefer simplicity and polish over feature quantity.

---

## 2. Do Not Over-Engineer

This is a deliberately small project.

Do NOT introduce unnecessary systems such as:

- authentication
- user accounts
- complex database systems
- analytics dashboards
- request history
- model management
- provider management
- chat interface
- game mechanics
- physics simulation
- pathfinding
- multiplayer
- inventory systems
- complex state-management libraries
- unnecessary backend services

If a feature is not required for the core experience, do not add it.

If a simple implementation works, prefer it.

---

## 3. Primary Technology

Preferred stack:

```
- Next.js
- React
- TypeScript
- Three.js
- React Three Fiber
- @react-three/drei
```

Use additional libraries only when there is a clear technical reason.

Do not add a dependency simply because it is popular.

---

## 4. 3D Design Direction

The scene should look like:

«Cute miniature AI laboratory / AI server room.»

Visual characteristics:

- miniature
- stylized
- clean
- cozy
- slightly futuristic
- technical
- soft
- low-poly or optimized 3D assets

Avoid:

- cyberpunk overload
- excessive neon
- realistic military/server-room aesthetics
- overly dark scenes
- game-like HUDs
- excessive visual effects

The scene should resemble a digital diorama.

---

## 5. Camera

The camera is fixed/isometric.

Do NOT implement free camera controls as the primary interaction.

Do NOT implement:

- FPS camera
- free orbiting
- user-controlled camera movement
- first-person navigation

The user should immediately see the complete room.

---

## 6. Robot Philosophy

Each provider has one robot.

Each robot has:

- fixed position
- fixed workstation
- desk
- chair
- monitor/work device
- idle state
- working state

Robots do NOT freely walk around the room.

Robots should only perform small, natural movements.

Preferred movements:

- head turning
- looking around
- blinking
- breathing
- subtle body movement
- small hand movement
- looking at monitor
- sitting
- standing

Avoid exaggerated movements.

The robot should feel like a tiny worker, not a game character.

---

## 7. Robot State Machine

Use a simple state machine:

```
IDLE
  ↓
NOTICE
  ↓
SITTING
  ↓
WORKING
  ↓
SUCCESS
  ↓
STANDING
  ↓
IDLE
```

### IDLE

Robot stands next to its chair.

Use subtle idle animation.

### NOTICE

Robot notices that a request has arrived.

Use a small head/body reaction.

### SITTING

Robot moves into its chair.

The movement should be short and smooth.

### WORKING

Robot remains seated.

Use subtle working animation.

A floating text appears above the robot.

### SUCCESS

Request has completed.

Stop working animation.

Remove floating text.

Optional subtle success indicator.

### STANDING

Robot stands.

Return to the original idle position.

---

## 8. Floating Thought Text

During WORKING, display a small floating text above the robot.

Example phrases:

```
Thinking...
Analyzing...
Processing...
Checking...
Evaluating...
Reviewing...
Judging...
```

The text should change periodically.

Use smooth:

```
fade out
↓
text change
↓
fade in
```

Do not make the text large or distracting.

The text is visual decoration.

It is NOT the actual model's internal reasoning.

Never expose hidden model reasoning or chain-of-thought.

---

## 9. Primary Provider

The first and most important robot is:

```
Model:
oc/deepseek-v4-flash-free

Role:
Judge
```

The DeepSeek robot should receive the most attention during initial implementation.

Its animation should become the reference implementation for the other robots.

---

## 10. Provider Architecture

Providers must be configuration-driven.

Avoid creating completely separate implementations for every provider.

Preferred conceptual structure:

```ts
interface ProviderConfig {
  id: string;
  name: string;
  modelIds: string[];
  role?: string;
  position: [number, number, number];
  deskPosition: [number, number, number];
  chairPosition: [number, number, number];
}
```

The exact interface may be adapted by the engineer.

Adding a new provider should require minimal code changes.

---

## 11. Provider Mapping

The system should resolve:

```
9Router model
      ↓
provider resolver
      ↓
robot ID
      ↓
robot state
```

Example:

```
oc/deepseek-v4-flash-free
        ↓
deepseek
        ↓
DeepSeek Robot
        ↓
WORKING
```

Do not hardcode provider behavior into unrelated scene components.

---

## 12. 9Router Integration

9Router is the source of real request activity.

The project should NOT replace 9Router.

The application should observe or consume the appropriate 9Router request/event information.

Before implementation, inspect the actual 9Router version and available APIs/endpoints.

Do not assume an endpoint exists simply because it appears in an old tutorial or example.

The developer should determine the most reliable mechanism for:

1. detecting request start,
2. identifying the selected model/provider,
3. detecting request completion.

The frontend should receive simplified application events such as:

```json
{
  "type": "provider_request_started",
  "provider": "deepseek",
  "model": "oc/deepseek-v4-flash-free"
}
```

and:

```json
{
  "type": "provider_request_completed",
  "provider": "deepseek",
  "model": "oc/deepseek-v4-flash-free"
}
```

The frontend should not need to understand 9Router's internal implementation.

---

## 13. Security

Never expose the 9Router API key in browser/client-side code.

Use server-side environment variables.

Example:

```
NINEROUTER_URL=
NINEROUTER_KEY=
```

The exact variable names may be changed if the project architecture requires it.

Never:

- hardcode secrets,
- commit secrets,
- put secrets in client components,
- expose secrets through "NEXT_PUBLIC_*",
- place secrets in source code.

Use ".env.local" for local development.

Ensure ".env*" secrets are protected by ".gitignore".

---

## 14. Real Request First

Production behavior must use real 9Router activity.

A development-only simulator may exist for animation testing.

Example:

```
START DEEPSEEK
STOP DEEPSEEK
```

The simulator must never become the production event source.

It should be easy to remove or disable.

---

## 15. Multiple Concurrent Requests

Each robot must maintain independent state.

Example:

```
DeepSeek     → WORKING
OpenCode     → WORKING
MiMo         → IDLE
Nemotron     → IDLE
OpenRouter   → WORKING
```

One robot's request must not reset another robot.

Keep concurrency handling simple.

---

## 16. 3D Assets

Do not create 3D assets from scratch unless absolutely necessary.

Prefer existing optimized assets in:

```
.glb
.gltf
```

Possible assets:

- robot
- desk
- chair
- monitor
- computer
- server rack
- lamps
- room props
- decorations

Always check asset licensing before including assets in the project.

Prefer assets that can legally be redistributed with the project.

---

## 17. Asset Optimization

Optimize assets for web and mobile.

Priorities:

```
Performance
>
Smooth animation
>
Visual quality
```

Avoid:

- unnecessarily high polygon counts
- huge textures
- excessive dynamic lights
- expensive post-processing
- unnecessary 4K textures
- duplicated heavy assets

Reuse models/materials whenever possible.

---

## 18. Animation Quality

Animation should use smooth easing.

Avoid:

- teleporting
- sudden state changes
- stiff movement
- exaggerated motion
- unnecessarily long transitions

A small amount of high-quality motion is better than many mediocre animations.

---

## 19. Mobile Support

The application must work on mobile browsers.

The scene should remain readable on:

- desktop
- tablet
- mobile

Do not assume a large desktop viewport.

Keep the primary robot and room within the default camera framing.

---

## 20. Performance

Performance is a first-class requirement.

Target:

- smooth rendering
- stable frame rate
- reasonable memory usage
- fast asset loading

If a visual effect significantly hurts performance, simplify it.

Do not sacrifice the experience for visual complexity.

---

## 21. Accessibility

Support:

```
prefers-reduced-motion
```

When reduced motion is enabled:

- reduce idle animation
- reduce decorative movement
- disable unnecessary camera motion
- retain clear state changes

---

## 22. Code Architecture

Keep 3D components modular.

Suggested structure:

```
src/
├── app/
├── components/
│   ├── room/
│   ├── robots/
│   └── ui/
├── config/
├── events/
├── hooks/
└── lib/
    └── router/
```

Do not force this exact structure if a better architecture is justified.

---

## 23. Important Separation

Keep these concerns separate:

```
9Router integration
        ↓
Event normalization
        ↓
Provider resolution
        ↓
Robot state
        ↓
Animation
        ↓
3D rendering
```

Do not connect 9Router API calls directly to individual robot components.

---

## 24. Error Handling

If 9Router is unavailable:

- keep the room visible,
- keep robots idle,
- show a small connection status if appropriate.

Do not crash the entire 3D scene because the API is unavailable.

Example:

```
● 9Router Connected
```

or:

```
○ 9Router Offline
```

Keep the indicator subtle.

---

## 25. Loading

Show a simple loading state while critical 3D assets are loading.

Example:

```
Loading AI Room...
```

Avoid an empty screen.

---

## 26. Development Workflow

Before implementing a feature:

1. Inspect the existing code.
2. Understand the current architecture.
3. Reuse existing components.
4. Make the smallest change necessary.
5. Test locally.
6. Check mobile rendering.
7. Check console errors.
8. Check performance.
9. Only then move to the next feature.

Do not rewrite the project unnecessarily.

---

## 27. Git Safety

Do not make destructive changes.

Before large architectural changes:

- inspect git status,
- inspect current branch,
- understand existing changes.

Prefer small commits.

Never overwrite user work without explicit instruction.

---

## 28. Scope Discipline

If an idea sounds cool but is not required for the core experience, leave it out.

The project's core loop is:

```
REQUEST
   ↓
ROBOT REACTS
   ↓
ROBOT WORKS
   ↓
REQUEST COMPLETES
   ↓
ROBOT RETURNS TO IDLE
```

Everything else is secondary.

---

## 29. Definition of Success

The project succeeds when the user can look at the room and immediately understand:

«"That little robot is working because an AI request is currently being processed."»

The experience should be:

```
Simple. Smooth. Natural. Alive.
```
