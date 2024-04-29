import React, { useCallback, useState } from 'react';
import CellsService from 'js/components/cells/CellsService';
import { useAppContext } from 'js/components/Contexts';
import { fetchSearchData } from 'js/hooks/useSearchData';
import useCellsChartLoadingStore, { CellsChartLoadingStore } from 'js/stores/useCellsChartLoadingStore';
import { useStore, CellsSearchStore } from 'js/components/cells/store';
import { useAccordionStep } from 'js/shared-styles/accordions/StepAccordion';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { QueryType } from '../queryTypes';
import { CellsResultsDataset, WrappedCellsResultsDataset } from '../types';

const chartsStoreSelector = (state: CellsChartLoadingStore) => state.resetFetchedUUIDs;

const cellsStoreSelector = (state: CellsSearchStore) => ({
  setResults: state.setResults,
  setResultCounts: state.setResultCounts,
  minExpressionLog: state.minExpressionLog,
  setMinExpressionLog: state.setMinExpressionLog,
  minCellPercentage: state.minCellPercentage,
  setMinCellPercentage: state.setMinCellPercentage,
  cellVariableNames: state.cellVariableNames,
  setCellVariableNames: state.setCellVariableNames,
  queryType: state.queryType,
  setIsLoading: state.setIsLoading,
});

function getSearchQuery(cellsResults: { uuid: string }[]) {
  return {
    size: 10000,
    post_filter: {
      bool: {
        must: [
          {
            term: {
              'entity_type.keyword': 'Dataset',
            },
          },
          {
            terms: {
              uuid: cellsResults.map((result) => result.uuid),
            },
          },
        ],
      },
    },
    _source: [
      'uuid',
      'hubmap_id',
      'mapped_data_types',
      'origin_samples_unique_mapped_organs',
      'donor',
      'last_modified_timestamp',
    ],
  };
}

function buildHitsMap<T>(hits: SearchHit<T>[]) {
  return hits.reduce(
    (acc, hit) => {
      acc[hit._id] = hit;
      return acc;
    },
    {} as Record<string, SearchHit<T>>,
  );
}

function createStepText(
  queryType: QueryType,
  cellVariableNames: string[],
  minExpressionLog: number,
  minCellPercentage: number,
) {
  if (queryType === 'cell-type') {
    return cellVariableNames.join(', ');
  }
  return (
    <>
      {cellVariableNames.join(', ')} | Expression Level 10<sup>{minExpressionLog}</sup> | {minCellPercentage}% Cell
    </>
  );
}

function useDatasetsSelectedByExpression() {
  const { completeStep } = useAccordionStep();
  const [message, setMessage] = useState<string | null>(null);
  const { elasticsearchEndpoint, groupsToken } = useAppContext();
  const [genomicModality, setGenomicModality] = useState('rna');
  const resetFetchedUUIDs = useCellsChartLoadingStore(chartsStoreSelector);

  const {
    setResults,
    minExpressionLog,
    setMinExpressionLog,
    minCellPercentage,
    setMinCellPercentage,
    cellVariableNames,
    setCellVariableNames,
    queryType,
    setIsLoading,
    setResultCounts,
  } = useStore(cellsStoreSelector);

  const { toastError } = useSnackbarActions();

  function handleSelectModality(event: React.ChangeEvent<HTMLInputElement>) {
    setGenomicModality(event.target.value);
  }

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setResults([]);
    resetFetchedUUIDs();
    const queryParams = {
      type: queryType,
      cellVariableNames,
      minExpression: 10 ** minExpressionLog,
      minCellPercentage,
      modality: queryType === 'gene' ? genomicModality : undefined,
    };
    try {
      completeStep(createStepText(queryType, cellVariableNames, minExpressionLog, minCellPercentage));
      /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
      const serviceResults = await new CellsService().getDatasets(queryParams);
      const datasets = 'list' in serviceResults ? serviceResults.list : serviceResults;

      const searchResults = await fetchSearchData(getSearchQuery(datasets), elasticsearchEndpoint, groupsToken);

      const hitsMap = buildHitsMap<CellsResultsDataset>(searchResults.hits.hits);

      setResults(
        datasets.reduce((acc, { uuid }: { uuid: string }) => {
          // The cells api returns all versions of a matching dataset and the search-api query will only return the most recent version.
          if (uuid in hitsMap && hitsMap[uuid]._source !== undefined) {
            acc.push(hitsMap[uuid] as WrappedCellsResultsDataset);
          }
          return acc;
        }, [] as WrappedCellsResultsDataset[]),
      );
      /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
      if ('list' in serviceResults) {
        setResultCounts(serviceResults);
      }
      setIsLoading(false);
    } catch (e) {
      if (e instanceof Error) {
        toastError(e.message);
        setMessage(e.message);
        setIsLoading(false);
        // TODO: The message is displayed in this component...
        // but after the user submits their data, the component collapses,
        // so the message is hidden, and the user just sees the please wait.
        // Not sure what the best long term solution is, but this unblocks Nils.
        // eslint-disable-next-line no-alert
        // alert(e.message);
      }
    }
  }, [
    setResultCounts,
    cellVariableNames,
    completeStep,
    elasticsearchEndpoint,
    genomicModality,
    groupsToken,
    minCellPercentage,
    minExpressionLog,
    queryType,
    resetFetchedUUIDs,
    setIsLoading,
    setResults,
    toastError,
  ]);

  return {
    genomicModality,
    handleSelectModality,
    handleSubmit,
    message,
    queryType,
    minExpressionLog,
    setMinExpressionLog,
    minCellPercentage,
    setMinCellPercentage,
    cellVariableNames,
    setCellVariableNames,
  };
}

export { buildHitsMap, useDatasetsSelectedByExpression };
