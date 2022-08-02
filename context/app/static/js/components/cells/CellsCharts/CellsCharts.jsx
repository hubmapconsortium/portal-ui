import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

import DatasetClusterChart from 'js/components/cells/DatasetClusterChart';
import CellExpressionHistogram from 'js/components/cells/CellExpressionHistogram';
import ChartLoader from 'js/shared-styles/charts/ChartLoader/ChartLoader';
import { useCellsChartsData } from './hooks';
import { Flex, ChartWrapper, StyledTypography } from './style';

function CellsCharts({ uuid, cellVariableName, minExpression, queryType, isExpanded }) {
  const { isLoading, diagnosticInfo, cellsData } = useCellsChartsData({
    uuid,
    cellVariableName,
    minExpression,
    isExpanded,
  });

  const expressionData = 'expressionData' in cellsData ? cellsData.expressionData : {};
  const clusterData = 'clusterData' in cellsData ? cellsData.clusterData : {};

  return (
    <div>
      {(isLoading || Object.keys(cellsData).length > 0) && (
        <>
          <Flex>
            <ChartWrapper $flexBasis={45}>
              <ChartLoader isLoading={isLoading}>
                <CellExpressionHistogram queryType={queryType} expressionData={expressionData} />
              </ChartLoader>
            </ChartWrapper>
            <ChartWrapper $flexBasis={55}>
              <ChartLoader isLoading={isLoading}>
                <DatasetClusterChart uuid={uuid} results={clusterData} />
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
        </>
      )}
    </div>
  );
}

export default CellsCharts;
