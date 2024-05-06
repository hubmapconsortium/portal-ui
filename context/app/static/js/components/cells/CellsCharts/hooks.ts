import { useState, useEffect } from 'react';
import CellsService, { CellExpressionInDataset } from 'js/components/cells/CellsService';
import useCellsChartLoadingStore, { CellsChartLoadingStore } from 'js/stores/useCellsChartLoadingStore';
import { useTutorialStore } from 'js/shared-styles/tutorials/TutorialProvider';
import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useExpandableRowStore } from 'js/shared-styles/tables/ExpandableRow/store';
import { extractCLID } from '../CellTypeResults/utils';

interface CellsChartsDataProps {
  uuid: string;
  cellVariableName: string;
  minExpression: number;
}

async function fetchCellsChartsData({ uuid, cellVariableName, minExpression }: CellsChartsDataProps) {
  const cs = new CellsService();

  const [expressionData, clusterData] = await Promise.all([
    cs.getCellExpressionInDataset({
      uuid,
      cellVariableNames: [cellVariableName],
    }),
    cs.getClusterCellMatchesInDataset({
      uuid,
      cellVariableName,
      minExpression,
    }),
  ]);

  return { expressionData, clusterData };
}

const storeSelector = (state: CellsChartLoadingStore) => ({
  loadingUUID: state.loadingUUID,
  setLoadingUUID: state.setLoadingUUID,
  fetchedUUIDs: state.fetchedUUIDs,
  addFetchedUUID: state.addFetchedUUID,
});

interface DiagnosticInfo {
  numCells: number;
  timeWaiting: number;
}

function useCellsChartsData({ uuid, cellVariableName, minExpression }: CellsChartsDataProps) {
  const { loadingUUID, setLoadingUUID, addFetchedUUID, fetchedUUIDs } = useCellsChartLoadingStore(storeSelector);

  const { isExpanded } = useExpandableRowStore();
  const { isTutorialRunning, setNextButtonIsDisabled } = useTutorialStore();

  const [diagnosticInfo, setDiagnosticInfo] = useState<DiagnosticInfo>();

  const [cellsData, setCellsData] = useState({});

  const isLoading = loadingUUID === uuid;

  useEffect(() => {
    async function getChartData() {
      setLoadingUUID(uuid);
      const t0 = performance.now();
      const { expressionData, clusterData } = await fetchCellsChartsData({ uuid, cellVariableName, minExpression });
      const t1 = performance.now();
      const numCells = expressionData.length;
      const timeWaiting = (t1 - t0) / 1000;
      setDiagnosticInfo({ numCells, timeWaiting });
      setCellsData({ expressionData: expressionData.map((d) => d.values[cellVariableName]), clusterData });
      addFetchedUUID(uuid); // state updates aren't batched in promises until react 18. addFetchedUUID must be called before setLoadingUUID to avoid multiple requests.
      setLoadingUUID(null);

      if (isTutorialRunning) {
        setNextButtonIsDisabled(false);
      }
    }
    if (fetchedUUIDs.has(uuid) || isLoading) {
      return;
    }

    if (isExpanded) {
      getChartData().catch((e) => {
        console.error('Error fetching cells charts data', e);
        setLoadingUUID(null);
      });
    }
  }, [
    addFetchedUUID,
    cellVariableName,
    fetchedUUIDs,
    isExpanded,
    isLoading,
    minExpression,
    setLoadingUUID,
    setNextButtonIsDisabled,
    isTutorialRunning,
    uuid,
  ]);

  return { isLoading, diagnosticInfo, cellsData };
}

type UseCellTypesChartsDataProps = Pick<CellsChartsDataProps, 'uuid'> & {
  cellVariableNames: string[];
};

function useCellTypesChartsData({ uuid, cellVariableNames: cellNames }: UseCellTypesChartsDataProps) {
  const cellVariableNames = cellNames.map(extractCLID).filter((clid) => clid) as string[];
  const { isExpanded } = useExpandableRowStore();
  const { data, ...rest } = useSWR<{ results: CellExpressionInDataset[] }, string | null>(
    isExpanded ? new CellsService().getCellExpressionInDatasetURL({ uuid, cellVariableNames }) : null,
    (url: string) => fetcher({ url, requestInit: { method: 'POST' } }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  return { expressionData: data, ...rest };
}

export { useCellsChartsData, useCellTypesChartsData };
