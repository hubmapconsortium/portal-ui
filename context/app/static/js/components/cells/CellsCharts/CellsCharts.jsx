import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

import DatasetClusterChart from 'js/components/cells/DatasetClusterChart';
import CellExpressionHistogram from 'js/components/cells/CellExpressionHistogram';
import ChartLoader from 'js/shared-styles/charts/ChartLoader/ChartLoader';
import { useCellsChartsData } from './hooks';
import { Flex, ChartWrapper, StyledTypography } from './style';

function CellsCharts({ uuid, cellVariableName, minExpression, queryType, heightRef, isExpanded }) {
  const { isLoading, diagnosticInfo, cellsData } = useCellsChartsData({
    uuid,
    cellVariableName,
    minExpression,
    isExpanded,
  });

  return (
    <div ref={heightRef}>
      <Flex>
        <ChartWrapper $flexBasis={45}>
          <ChartLoader isLoading={isLoading}>
            <CellExpressionHistogram
              queryType={queryType}
              expressionData={
                'expressionData' in cellsData ? cellsData.expressionData.map((d) => d.values[cellVariableName]) : {}
              }
            />
          </ChartLoader>
        </ChartWrapper>
        <ChartWrapper $flexBasis={55}>
          <ChartLoader isLoading={isLoading}>
            <DatasetClusterChart uuid={uuid} results={'clusterData' in cellsData ? cellsData.clusterData : {}} />
          </ChartLoader>
        </ChartWrapper>
      </Flex>
      <StyledTypography>
        {diagnosticInfo ? (
          `${diagnosticInfo.timeWaiting.toFixed(2)} seconds to receive an API response for ${
            diagnosticInfo.numCells
          } cells.`
        ) : (
          <Skeleton />
        )}
      </StyledTypography>
    </div>
  );
}

export default CellsCharts;
