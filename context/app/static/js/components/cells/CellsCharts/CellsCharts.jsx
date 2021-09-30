import React, { useState, useCallback } from 'react';
import DatasetClusterChart from 'js/components/cells/DatasetClusterChart';
import CellExpressionHistogram from 'js/components/cells/CellExpressionHistogram';

import { Flex, ChartWrapper } from './style';

function CellsCharts({ uuid, cellVariableName, minExpression, queryType, heightRef, isExpanded }) {
  const histogramKey = 'cell-histogram';
  const clusterChartKey = 'cluster-bar';
  const [isLoading, setIsLoading] = useState({ [histogramKey]: true, [clusterChartKey]: true });

  const finishLoading = useCallback((key) => {
    setIsLoading((prevState) => {
      return {
        ...prevState,
        [key]: false,
      };
    });
  }, []);

  return (
    <Flex ref={heightRef}>
      <ChartWrapper>
        <CellExpressionHistogram
          uuid={uuid}
          cellVariableName={cellVariableName}
          isLoading={isLoading}
          finishLoading={finishLoading}
          loadingKey={histogramKey}
          isExpanded={isExpanded}
        />
      </ChartWrapper>
      <ChartWrapper>
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
  );
}

export default CellsCharts;
