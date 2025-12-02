import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import useSWR from 'swr';
import { ProvData } from 'js/components/detailPage/provenance/types';
import { fetcher, multiFetcher } from 'js/helpers/swr';
import { createProvDataURL, nonDestructiveMerge } from './utils';
import { convertProvDataToNodesAndEdges } from './utils/provToNodesAndEdges';
import { applyLayout } from './utils/applyLayout';
import { createGetNameForActivity, createGetNameForEntity } from './utils/nameFormatters';
import { Node, Edge } from '@xyflow/react';
import { fetchSearchData } from 'js/hooks/useSearchData';
import { getAncestorsQuery, getDescendantsQuery } from './queries';

interface ProvDataWithNodes {
  provData: ProvData;
  nodes: Node[];
  edges: Edge[];
}

function combineProvenance(acc: ProvData, addition: ProvData, additionId: string): ProvData {
  acc.entity = nonDestructiveMerge(acc.entity, addition.entity, additionId);
  acc.activity = nonDestructiveMerge(acc.activity, addition.activity, additionId);
  acc.agent = nonDestructiveMerge(acc.agent, addition.agent, additionId);
  acc.wasGeneratedBy = nonDestructiveMerge(acc.wasGeneratedBy, addition.wasGeneratedBy, additionId);
  acc.used = nonDestructiveMerge(acc.used, addition.used, additionId);
  acc.actedOnBehalfOf = nonDestructiveMerge(acc.actedOnBehalfOf, addition.actedOnBehalfOf, additionId);
  return acc;
}

/**
 * Fetcher for the DatasetRelationships multi-assay provenance data
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
async function getMultiAssayProvData(
  uuid: string,
  entityEndpoint: string,
  groupsToken: string,
  elasticsearchEndpoint: string,
): Promise<ProvData> {
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
      return combineProvenance(acc, curr, currentId);
    },
    { ...first }, // using spread operator to avoid mutating the original object
  );
  return combinedProvenance;
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
async function getProvDataWithNodes(
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
        return combineProvenance(acc, curr, currentId);
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
 * @param currentEntityUUID The UUID of the current entity being viewed
 * @param entityType The entity type (for filtering logic)
 * @param shouldFetch Whether to fetch the data (default: true)
 * @returns Combined provenance data with nodes, edges, and loading state
 */
function useProvData(uuids: string[], currentEntityUUID: string, entityType: string, shouldFetch = true) {
  const { entityEndpoint, groupsToken } = useAppContext();

  const { data, isLoading } = useSWR<ProvDataWithNodes, unknown, ProvDataFetcherKey>(
    createProvDataFetcherKey(uuids, groupsToken, currentEntityUUID, entityType, shouldFetch),
    (key: ProvDataFetcherKey) => {
      if (!key) throw new Error('Invalid SWR key');
      const [uuidsToFetch, authToken, uuid, entityTypeValue] = key;
      return getProvDataWithNodes(uuidsToFetch, entityEndpoint, authToken, uuid, entityTypeValue);
    },
    {
      keepPreviousData: true,
    },
  );

  return { data, isLoading };
}

export function useMultiAssayProvenance(
  uuid: string,
  shouldFetch = true,
): { data: ProvData | undefined; isLoading: boolean } {
  const { entityEndpoint, elasticsearchEndpoint, groupsToken } = useAppContext();

  const { data, isLoading } = useSWR<ProvData, unknown, string | null>(
    shouldFetch ? `multi-assay-prov-${uuid}` : null,
    () => getMultiAssayProvData(uuid, entityEndpoint, groupsToken, elasticsearchEndpoint),
    {
      keepPreviousData: true,
    },
  );

  return { data, isLoading };
}

export default useProvData;
