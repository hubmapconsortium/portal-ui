import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

import DatasetClusterChart from 'js/components/cells/DatasetClusterChart';
import CellExpressionHistogram from 'js/components/cells/CellExpressionHistogram';

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
          <CellExpressionHistogram
            isLoading={isLoading}
            queryType={queryType}
            expressionData={
              'expressionData' in cellsData ? cellsData.expressionData.map((d) => d.values[cellVariableName]) : {}
            }
          />
        </ChartWrapper>
        <ChartWrapper $flexBasis={55}>
          <DatasetClusterChart
            uuid={uuid}
            isLoading={isLoading}
            results={'clusterData' in cellsData ? cellsData.clusterData : {}}
          />
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
