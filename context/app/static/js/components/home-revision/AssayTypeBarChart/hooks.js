import { useTheme } from '@material-ui/core/styles';

function useChartPalette() {
  const {
    palette: { success, primary, secondary, error, warning, info },
  } = useTheme();

  const colorObjects = [success, primary, secondary, error, warning, info];

  return [...colorObjects.map((c) => c.light), ...colorObjects.map((c) => c.main), ...colorObjects.map((c) => c.dark)];
}

export { useChartPalette };
