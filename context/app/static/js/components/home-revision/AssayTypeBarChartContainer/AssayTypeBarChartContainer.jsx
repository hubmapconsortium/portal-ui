import React, { useContext, useMemo } from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';

import { AppContext } from 'js/components/Providers';
import useSearchData from 'js/hooks/useSearchData';
import { formatAssayData, addSumProperty, sortBySumAscending } from './utils';
import { useChartPalette } from './hooks';
import AssayTypeBarChart from '../AssayTypeBarChart/AssayTypeBarChart';

const organTypesQuery = {
  size: 0,
  aggs: {
    organ_types: { terms: { field: 'origin_sample.mapped_organ.keyword', size: 10000 } },
  },
};

const assayTypesQuery = {
  size: 0,
  aggs: {
    mapped_data_types: {
      composite: {
        sources: [
          {
            mapped_data_type: {
              terms: {
                field: 'mapped_data_types.keyword',
              },
            },
          },
          {
            organ_type: {
              terms: {
                field: 'origin_sample.mapped_organ.keyword',
              },
            },
          },
        ],
        size: 10000,
      },
    },
  },
};

function AssayTypeBarChartContainer() {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const colors = useChartPalette();

  const { searchData: organTypesData } = useSearchData(organTypesQuery, elasticsearchEndpoint, nexusToken);

  const buckets = organTypesData?.aggregations?.organ_types?.buckets || [];
  const organTypes = buckets.map((b) => b.key);

  const { searchData: assayTypesData } = useSearchData(assayTypesQuery, elasticsearchEndpoint, nexusToken);

  const { formattedData, maxSumDocCount } = useMemo(() => {
    if (Object.keys(assayTypesData).length > 0) {
      const f = addSumProperty(formatAssayData(assayTypesData));
      sortBySumAscending(f);
      const m = Math.max(...f.map((d) => d.sum));
      return { formattedData: f, maxSumDocCount: m };
    }
    return { formattedData: [], maxSumDocCount: 0 };
  }, [assayTypesData]);

  const docCountScale = scaleLinear({
    domain: [0, maxSumDocCount],
    nice: true,
  });

  const colorScale = scaleOrdinal({
    domain: organTypes,
    range: colors,
  });

  const dataTypeScale = scaleBand({
    domain: formattedData.map((b) => b.mapped_data_type),
    padding: 0.2,
  });

  return (
    <AssayTypeBarChart
      formattedData={formattedData}
      docCountScale={docCountScale}
      colorScale={colorScale}
      dataTypeScale={dataTypeScale}
      organTypes={organTypes}
    />
  );
}

export default AssayTypeBarChartContainer;
