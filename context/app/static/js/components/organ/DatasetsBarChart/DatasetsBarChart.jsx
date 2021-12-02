import React, { useMemo } from 'react';
import useSearchData from 'js/hooks/useSearchData';

import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import AssayTypeBarChart from 'js/components/home/AssayTypeBarChart/';
import { useChartPalette, useAssayTypeBarChartData } from 'js/components/home/AssayTypeBarChartContainer/hooks';
import {
  getAssayTypesCompositeAggsQuery,
  getDocCountScale,
  getColorScale,
  getDataTypeScale,
} from 'js/components/home/AssayTypeBarChartContainer/utils';
import { ChartArea } from 'js/components/home/AssayTypeBarChartContainer/style';

const assayOrganTypesQuery = getAssayTypesCompositeAggsQuery('origin_sample.mapped_organ.keyword', 'organ_type');

function DatasetsBarChart({ search }) {
  const updatedQuery = useMemo(
    () =>
      Object.assign(assayOrganTypesQuery, {
        query: {
          bool: { must: { terms: { 'origin_sample.mapped_organ.keyword': search } } },
        },
      }),
    [search],
  );

  const { searchData: assayOrganTypeData } = useSearchData(updatedQuery);

  const { formattedData: formattedOrganTypeData, maxSumDocCount: maxAssayOrganTypeDocCount } = useAssayTypeBarChartData(
    assayOrganTypeData,
    'organ_type',
  );

  const dataTypes = formattedOrganTypeData.map((b) => b.mapped_data_type);

  const colors = useChartPalette();

  const docCountScale = getDocCountScale(maxAssayOrganTypeDocCount);

  const colorScale = getColorScale(search, colors);

  const dataTypeScale = getDataTypeScale(dataTypes);

  const margin = { top: 40, right: 10, bottom: 100, left: 300 };

  return (
    <ChartArea>
      {search.length > 1 ? (
        <ChartWrapper margin={margin} colorScale={colorScale}>
          <AssayTypeBarChart
            visxData={formattedOrganTypeData}
            docCountScale={docCountScale}
            colorScale={colorScale}
            dataTypeScale={dataTypeScale}
            keys={search}
            colorFacetName="origin_sample.mapped_organ"
            margin={margin}
            dataTypes={dataTypes}
          />
        </ChartWrapper>
      ) : (
        <AssayTypeBarChart
          visxData={formattedOrganTypeData}
          docCountScale={docCountScale}
          colorScale={colorScale}
          dataTypeScale={dataTypeScale}
          keys={search}
          colorFacetName="origin_sample.mapped_organ"
          margin={margin}
          dataTypes={dataTypes}
        />
      )}
    </ChartArea>
  );
}

export default DatasetsBarChart;
