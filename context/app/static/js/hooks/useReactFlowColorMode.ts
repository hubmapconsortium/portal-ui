import type { CSSProperties } from 'react';
import { useTheme } from '@mui/material/styles';

/**
 * Props that put React Flow in the current theme's mode.
 * React Flow's dark mode paints its own #141414 background and #3e3e3e edges, which vanish on our #333 surfaces,
 * so the background is left transparent and edges get a grey with the contrast the light-mode edges have on white.
 */
function useReactFlowColorMode() {
  const theme = useTheme();
  const style =
    theme.palette.mode === 'dark'
      ? ({ '--xy-background-color': 'transparent', '--xy-edge-stroke': theme.palette.grey[600] } as CSSProperties)
      : undefined;
  return { colorMode: theme.palette.mode, style };
}

export default useReactFlowColorMode;
