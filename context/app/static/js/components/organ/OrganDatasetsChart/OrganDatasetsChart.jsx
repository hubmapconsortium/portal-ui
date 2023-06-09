import React, { useMemo } from 'react';
import useSearchData from 'js/hooks/useSearchData';

import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import AssayTypeBarChart from 'js/shared-styles/charts/AssayTypeBarChart/';
import { useChartPalette, useAssayTypeBarChartData } from 'js/shared-styles/charts/AssayTypeBarChart/hooks';
import {
  getAssayTypesCompositeAggsQuery,
  getDocCountScale,
  getColorScale,
  getDataTypeScale,
} from 'js/shared-styles/charts/AssayTypeBarChart/utils';
import { ChartArea } from 'js/shared-styles/charts/AssayTypeBarChart/style';
import { combineQueryClauses } from 'js/helpers/functions';
import { excludeSupportEntitiesClause } from 'js/helpers/queries';

const assayOrganTypesQuery = getAssayTypesCompositeAggsQuery('origin_sample.mapped_organ.keyword', 'organ_type');

function OrganDatasetsChart({ search }) {
  const updatedQuery = useMemo(
    () =>
      Object.assign(assayOrganTypesQuery, {
        query: combineQueryClauses([
          { bool: { must: { terms: { 'origin_samples.mapped_organ.keyword': search } } } },
          excludeSupportEntitiesClause,
        ]),
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

  const sharedProps = {
    visxData: formattedOrganTypeData,
    docCountScale,
    colorScale,
    dataTypeScale,
    keys: search,
    colorFacetName: 'origin_sample.mapped_organ',
    margin,
    dataTypes,
  };

  return (
    <ChartArea>
      {search.length > 1 ? (
        <ChartWrapper margin={margin} colorScale={colorScale}>
          <AssayTypeBarChart {...sharedProps} />
        </ChartWrapper>
      ) : (
        <AssayTypeBarChart {...sharedProps} showTooltipAndHover={false} />
      )}
    </ChartArea>
  );
}

export default OrganDatasetsChart;
