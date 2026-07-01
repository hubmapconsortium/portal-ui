// VITESSCE_VERSION is injected at build/dev time by Vite's `define` in
// vite.config.mts -- already with any ^/~ range prefix stripped.
export function getVitessceVersion(): string {
  return VITESSCE_VERSION;
}
