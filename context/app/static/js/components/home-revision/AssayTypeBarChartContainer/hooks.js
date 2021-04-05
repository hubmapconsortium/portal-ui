import { useMemo } from 'react';
import { useTheme } from '@material-ui/core/styles';

import { getAssayTypeBarChartData } from './utils';

function useChartPalette() {
  const {
    palette: { success, primary, secondary, error, warning, info },
  } = useTheme();

  const colorObjects = [success, primary, secondary, error, warning, info];

  return [...colorObjects.map((c) => c.light), ...colorObjects.map((c) => c.main), ...colorObjects.map((c) => c.dark)];
}

function useAssayTypeBarChartData(rawData, colorKey) {
  return useMemo(() => {
    if (Object.keys(rawData).length > 0) {
      return getAssayTypeBarChartData(rawData, colorKey);
    }
    return { formattedData: [], maxSumDocCount: undefined };
  }, [rawData, colorKey]);
}

export { useChartPalette, useAssayTypeBarChartData };
