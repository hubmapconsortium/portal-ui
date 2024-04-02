import { useSearchHits } from 'js/hooks/useSearchData';
import { Dataset } from 'js/components/Contexts';

import { useForm } from 'react-hook-form';

import { useHandleUpdateWorkspace } from '../hooks';

interface BuildIDPrefixQueryType {
  value: string;
  valuePrefix?: string;
}

function buildIDPrefixQuery({ value, valuePrefix = '' }: BuildIDPrefixQueryType) {
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
        ],
      },
    },
    _source: ['hubmap_id', 'uuid'],
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

type SearchAheadDoc = Pick<Dataset, 'hubmap_id' | 'uuid'>;

type SearchAheadHit = Hit<SearchAheadDoc>;
type SearchAheadHits = Hits<SearchAheadDoc>;

function useSearchAhead({ value, valuePrefix = '' }: BuildIDPrefixQueryType) {
  return useSearchHits(buildIDPrefixQuery({ value, valuePrefix })) as SearchAheadHits;
}

interface UseAddWorkspaceDatasetsTypes {
  workspaceId: number;
}

interface SubmitAddDatasetsTypes {
  datasetUUIDs: string[];
}

function useAddWorkspaceDatasets({ workspaceId }: UseAddWorkspaceDatasetsTypes) {
  const { handleUpdateWorkspace } = useHandleUpdateWorkspace({ workspaceId });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    mode: 'onChange',
  });

  async function onSubmit({ datasetUUIDs }: SubmitAddDatasetsTypes) {
    await handleUpdateWorkspace({
      workspace_details: {
        symlinks: datasetUUIDs.map((uuid) => ({
          name: `datasets/${uuid}`,
          dataset_uuid: uuid,
        })),
      },
    });
  }

  return {
    handleSubmit,
    control,
    errors,
    onSubmit,
    reset,
    isSubmitting: isSubmitting || isSubmitSuccessful,
  };
}

export { useSearchAhead, type SearchAheadHit, useAddWorkspaceDatasets };
