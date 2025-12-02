import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import useSWR from 'swr';
import { ProvData } from 'js/components/detailPage/provenance/types';
import { multiFetcher } from 'js/helpers/swr';
import { createProvDataURL, nonDestructiveMerge } from './utils';
import { convertProvDataToNodesAndEdges } from './utils/provToNodesAndEdges';
import { applyLayout } from './utils/applyLayout';
import { createGetNameForActivity, createGetNameForEntity } from './utils/nameFormatters';
import { Node, Edge } from '@xyflow/react';

interface ProvDataWithNodes {
  provData: ProvData;
  nodes: Node[];
  edges: Edge[];
}

/**
 * Fetcher for combined provenance data from multiple UUIDs with computed nodes and edges
 * @param uuids Array of UUIDs to fetch provenance data for
 * @param entityEndpoint Base URL of the entities API endpoint
 * @param groupsToken Auth token for the request
 * @param currentUuid The UUID of the current entity being viewed
 * @param entityType The entity type (for filtering logic)
 * @returns Combined provenance data with computed nodes and edges
 */
async function getCombinedProvDataWithNodes(
  uuids: string[],
  entityEndpoint: string,
  groupsToken: string,
  currentUuid: string,
  entityType: string,
): Promise<ProvDataWithNodes> {
  if (uuids.length === 0) {
    throw new Error('At least one UUID is required to fetch provenance data');
  }

  const provDataArray = await multiFetcher<ProvData>({
    urls: uuids.map((id) => createProvDataURL(id, entityEndpoint)),
    requestInits: [{ headers: getAuthHeader(groupsToken) }],
  });

  let combinedProvenance: ProvData;

  if (provDataArray.length === 1) {
    combinedProvenance = provDataArray[0];
  } else {
    const [first, ...rest] = provDataArray;
    const [, ...restIds] = uuids;
    combinedProvenance = rest.reduce(
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
  }

  // Determine format keys based on provenance data structure
  const isOld = 'ex' in combinedProvenance.prefix;
  const idKey = isOld ? 'hubmap:displayDOI' : 'hubmap:hubmap_id';
  const typeKey = isOld ? 'prov:type' : 'hubmap:entity_type';

  // Create name functions
  const getNameForActivity = createGetNameForActivity(idKey);
  const getNameForEntity = createGetNameForEntity(typeKey, idKey);

  // Convert to nodes and edges
  const { nodes: rawNodes, edges: rawEdges } = convertProvDataToNodesAndEdges(combinedProvenance, {
    currentUuid,
    getNameForActivity,
    getNameForEntity,
    entityType,
  });

  // Apply layout
  const { nodes, edges } = applyLayout(rawNodes, rawEdges);

  return {
    provData: combinedProvenance,
    nodes,
    edges,
  };
}

type ProvDataFetcherKey = [string[], string, string, string] | null;

/**
 * Creates a cache key for SWR based on the UUIDs, auth token, current UUID, and entity type
 * The UUID array is sorted to ensure consistent caching regardless of UUID order
 */
const createProvDataFetcherKey = (
  uuids: string[],
  groupsToken: string,
  currentUuid: string,
  entityType: string,
  shouldFetch?: boolean,
): ProvDataFetcherKey => {
  if (!shouldFetch || uuids.length === 0) return null;
  // Sort UUIDs to ensure consistent cache keys
  return [[...uuids].sort(), groupsToken, currentUuid, entityType];
};

/**
 * Fetches and combines provenance data for one or more entities with computed nodes and edges
 * @param uuids Array of UUIDs to fetch provenance data for
 * @param currentUuid The UUID of the current entity being viewed
 * @param entityType The entity type (for filtering logic)
 * @param shouldFetch Whether to fetch the data (default: true)
 * @returns Combined provenance data with nodes, edges, and loading state
 */
function useProvData(uuids: string[], currentUuid: string, entityType: string, shouldFetch = true) {
  const { entityEndpoint, groupsToken } = useAppContext();

  const { data, isLoading } = useSWR<ProvDataWithNodes, unknown, ProvDataFetcherKey>(
    createProvDataFetcherKey(uuids, groupsToken, currentUuid, entityType, shouldFetch),
    (key: ProvDataFetcherKey) => {
      if (!key) throw new Error('Invalid SWR key');
      const [uuidsToFetch, authToken, uuid, entityTypeValue] = key;
      return getCombinedProvDataWithNodes(uuidsToFetch, entityEndpoint, authToken, uuid, entityTypeValue);
    },
    {
      keepPreviousData: true,
    },
  );

  return { data, isLoading };
}

export default useProvData;
