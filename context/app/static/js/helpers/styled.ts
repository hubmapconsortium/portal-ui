import type { SxProps, Theme } from '@mui/material/styles';

// MUI's default `shouldForwardProp` for `styled(Component)` (not string tags) only drops
// `ownerState`, `theme`, `sx` and `as`. Under Emotion every other prop reaches the wrapped
// component and, from there, the DOM. This keeps the styled-components convention that
// `$`-prefixed ("transient") props are styling-only and never forwarded.
const MUI_INTERNAL_PROPS = new Set(['ownerState', 'theme', 'sx', 'as']);

export function shouldForwardProp(prop: PropertyKey) {
  return typeof prop !== 'string' || (!MUI_INTERNAL_PROPS.has(prop) && !prop.startsWith('$'));
}

/**
 * Merges a component's own `sx` with one passed in by a caller, so the caller's styles win.
 *
 * MUI's v9 migration codemod inlines `...(Array.isArray(sx) ? sx : [sx])` at each site for
 * this, but that spread is typed loosely enough to trip `no-unsafe-assignment`. Funnelling
 * it through one helper keeps the call sites readable and the cast in a single place.
 */
export function mergeSx(...entries: (SxProps<Theme> | false | undefined)[]): SxProps<Theme> {
  return entries.flat() as SxProps<Theme>;
}
