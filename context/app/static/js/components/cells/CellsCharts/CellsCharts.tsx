import React from 'react';
import Skeleton from '@mui/material/Skeleton';

import DatasetClusterChart from 'js/components/cells/DatasetClusterChart';
import { useStore, CellsSearchStore } from 'js/components/cells/store';
import CellExpressionHistogram from 'js/components/cells/CellExpressionHistogram';
import ChartLoader from 'js/shared-styles/charts/ChartLoader/ChartLoader';
import { useCellsChartsData } from './hooks';
import { ChartWrapper, StyledTypography, PaddedDiv } from './style';
import { DatasetCellsChartsProps } from './types';

const cellsStoreSelector = (state: CellsSearchStore) => ({
  minExpressionLog: state.minExpressionLog,
  cellVariableNames: state.cellVariableNames,
  queryType: state.queryType,
});

function CellsCharts({ uuid }: DatasetCellsChartsProps) {
  const { minExpressionLog, cellVariableNames, queryType } = useStore(cellsStoreSelector);

  const { isLoading, diagnosticInfo, cellsData } = useCellsChartsData({
    uuid,
    cellVariableName: cellVariableNames[0],
    minExpression: minExpressionLog,
  });

  const expressionData = cellsData?.expressionData ?? [];
  const clusterData = cellsData?.clusterData ?? {};

  if (!(isLoading || Object.keys(cellsData).length > 0)) {
    return null;
  }

  return (
    <PaddedDiv>
      <div>
        <ChartWrapper>
          <ChartLoader isLoading={isLoading}>
            <CellExpressionHistogram
              queryType={queryType}
              expressionData={expressionData}
              cellVariableName={cellVariableNames[0]}
            />
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
