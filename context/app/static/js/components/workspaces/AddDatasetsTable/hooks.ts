import { useState, SyntheticEvent, useCallback } from 'react';

import { useSearchHits } from 'js/hooks/useSearchData';
import { Dataset } from 'js/components/types';
import { useWorkspaceDetail } from '../hooks';

interface BuildIDPrefixQueryType {
  value: string;
  valuePrefix?: string;
  uuidsToExclude?: string[];
}

function buildIDPrefixQuery({ value, valuePrefix = '', uuidsToExclude = [] }: BuildIDPrefixQueryType) {
  return {
    query: {
      bool: {
        must: [
          {
            prefix: {
              'hubmap_id.keyword': {
                value: `${valuePrefix}${value}`,
                case_insensitive: true,
              },
            },
          },
          {
            term: {
              entity_type: {
                value: 'dataset',
              },
            },
          },
          {
            term: {
              mapped_data_access_level: {
                value: 'public',
              },
            },
          },
          {
            bool: {
              must_not: [
                {
                  ids: {
                    values: uuidsToExclude,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    _source: ['hubmap_id', 'uuid', 'assay_display_name', 'origin_samples_unique_mapped_organs'],
    size: 10,
    sort: 'hubmap_id.keyword',
  };
}

interface Hit<Doc extends Record<string, unknown>> {
  _source: Doc;
}

interface Hits<Doc extends Record<string, unknown>> {
  searchHits: Hit<Doc>[];
  isLoading: boolean;
}

type SearchAheadDoc = Pick<
  Dataset,
  'hubmap_id' | 'uuid' | 'origin_samples_unique_mapped_organs' | 'assay_display_name'
>;

type SearchAheadHit = Hit<SearchAheadDoc>;
type SearchAheadHits = Hits<SearchAheadDoc>;

function useSearchAhead({ value, valuePrefix = '', uuidsToExclude = [] }: BuildIDPrefixQueryType) {
  return useSearchHits(buildIDPrefixQuery({ value, valuePrefix, uuidsToExclude })) as SearchAheadHits;
}

function useDatasetsAutocomplete({
  workspaceId,
  selectedDatasets = [],
  updateDatasetsFormState,
}: {
  workspaceId: number;
  selectedDatasets: string[];
  updateDatasetsFormState: (datasetUUIDS: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState('');
  const [autocompleteValue, setAutocompleteValue] = useState<SearchAheadHit | null>(null);

  const addDataset = useCallback(
    (e: SyntheticEvent<Element, Event>, newValue: SearchAheadHit | null) => {
      const uuid = newValue?._source?.uuid;
      if (uuid) {
        setAutocompleteValue(newValue);
        updateDatasetsFormState([...selectedDatasets, uuid]);
      }
    },
    [selectedDatasets, updateDatasetsFormState],
  );

  const removeDatasets = useCallback(
    (uuids: string[]) => {
      const selectedDatasetsSet = new Set(selectedDatasets);
      uuids.forEach((uuid) => selectedDatasetsSet.delete(uuid));
      updateDatasetsFormState([...selectedDatasetsSet]);
    },
    [selectedDatasets, updateDatasetsFormState],
  );

  const resetAutocompleteState = useCallback(() => {
    setInputValue('');
    setAutocompleteValue(null);
  }, [setInputValue, setAutocompleteValue]);

  const { workspaceDatasets } = useWorkspaceDetail({ workspaceId });
  const allDatasets = [...workspaceDatasets, ...selectedDatasets];
  const { searchHits } = useSearchAhead({ value: inputValue, valuePrefix: 'HBM', uuidsToExclude: allDatasets });

  return {
    inputValue,
    setInputValue,
    autocompleteValue,
    selectedDatasets,
    addDataset,
    removeDatasets,
    resetAutocompleteState,
    workspaceDatasets,
    allDatasets,
    searchHits,
  };
}

type UseDatasetsAutocompleteReturnType = ReturnType<typeof useDatasetsAutocomplete>;

export { type SearchAheadHit, type UseDatasetsAutocompleteReturnType, useDatasetsAutocomplete };
