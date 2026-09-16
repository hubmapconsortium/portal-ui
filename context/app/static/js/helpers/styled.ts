// MUI's default `shouldForwardProp` for `styled(Component)` (not string tags) only drops
// `ownerState`, `theme`, `sx` and `as`. Under Emotion every other prop reaches the wrapped
// component and, from there, the DOM. This keeps the styled-components convention that
// `$`-prefixed ("transient") props are styling-only and never forwarded.
const MUI_INTERNAL_PROPS = new Set(['ownerState', 'theme', 'sx', 'as']);

export function shouldForwardProp(prop: PropertyKey) {
  return typeof prop !== 'string' || (!MUI_INTERNAL_PROPS.has(prop) && !prop.startsWith('$'));
}
