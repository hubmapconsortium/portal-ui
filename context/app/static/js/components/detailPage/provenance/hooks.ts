import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import useSWR from 'swr';
import { ProvData } from 'js/components/detailPage/provenance/types';
import { fetchSearchData } from 'js/hooks/useSearchData';
import { fetcher, multiFetcher } from 'js/helpers/swr';
import { getAncestorsQuery, getDescendantsQuery } from './queries';
import { createProvDataURL, nonDestructiveMerge } from './utils';

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

  if (descendantIds.length === 0) {
    return fetcher({
      url: createProvDataURL(uuid, entityEndpoint),
      requestInit: { headers: getAuthHeader(groupsToken) },
    });
  }

  const descendantProvenance = await multiFetcher<ProvData>({
    urls: descendantIds.map((id) => createProvDataURL(id, entityEndpoint)),
    requestInits: [{ headers: getAuthHeader(groupsToken) }],
  });

  if (descendantProvenance.length === 1) {
    return descendantProvenance[0];
  }
  const [first, ...rest] = descendantProvenance;
  const [, ...restIds] = descendantIds;
  const combinedProvenance = rest.reduce(
    (acc, curr, idx) => {
      // Append current descendant's ID to keys if the key itself is a duplicate but its value is not
      const currentId = restIds[idx];
      acc.entity = nonDestructiveMerge(acc.entity, curr.entity, currentId);
      acc.activity = nonDestructiveMerge(acc.activity, curr.activity, currentId);
      acc.agent = nonDestructiveMerge(acc.agent, curr.agent, currentId);
      acc.wasGeneratedBy = nonDestructiveMerge(acc.wasGeneratedBy, curr.wasGeneratedBy, currentId);
      acc.used = nonDestructiveMerge(acc.used, curr.used, currentId);
      acc.actedOnBehalfOf = nonDestructiveMerge(acc.actedOnBehalfOf, curr.actedOnBehalfOf, currentId);
      return acc;
    },
    { ...first }, // using spread operator to avoid mutating the original object
  );
  return combinedProvenance;
}

/**
 * Fetches provenance data for an entity
 * @param uuid UUID of the entity to fetch
 * @param combined Whether to fetch combined provenance data for the entity's tree
 * @returns Provenance data and loading state
 */
function useProvData(uuid: string, combined = false, shouldFetch = true) {
  const { entityEndpoint, groupsToken, elasticsearchEndpoint } = useAppContext();

  const { data: provData, isLoading } = useSWR<ProvData, unknown, [string, string, boolean]>(
    // @ts-expect-error - SWR suggests disabling fetching by providing a null key
    shouldFetch ? [uuid, groupsToken, combined] : null,
    ([idToFetch, authToken, useCombinedFetcher]) =>
      useCombinedFetcher
        ? getCombinedProvData(idToFetch, entityEndpoint, authToken, elasticsearchEndpoint)
        : fetcher({
            url: createProvDataURL(idToFetch, entityEndpoint),
            requestInit: { headers: getAuthHeader(authToken) },
          }),
  );

  return { provData, isLoading };
}

export default useProvData;
