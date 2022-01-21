import React, { useState, useEffect, useRef } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

import DatasetClusterChart from 'js/components/cells/DatasetClusterChart';
import CellExpressionHistogram from 'js/components/cells/CellExpressionHistogram';
import CellsService from 'js/components/cells/CellsService';

import { Flex, ChartWrapper, StyledTypography } from './style';

async function fetchCellsChartsData({ uuid, cellVariableName, minExpression }) {
  const cs = new CellsService();
  const expressionURL = cs.getCellExpressionInDatasetURL({
    uuid,
    cellVariableNames: [cellVariableName],
  });

  const clusterURL = cs.getClusterCellMatchesInDatasetURL({
    uuid,
    cellVariableName,
    minExpression,
  });

  const [expressionData, clusterData] = await Promise.all(
    [expressionURL, clusterURL].map(async (url) => {
      const response = await fetch(url, { method: 'POST' });
      if (!response.ok) {
        console.error('Expected "message" or "results"');
      }

      const json = await response.json();
      if ('message' in json) {
        throw Error(json.message);
      }
      return json.results;
    }),
  );

  return { expressionData, clusterData };
}

function CellsCharts({ uuid, cellVariableName, minExpression, queryType, heightRef, isExpanded }) {
  const [isLoading, setIsLoading] = useState(true);
  const [diagnosticInfo, setDiagnosticInfo] = useState();

  const loadedOnce = useRef(false);

  const [cellsData, setCellsData] = useState({});

  useEffect(() => {
    async function getChartData() {
      setIsLoading(true);
      const t0 = performance.now();
      const { expressionData, clusterData } = await fetchCellsChartsData({ uuid, cellVariableName, minExpression });
      const t1 = performance.now();
      const timeWaiting = (t1 - t0) / 1000;
      const numCells = 200; // use actual n
      setDiagnosticInfo({ numCells, timeWaiting });
      setCellsData({ expressionData, clusterData });
      setIsLoading(false);
      loadedOnce.current = true;
    }
    if (loadedOnce.current) {
      return;
    }

    if (isExpanded) {
      getChartData();
    }
  }, [uuid, cellVariableName, minExpression, isExpanded]);

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
