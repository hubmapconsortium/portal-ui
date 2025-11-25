import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import useSWR from 'swr';
import { ProvData } from 'js/components/detailPage/provenance/types';
import { multiFetcher } from 'js/helpers/swr';
import { createProvDataURL, nonDestructiveMerge } from './utils';

/**
 * Fetcher for combined provenance data from multiple UUIDs
 * Fetches provenance data for each UUID and merges them into a single object
 * @param uuids Array of UUIDs to fetch provenance data for
 * @param entityEndpoint Base URL of the entities API endpoint
 * @param groupsToken Auth token for the request
 * @returns Combined provenance data
 */
async function getCombinedProvData(uuids: string[], entityEndpoint: string, groupsToken: string): Promise<ProvData> {
  if (uuids.length === 0) {
    throw new Error('At least one UUID is required to fetch provenance data');
  }

  const provDataArray = await multiFetcher<ProvData>({
    urls: uuids.map((id) => createProvDataURL(id, entityEndpoint)),
    requestInits: [{ headers: getAuthHeader(groupsToken) }],
  });

  if (provDataArray.length === 1) {
    return provDataArray[0];
  }

  const [first, ...rest] = provDataArray;
  const [, ...restIds] = uuids;
  const combinedProvenance = rest.reduce(
    (acc, curr, idx) => {
      // Append current UUID to keys if the key itself is a duplicate but its value is not
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

type ProvDataFetcherKey = [string[], string] | null;

/**
 * Creates a cache key for SWR based on the UUIDs and auth token
 * The key is sorted to ensure consistent caching regardless of UUID order
 */
const createProvDataFetcherKey = (uuids: string[], groupsToken: string, shouldFetch?: boolean): ProvDataFetcherKey => {
  if (!shouldFetch || uuids.length === 0) return null;
  // Sort UUIDs to ensure consistent cache keys
  return [[...uuids].sort(), groupsToken];
};

/**
 * Fetches and combines provenance data for one or more entities
 * @param uuids Array of UUIDs to fetch provenance data for
 * @param shouldFetch Whether to fetch the data (default: true)
 * @returns Combined provenance data and loading state
 */
function useProvData(uuids: string[], shouldFetch = true) {
  const { entityEndpoint, groupsToken } = useAppContext();

  const { data: provData, isLoading } = useSWR<ProvData, unknown, ProvDataFetcherKey>(
    createProvDataFetcherKey(uuids, groupsToken, shouldFetch),
    (key: ProvDataFetcherKey) => {
      if (!key) throw new Error('Invalid SWR key');
      const [uuidsToFetch, authToken] = key;
      return getCombinedProvData(uuidsToFetch, entityEndpoint, authToken);
    },
    {
      keepPreviousData: true,
    },
  );

  return { provData, isLoading };
}

export default useProvData;
