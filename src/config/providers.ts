/**
 * Data-driven provider configuration (PRD §5, AGENTS.md §10).
 * A new provider = one new entry here. No scene code changes required.
 *
 * Coordinate system: room ground plane is XZ, Y is up. Workstation-facing
 * conventions live in components; "rotation" is the Y rotation (radians)
 * that makes the robot face the room center (toward its desk/monitor).
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
    position: [3.62, 4.32],
    deskPosition: [3.55, 3.55],
    chairPosition: [3.97, 3.97],
    rotation: -2.35619449,
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
    position: [-4.32, 3.62],
    deskPosition: [-3.55, 3.55],
    chairPosition: [-3.97, 3.97],
    rotation: 0.78539816,
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
    position: [-3.62, -4.32],
    deskPosition: [-3.55, -3.55],
    chairPosition: [-3.97, -3.97],
    rotation: 2.35619449,
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
    position: [4.32, -3.62],
    deskPosition: [3.55, -3.55],
    chairPosition: [3.97, -3.97],
    rotation: -0.78539816,
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
    position: [0.55, 4.15],
    deskPosition: [0, 3.55],
    chairPosition: [0, 4.15],
    rotation: Math.PI,
  },
] as const;

export const PRIMARY_PROVIDER_ID = "deepseek";

export function getProvider(id: string): ProviderConfig | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
