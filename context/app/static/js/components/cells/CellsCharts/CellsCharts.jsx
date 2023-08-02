import React from 'react';
import Skeleton from '@mui/material/Skeleton';

import DatasetClusterChart from 'js/components/cells/DatasetClusterChart';
import CellExpressionHistogram from 'js/components/cells/CellExpressionHistogram';
import ChartLoader from 'js/shared-styles/charts/ChartLoader/ChartLoader';
import { useCellsChartsData } from './hooks';
import { ChartWrapper, StyledTypography, PaddedDiv } from './style';

function CellsCharts({ uuid, cellVariableName, minExpression, queryType, isExpanded }) {
  const { isLoading, diagnosticInfo, cellsData } = useCellsChartsData({
    uuid,
    cellVariableName,
    minExpression,
    isExpanded,
  });

  const expressionData = 'expressionData' in cellsData ? cellsData.expressionData : {};
  const clusterData = 'clusterData' in cellsData ? cellsData.clusterData : {};

  if (!(isLoading || Object.keys(cellsData).length > 0)) {
    return null;
  }

  return (
    <PaddedDiv>
      <div>
        <ChartWrapper>
          <ChartLoader isLoading={isLoading}>
            <CellExpressionHistogram queryType={queryType} expressionData={expressionData} />
          </ChartLoader>
        </ChartWrapper>
        <ChartWrapper>
          <ChartLoader isLoading={isLoading}>
            <DatasetClusterChart uuid={uuid} results={clusterData} />
          </ChartLoader>
        </ChartWrapper>
      </div>
      <StyledTypography>
        {diagnosticInfo ? (
          `${diagnosticInfo.timeWaiting.toFixed(2)} seconds to receive an API response for ${
            diagnosticInfo.numCells
          } cells.`
        ) : (
          <Skeleton />
        )}
      </StyledTypography>
    </PaddedDiv>
  );
}

export default CellsCharts;
