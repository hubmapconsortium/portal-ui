import { useState, useEffect, useRef } from 'react';
import CellsService from 'js/components/cells/CellsService';

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
        throw Error('Expected "message" or "results"');
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

function useCellsChartsData({ uuid, cellVariableName, minExpression, isExpanded }) {
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
  }, [cellVariableName, isExpanded, minExpression, uuid]);

  return { isLoading, diagnosticInfo, cellsData };
}

export { useCellsChartsData };
