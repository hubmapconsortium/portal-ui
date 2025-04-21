import React from 'react';
import Skeleton from '@mui/material/Skeleton';

import DatasetClusterChart from 'js/components/cells/DatasetClusterChart';
import CellExpressionHistogram from 'js/components/cells/CellExpressionHistogram';
import ChartLoader from 'js/shared-styles/charts/ChartLoader/ChartLoader';
import Box from '@mui/material/Box';
import { Dataset } from 'js/components/types';
import { useCellsChartsData } from './hooks';
import { ChartWrapper, StyledTypography } from './style';
import { useCellVariableNames, useMolecularDataQueryFormState } from '../MolecularDataQueryForm/hooks';

function CellsCharts({ uuid }: Dataset) {
  const { watch } = useMolecularDataQueryFormState();
  const minExpressionLog = watch('minimumExpressionLevel');
  const queryType = watch('queryType');
  const cellVariableNames = useCellVariableNames();

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
    <Box padding={2} width="100%">
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
    </Box>
  );
}

export default CellsCharts;
