/**
 * Model -> Provider mapping layer (PRD §17).
 * Exact match first, then prefix match (case-insensitive), so new model ids
 * keep working without scene changes.
 */
import type { ProviderConfig } from "@/config/providers";

export function resolveProvider(model: string, providers: ProviderConfig[]): ProviderConfig | undefined {
  const m = model.trim().toLowerCase();
  if (!m) return undefined;

  const exact = providers.find((p) => p.modelIds.some((id) => id.toLowerCase() === m));
  if (exact) return exact;

  return providers.find((p) =>
    p.modelIds.some((id) => {
      const i = id.toLowerCase();
      return i && (m.startsWith(i + "/") || m.startsWith(i + ":"));
    })
  );
}
