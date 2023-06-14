import React, { useState } from 'react';
import CellsService from 'js/components/cells/CellsService';
import { useAppContext } from 'js/components/Contexts';
import { fetchSearchData } from 'js/hooks/useSearchData';
import useCellsChartLoadingStore from 'js/stores/useCellsChartLoadingStore';
import { useStore } from 'js/components/cells/store';

const chartsStoreSelector = (state) => state.resetFetchedUUIDs;

const cellsStoreSelector = (state) => ({
  setResults: state.setResults,
  minExpressionLog: state.minExpressionLog,
  setMinExpressionLog: state.setMinExpressionLog,
  minCellPercentage: state.minCellPercentage,
  setMinCellPercentage: state.setMinCellPercentage,
  cellVariableNames: state.cellVariableNames,
  setCellVariableNames: state.setCellVariableNames,
  queryType: state.queryType,
  setIsLoading: state.setIsLoading,
});

function getSearchQuery(cellsResults) {
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

function buildHitsMap(hits) {
  return hits.reduce((acc, hit) => {
    // eslint-disable-next-line no-underscore-dangle
    acc[hit._id] = hit;
    return acc;
  }, {});
}

function useDatasetsSelectedByExpression({ completeStep }) {
  const [message, setMessage] = useState(null);
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
  } = useStore(cellsStoreSelector);

  function handleSelectModality(event) {
    setGenomicModality(event.target.value);
  }

  async function handleSubmit() {
    setIsLoading(true);
    setResults([]);
    resetFetchedUUIDs();
    const queryParams = {
      type: queryType,
      cellVariableNames,
      minExpression: 10 ** minExpressionLog,
      minCellPercentage,
    };
    if (queryType === 'gene') {
      queryParams.modality = genomicModality;
    }
    try {
      completeStep(
        <>
          {cellVariableNames.join(', ')} | Expression Level 10<sup>{minExpressionLog}</sup> | {minCellPercentage}% Cell
          Percentage
        </>,
      );
      const serviceResults = await new CellsService().getDatasets(queryParams);
      const searchResults = await fetchSearchData(getSearchQuery(serviceResults), elasticsearchEndpoint, groupsToken);

      const hitsMap = buildHitsMap(searchResults.hits.hits);
      setResults(
        serviceResults.reduce((acc, { uuid }) => {
          // The cells api returns all versions of a matching dataset and the search-api query will only return the most recent version.
          if (uuid in hitsMap) {
            acc.push(hitsMap[uuid]);
          }
          return acc;
        }, []),
      );
      setIsLoading(false);
    } catch (e) {
      setMessage(e.message);
      // TODO: The message is displayed in this component...
      // but after the user submits their data, the component collapses,
      // so the message is hidden, and the user just sees the please wait.
      // Not sure what the best long term solution is, but this unblocks Nils.
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  }

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
