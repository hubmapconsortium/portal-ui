import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

import { getAssayTypeBarChartData } from 'js/shared-styles/charts/AssayTypeBarChart/utils';

function useChartPalette() {
  const {
    palette: { success, primary, secondary, error, warning, info },
  } = useTheme();

  const colorObjects = [success, primary, secondary, error, warning, info];

  // Color order matters. Light then main then dark.
  return [...colorObjects.map((c) => c.light), ...colorObjects.map((c) => c.main), ...colorObjects.map((c) => c.dark)];
}

function useAssayTypeBarChartData(rawData, colorKey, filterBucketsFunc) {
  const keepAllBuckets = () => true;
  return useMemo(() => {
    if (Object.keys(rawData).length > 0) {
      const buckets = rawData.aggregations.mapped_data_types.buckets.filter(filterBucketsFunc || keepAllBuckets);
      return getAssayTypeBarChartData(buckets, colorKey);
    }
    return { formattedData: [], maxSumDocCount: undefined };
  }, [rawData, filterBucketsFunc, colorKey]);
}

export { useChartPalette, useAssayTypeBarChartData };
