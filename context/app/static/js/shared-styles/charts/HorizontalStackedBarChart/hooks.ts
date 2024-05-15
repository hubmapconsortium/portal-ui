import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

import { getAssayTypeBarChartData } from 'js/shared-styles/charts/HorizontalStackedBarChart/utils';

function useChartPalette() {
  const {
    palette: { success, primary, secondary, error, warning, info },
  } = useTheme();

  const colorObjects = [success, primary, secondary, error, warning, info];

  // Color order matters. Light then main then dark.
  return [...colorObjects.map((c) => c.light), ...colorObjects.map((c) => c.main), ...colorObjects.map((c) => c.dark)];
}

interface RawStackedBarChartData {
  aggregations: {
    mapped_data_types: {
      buckets: {
        key: string;
        doc_count: number;
      }[];
    };
  };
}

function useAssayTypeBarChartData(
  rawData: RawStackedBarChartData,
  colorKey: string,
  filterBucketsFunc: (bucket: { key: string; doc_count: number }) => boolean = () => true,
) {
  return useMemo(() => {
    if (Object.keys(rawData).length > 0) {
      const buckets = rawData.aggregations.mapped_data_types.buckets.filter(filterBucketsFunc);
      return getAssayTypeBarChartData(buckets, colorKey);
    }
    return { formattedData: [], maxSumDocCount: undefined };
  }, [rawData, filterBucketsFunc, colorKey]);
}

export { useChartPalette, useAssayTypeBarChartData };
