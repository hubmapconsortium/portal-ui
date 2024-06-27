import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import useSWR from 'swr';
import { ProvData } from 'js/components/detailPage/provenance/types';
import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { fetchSearchData } from './useSearchData';

const getAncestorsQuery = (uuid: string) => ({
  query: {
    bool: {
      must: [
        {
          term: {
            'entity_type.keyword': 'Dataset',
          },
        },
        {
          term: {
            'processing.keyword': 'raw',
          },
        },
        {
          term: {
            descendant_ids: uuid,
          },
        },
        {
          terms: {
            'mapped_status.keyword': ['QA', 'Published'],
          },
        },
        {
          bool: {
            must_not: {
              exists: {
                field: 'next_revision_uuid',
              },
            },
          },
        },
        {
          bool: {
            must_not: {
              exists: {
                field: 'sub_status',
              },
            },
          },
        },
        {
          bool: {
            must_not: {
              term: {
                'ancestors.entity_type.keyword': 'Dataset',
              },
            },
          },
        },
      ],
    },
  },
  _source: {
    includes: ['uuid'],
  },
  size: 10000,
});

const getDescendantsQuery = (uuid: string | string[]): SearchRequest => ({
  query: {
    bool: {
      must_not: {
        exists: {
          field: 'descendant_ids',
        },
      },
      must: [
        {
          terms: {
            ancestor_ids: uuid,
          },
        },
        {
          terms: {
            'mapped_status.keyword': ['QA', 'Published'],
          },
        },
      ],
    },
  },
  _source: {
    includes: ['uuid'],
  },
  size: 10000,
});

function createProvDataURL(uuid: string, entityEndpoint: string) {
  return `${entityEndpoint}/entities/${uuid}/provenance`;
}

/**
 * Fetcher for legacy provenance data
 * This only fetches the ancestors of the entity
 * @param uuid UUID of the entity to fetch
 * @param entityEndpoint Base URL of the entities API endpoint
 * @param groupsToken Auth token for the request
 * @returns Provenance data
 */
async function getProvData(uuid: string, entityEndpoint: string, groupsToken: string): Promise<ProvData> {
  const headers = getAuthHeader(groupsToken);
  const url = createProvDataURL(uuid, entityEndpoint);
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error('Prov API failed to load data');
  }
  return response.json() as Promise<ProvData>;
}

/**
 * Fetcher for unified provenance data
 * This function
 * - fetches the topmost dataset ancestor(s) of the entity if any exist
 * - If the current entity is the topmost dataset ancestor, it is used as the root instead
 * - fetches the bottommost dataset descendants (leaves) of the root entity/ies
 * - fetches the provenance data of the leaves and combines them into a single provenance object
 * @param uuid UUID of the entity whose provenance is to be fetched
 * @param entityEndpoint Base URL of the entities API endpoint
 * @param groupsToken Auth token for the request
 * @param elasticsearchEndpoint URL of the elasticsearch endpoint for the ancestor/descendant queries
 * @returns Combined provenance data
 */
async function getCombinedProvData(
  uuid: string,
  entityEndpoint: string,
  groupsToken: string,
  elasticsearchEndpoint: string,
) {
  const topLevelDatasets = await fetchSearchData<{ uuid: string }, unknown>(
    getAncestorsQuery(uuid),
    elasticsearchEndpoint,
    groupsToken,
  );

  const topLevelDatasetIDs = topLevelDatasets.hits.hits.map((hit) => hit._id);
  const uuidsToFetch = topLevelDatasetIDs.length > 0 ? topLevelDatasetIDs : [uuid];

  const descendants = await fetchSearchData<{ uuid: string }, unknown>(
    getDescendantsQuery(uuidsToFetch),
    elasticsearchEndpoint,
    groupsToken,
  );

  const descendantIds = descendants.hits.hits.map((hit) => hit._id);

  const descendantProvenance = await Promise.all(
    descendantIds.map((id) => getProvData(id, entityEndpoint, groupsToken)),
  );

  if (descendantProvenance.length === 1) {
    return descendantProvenance[0];
  }
  // TODO: combine the provenance data
  // For now, just return the first one
  return descendantProvenance[0];
}

function useProvData(uuid: string, combined = false) {
  const { entityEndpoint, groupsToken, elasticsearchEndpoint } = useAppContext();

  const { data: provData, isLoading } = useSWR<ProvData, unknown, [string, string, boolean]>(
    [uuid, groupsToken, combined],
    ([idToFetch, authToken, useCombinedFetcher]) =>
      useCombinedFetcher
        ? getCombinedProvData(idToFetch, entityEndpoint, authToken, elasticsearchEndpoint)
        : getProvData(idToFetch, entityEndpoint, authToken),
  );

  return { provData, isLoading };
}

export default useProvData;
