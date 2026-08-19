/**
 * Nameplate projection store: in-canvas trackers write the screen position of
 * each workstation every frame; the 2D nameplate layer outside the canvas
 * reads it and clamps the labels inside the viewport. No React re-renders.
 */
export interface NamePos {
  x: number;
  y: number;
}

const positions = new Map<string, NamePos>();

export function setProjected(id: string, pos: NamePos) {
  positions.set(id, pos);
}

export function getProjected(id: string): NamePos | null {
  return positions.get(id) ?? null;
}
