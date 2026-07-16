import { useTheme } from '@mui/material/styles';
import type { Palette } from '@mui/material/styles';

// Pure derivation so callers that already hold a theme (e.g. to memoize on it)
// can build the array without a second `useTheme` subscription.
function getChartPalette({ success, primary, secondary, error, warning, info }: Palette) {
  const colorObjects = [success, primary, secondary, error, warning, info];

  // Color order matters. Light then main then dark.
  return [...colorObjects.map((c) => c.light), ...colorObjects.map((c) => c.main), ...colorObjects.map((c) => c.dark)];
}

function useChartPalette() {
  return getChartPalette(useTheme().palette);
}

export { useChartPalette, getChartPalette };
