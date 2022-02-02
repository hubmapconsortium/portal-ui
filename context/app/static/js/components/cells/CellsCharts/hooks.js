import { useState, useEffect } from 'react';
import CellsService from 'js/components/cells/CellsService';
import useCellsChartLoadingStore from 'js/stores/useCellsChartLoadingStore';

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

const storeSelector = (state) => ({
  loadingUUID: state.loadingUUID,
  setLoadingUUID: state.setLoadingUUID,
  fetchedUUIDs: state.fetchedUUIDs,
  addFetchedUUID: state.addFetchedUUID,
});

function useCellsChartsData({ uuid, cellVariableName, minExpression, isExpanded }) {
  const { loadingUUID, setLoadingUUID, addFetchedUUID, fetchedUUIDs } = useCellsChartLoadingStore(storeSelector);

  const [diagnosticInfo, setDiagnosticInfo] = useState();

  const [cellsData, setCellsData] = useState({});

  const isLoading = loadingUUID === uuid;

  useEffect(() => {
    async function getChartData() {
      setLoadingUUID(uuid);
      const t0 = performance.now();
      const { expressionData, clusterData } = await fetchCellsChartsData({ uuid, cellVariableName, minExpression });
      const t1 = performance.now();
      const timeWaiting = (t1 - t0) / 1000;
      const numCells = expressionData.length;
      setDiagnosticInfo({ numCells, timeWaiting });
      setCellsData({ expressionData, clusterData });
      addFetchedUUID(uuid); // state updates aren't batched in promises until react 18. addFetchedUUID must be called before setLoadingUUID to avoid multiple requests.
      setLoadingUUID(null);
    }
    if (fetchedUUIDs.has(uuid) || isLoading) {
      return;
    }

    if (isExpanded) {
      getChartData();
    }
  }, [addFetchedUUID, cellVariableName, fetchedUUIDs, isExpanded, isLoading, minExpression, setLoadingUUID, uuid]);

  return { isLoading, diagnosticInfo, cellsData };
}

export { useCellsChartsData };
