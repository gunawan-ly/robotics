/**
 * Data-driven provider configuration (PRD §5, AGENTS.md §10).
 * A new provider = one new entry here. No scene code changes required.
 *
 * Coordinate system: room ground plane is XZ, Y is up. Workstation-facing
 * conventions live in components; "rotation" is the Y rotation (radians)
 * that makes the robot face the room center (toward its desk/monitor).
 * All layout coordinates are pre-scaled by SCENE_SCALE so the content
 * fills the viewport on narrow screens.
 */
export interface ProviderConfig {
  id: string;
  name: string;
  modelIds: string[];
  role?: string;
  /** Robot body color. */
  accent: string;
  /** Robot secondary color (chest plate, ears). */
  accentDark: string;
  /** Visor / monitor glow color. */
  glow: string;
  /** Floating thought phrases cycling while working. */
  phrases: string[];
  /** Idle standing spot (x, z). */
  position: [number, number];
  /** Desk center (x, z). */
  deskPosition: [number, number];
  /** Chair center (x, z). */
  chairPosition: [number, number];
  /** Y rotation (radians) so the robot faces the router core. */
  rotation: number;
}

const COMMON_PHRASES = [
  "Thinking...",
  "Processing...",
  "Working...",
  "Analyzing...",
  "Computing...",
  "Refining...",
];

/** Overall room scale — smaller values = content fills the viewport better
 *  on narrow (mobile) screens while staying centered (AGENTS.md §19). */
export const SCENE_SCALE = 0.85;

export const PROVIDERS: ProviderConfig[] = [
  {
    id: "deepseek",
    name: "DeepSeek",
    role: "Judge",
    modelIds: ["oc/deepseek-v4-flash-free"],
    accent: "#4f8cff",
    accentDark: "#1d4ed8",
    glow: "#bdf3ff",
    phrases: [
      "Thinking...",
      "Analyzing...",
      "Checking...",
      "Evaluating...",
      "Judging...",
      "Processing...",
      "Reviewing...",
    ],
    position: [0.0, 1.88],
    deskPosition: [0.0, 3.15],
    chairPosition: [0.0, 2.53],
    rotation: 0,
  },
  {
    id: "opencode",
    name: "OpenCode",
    role: "Coder",
    modelIds: ["open-code", "oc", "opencode"],
    accent: "#34d399",
    accentDark: "#059669",
    glow: "#bbf7d0",
    phrases: COMMON_PHRASES,
    position: [-4.243, 2.053],
    deskPosition: [-3.1, 1.5],
    chairPosition: [-3.658, 1.77],
    rotation: 2.02146,
  },
  {
    id: "mimo",
    name: "MiMo",
    role: "Coder",
    modelIds: ["mimo"],
    accent: "#fbbf24",
    accentDark: "#d97706",
    glow: "#fde68a",
    phrases: COMMON_PHRASES,
    position: [-4.243, -2.053],
    deskPosition: [-3.1, -1.5],
    chairPosition: [-3.658, -1.77],
    rotation: 1.12014,
  },
  {
    id: "nemotron",
    name: "Nemotron",
    role: "Reasoner",
    modelIds: ["nemotron"],
    accent: "#a78bfa",
    accentDark: "#7c3aed",
    glow: "#ddd6fe",
    phrases: COMMON_PHRASES,
    position: [4.243, -2.053],
    deskPosition: [3.1, -1.5],
    chairPosition: [3.658, -1.77],
    rotation: -1.12014,
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    role: "Gateway",
    modelIds: ["openrouter"],
    accent: "#f87171",
    accentDark: "#b91c1c",
    glow: "#fecaca",
    phrases: COMMON_PHRASES,
    position: [4.243, 2.053],
    deskPosition: [3.1, 1.5],
    chairPosition: [3.658, 1.77],
    rotation: -2.02146,
  },
] as const;

export const PRIMARY_PROVIDER_ID = "deepseek";

export function getProvider(id: string): ProviderConfig | undefined {
  return PROVIDERS.find((p) => p.id === id);
}