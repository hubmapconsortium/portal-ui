import React, { useState, useCallback } from 'react';

import DatasetClusterChart from 'js/components/cells/DatasetClusterChart';
import CellExpressionHistogram from 'js/components/cells/CellExpressionHistogram';
import Skeleton from '@material-ui/lab/Skeleton';

import { Flex, ChartWrapper, StyledTypography } from './style';

function CellsCharts({ uuid, cellVariableName, minExpression, queryType, heightRef, isExpanded }) {
  const histogramKey = 'cell-histogram';
  const clusterChartKey = 'cluster-bar';
  const [isLoading, setIsLoading] = useState({ [histogramKey]: true, [clusterChartKey]: true });
  const [diagnosticInfo, setDiagnosticInfo] = useState();

  const finishLoading = useCallback((key) => {
    setIsLoading((prevState) => {
      return {
        ...prevState,
        [key]: false,
      };
    });
  }, []);

  return (
    <div ref={heightRef}>
      <Flex>
        <ChartWrapper $flexBasis={45}>
          <CellExpressionHistogram
            uuid={uuid}
            cellVariableName={cellVariableName}
            isLoading={isLoading}
            finishLoading={finishLoading}
            loadingKey={histogramKey}
            isExpanded={isExpanded}
            setDiagnosticInfo={setDiagnosticInfo}
          />
        </ChartWrapper>
        <ChartWrapper $flexBasis={55}>
          <DatasetClusterChart
            uuid={uuid}
            cellVariableName={cellVariableName}
            minExpression={minExpression}
            queryType={queryType}
            isLoading={isLoading}
            finishLoading={finishLoading}
            loadingKey={clusterChartKey}
            isExpanded={isExpanded}
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
