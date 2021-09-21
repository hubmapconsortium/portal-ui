import React, { useState, useCallback } from 'react';
import DatasetClusterChart from 'js/components/cells/DatasetClusterChart';
import CellExpressionHistogram from 'js/components/cells/CellExpressionHistogram';

import { Flex, ChartWrapper } from './style';

function CellsCharts({ uuid, cellVariableName, minExpression, queryType }) {
  const [isLoading, setIsLoading] = useState({});

  const finishLoading = useCallback((key) => {
    setIsLoading((prevState) => {
      return {
        ...prevState,
        [key]: false,
      };
    });
  }, []);

  return (
    <Flex>
      <ChartWrapper>
        <CellExpressionHistogram
          uuid={uuid}
          cellVariableName={cellVariableName}
          isLoading={isLoading}
          finishLoading={finishLoading}
          loadingKey="histogram"
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
          loadingKey="cluster-bar"
        />
      </ChartWrapper>
    </Flex>
  );
}

export default CellsCharts;
