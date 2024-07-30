import React, { useMemo } from 'react';
import useSearchData from 'js/hooks/useSearchData';

import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import HorizontalStackedBarChart from 'js/shared-styles/charts/HorizontalStackedBarChart';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';
import { ChartArea } from 'js/shared-styles/charts/HorizontalStackedBarChart/style';
import { combineQueryClauses } from 'js/helpers/functions';
import { includeOnlyDatasetsClause } from 'js/helpers/queries';
import { useBandScale, useLinearScale, useOrdinalScale } from 'js/shared-styles/charts/hooks';
import { useDatasetTypeMap } from 'js/components/home/HuBMAPDatasetsChart/hooks';
import { mustHaveOrganClause } from 'js/pages/Organ/queries';
import { OrganFile } from '../types';
import { datasetTypeForOrganTermsQuery, DatasetTypeOrganQueryAggs } from './queries';
import { getSearchURL } from '../utils';

const margin = { top: 40, right: 10, bottom: 100, left: 10 };

function OrganDatasetsChart({ search }: Pick<OrganFile, 'search'>) {
  const updatedQuery = useMemo(
    () =>
      Object.assign(datasetTypeForOrganTermsQuery, {
        query: combineQueryClauses([mustHaveOrganClause(search), includeOnlyDatasetsClause]),
      }),
    [search],
  );

  const datasetTypeMap = useDatasetTypeMap();

  const { searchData: assayOrganTypeData } = useSearchData<unknown, DatasetTypeOrganQueryAggs>(updatedQuery);

  const formattedOrganDatasetTypeData =
    assayOrganTypeData.aggregations?.dataset_type_map.raw_dataset_type.buckets.map((bucket) => {
      const datasetType = bucket.key;

      const organTypeCounts: Record<string, number> = {};
      bucket.organ.buckets.forEach((b) => {
        const organName = b.key;
        organTypeCounts[organName] = b.doc_count;
      });

      return {
        datasetType,
        total: bucket.doc_count,
        ...organTypeCounts,
      };
    }) ?? [];

  const max = Math.max(...formattedOrganDatasetTypeData.map((d) => d.total));

  const xScale = useLinearScale([0, max], { nice: true });
  const yScale = useBandScale(
    formattedOrganDatasetTypeData?.map((d) => d.datasetType),
    { padding: 0.1 },
  );
  const palette = useChartPalette();
  const colorScale = useOrdinalScale(search, { range: palette });

  const hasMultipleSearchTerms = search.length > 1;

  const chart = (
    <HorizontalStackedBarChart
      visxData={formattedOrganDatasetTypeData}
      xScale={xScale}
      yScale={yScale}
      colorScale={colorScale}
      keys={search}
      margin={margin}
      yAxisTickLabels={formattedOrganDatasetTypeData.map((d) => d.datasetType)}
      getY={(d) => d.datasetType}
      yAxisLabel="Assay Type"
      xAxisLabel="Number of Datasets"
      srOnlyLabels
      showTooltipAndHover={hasMultipleSearchTerms}
      getBarHref={(d) =>
        getSearchURL({
          entityType: 'Dataset',
          organTerms: search,
          assay: d.bar.data.datasetType,
          assayTypeMap: datasetTypeMap,
        })
      }
    />
  );

  const wrappedChart = hasMultipleSearchTerms ? (
    <ChartWrapper margin={margin} colorScale={colorScale}>
      {chart}
    </ChartWrapper>
  ) : (
    chart
  );

  return <ChartArea>{wrappedChart}</ChartArea>;
}

export default OrganDatasetsChart;
