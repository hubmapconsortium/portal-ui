import React, { useState, useContext } from 'react';

import CellsService from 'js/components/cells/CellsService';
import { AppContext } from 'js/components/Providers';
import { fetchSearchData } from 'js/hooks/useSearchData';
import useCellsChartLoadingStore from 'js/stores/useCellsChartLoadingStore';

const storeSelector = (state) => state.resetFetchedUUIDs;

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
      'origin_sample.mapped_organ',
      'donor',
      'last_modified_timestamp',
    ],
  };
}

function useDatasetsSelectedByExpression({
  completeStep,
  setResults,
  setIsLoading,
  queryType,
  cellVariableNames,
  minExpressionLog,
  minCellPercentage,
}) {
  const [message, setMessage] = useState(null);
  const { elasticsearchEndpoint, groupsToken } = useContext(AppContext);
  const [genomicModality, setGenomicModality] = useState('rna');
  const resetFetchedUUIDs = useCellsChartLoadingStore(storeSelector);

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
      setResults(searchResults.hits.hits);
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

  return { genomicModality, handleSelectModality, handleSubmit, message };
}

export { useDatasetsSelectedByExpression };
