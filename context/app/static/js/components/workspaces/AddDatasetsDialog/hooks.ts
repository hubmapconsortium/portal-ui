import { useSearchHits } from 'js/hooks/useSearchData';
import { Dataset, useAppContext } from 'js/components/Contexts';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { datasetsField } from '../workspaceFormFields';

import { useHandleUpdateWorkspace } from '../hooks';

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

function useSearchAhead({ value, valuePrefix = '', uuidsToExclude = [] }: BuildIDPrefixQueryType) {
  return useSearchHits(buildIDPrefixQuery({ value, valuePrefix, uuidsToExclude })) as SearchAheadHits;
}

interface UseAddWorkspaceDatasetsTypes {
  workspaceId: number;
}

interface SubmitAddDatasetsTypes {
  datasetUUIDs: string[];
}

export interface AddDatasetsFormTypes {
  datasets: string[];
}

const schema = z
  .object({
    ...datasetsField,
  })
  .partial()
  .required({ datasets: true });

function useAddWorkspaceDatasets({ workspaceId }: UseAddWorkspaceDatasetsTypes) {
  const { handleUpdateWorkspace } = useHandleUpdateWorkspace({ workspaceId });
  const { groupsToken } = useAppContext();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<AddDatasetsFormTypes>({
    defaultValues: {
      datasets: [],
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  async function onSubmit({ datasetUUIDs }: SubmitAddDatasetsTypes) {
    await handleUpdateWorkspace({
      workspace_details: {
        globus_groups_token: groupsToken,
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
