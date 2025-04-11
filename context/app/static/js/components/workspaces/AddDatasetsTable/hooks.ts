import { useState, SyntheticEvent } from 'react';
import { useEventCallback } from '@mui/material/utils';

import { useSearchHits } from 'js/hooks/useSearchData';
import { Dataset } from 'js/components/types';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { trackEvent } from 'js/helpers/trackers';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';

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
  const { toastSuccessAddDataset } = useWorkspaceToasts();

  const removeDatasets = useEventCallback((uuids: string[]) => {
    const updatedDatasets = selectedDatasets.filter((uuid) => !uuids.includes(uuid));
    updateDatasetsFormState(updatedDatasets);

    // Trigger a re-render to update the table results
    setRefresh((prev) => !prev);
  });

  const resetAutocompleteState = useEventCallback(() => {
    setInputValue('');
    setAutocompleteValue(null);
  });

  const addDataset = useEventCallback((e: SyntheticEvent<Element, Event>, newValue: SearchAheadHit | null) => {
    const uuid = newValue?._source?.uuid;

    if (uuid) {
      trackEvent({
        category: WorkspacesEventCategories.WorkspaceDialog,
        action: 'Add datasets via dropdown',
        label: uuid,
      });

      updateDatasetsFormState([...selectedDatasets, uuid]);
      resetAutocompleteState();
      toastSuccessAddDataset(newValue._source.hubmap_id);
    }
  });

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
