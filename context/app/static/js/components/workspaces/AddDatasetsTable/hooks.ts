import { useState, SyntheticEvent, useCallback } from 'react';

import { useSearchHits } from 'js/hooks/useSearchData';
import { Dataset } from 'js/components/types';
import { useSnackbarActions } from 'js/shared-styles/snackbars/store';
import { DatasetAddSuccessToast } from '../WorkspaceToasts';

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
  workspaceDatasets = [],
  selectedDatasets = [],
  updateDatasetsFormState,
}: {
  workspaceDatasets?: string[];
  selectedDatasets: string[];
  updateDatasetsFormState: (datasetUUIDS: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState('');
  const [, setRefresh] = useState(false);
  const [autocompleteValue, setAutocompleteValue] = useState<SearchAheadHit | null>(null);
  const { toastSuccess } = useSnackbarActions();

  const removeDatasets = useCallback(
    (uuids: string[]) => {
      const updatedDatasets = selectedDatasets.filter((uuid) => !uuids.includes(uuid));
      updateDatasetsFormState(updatedDatasets);

      // Trigger a re-render to update the table results
      setRefresh((prev) => !prev);
    },
    [selectedDatasets, updateDatasetsFormState],
  );

  const resetAutocompleteState = useCallback(() => {
    setInputValue('');
    setAutocompleteValue(null);
  }, [setInputValue, setAutocompleteValue]);

  const addDataset = useCallback(
    (e: SyntheticEvent<Element, Event>, newValue: SearchAheadHit | null) => {
      const uuid = newValue?._source?.uuid;

      if (uuid) {
        updateDatasetsFormState([...selectedDatasets, uuid]);
        resetAutocompleteState();
        toastSuccess(DatasetAddSuccessToast(newValue._source.hubmap_id));
      }
    },
    [selectedDatasets, updateDatasetsFormState, resetAutocompleteState, toastSuccess],
  );

  const allDatasets = [...workspaceDatasets, ...selectedDatasets];
  const { searchHits } = useSearchAhead({ value: inputValue, valuePrefix: 'HBM', uuidsToExclude: allDatasets });

  return {
    inputValue,
    setInputValue,
    autocompleteValue,
    selectedDatasets,
    removeDatasets,
    resetAutocompleteState,
    addDataset,
    workspaceDatasets,
    allDatasets,
    searchHits,
  };
}

type UseDatasetsAutocompleteReturnType = ReturnType<typeof useDatasetsAutocomplete>;

export { type SearchAheadHit, type UseDatasetsAutocompleteReturnType, useDatasetsAutocomplete };
