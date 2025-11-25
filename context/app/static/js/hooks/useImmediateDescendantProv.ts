import useSWR from 'swr';
import { getAuthHeader } from 'js/helpers/functions';
import { Entity } from 'js/components/types';
import { ProvData } from 'js/components/detailPage/provenance/types';
import { multiFetcher } from 'js/helpers/swr';
import { fetchSearchData } from './useSearchData';
import { useAppContext } from 'js/components/Contexts';

async function getEntityData(hubmapID: string, elasticsearchEndpoint: string, groupsToken: string) {
  const query = { query: { match: { 'hubmap_id.keyword': hubmapID } } };
  const results = await fetchSearchData<Entity, unknown>(query, elasticsearchEndpoint, groupsToken);
  return results.hits.hits[0]._source;
}

function createProvDataURL(uuid: string, entityEndpoint: string) {
  return `${entityEndpoint}/entities/${uuid}/provenance`;
}

async function getImmediateDescendantsProvData(
  hubmap_id: string,
  elasticsearchEndpoint: string,
  entityEndpoint: string,
  groupsToken: string,
): Promise<ProvData[]> {
  const entityData = await getEntityData(hubmap_id, elasticsearchEndpoint, groupsToken);
  const immediateDescendants = entityData?.immediate_descendants as Array<{ uuid: string }> | undefined;

  if (!immediateDescendants || immediateDescendants.length === 0) {
    return [];
  }

  const results = await multiFetcher<ProvData>({
    urls: immediateDescendants.map((descendant) => createProvDataURL(descendant.uuid, entityEndpoint)),
    requestInits: [{ headers: getAuthHeader(groupsToken) }],
  });

  return results;
}

type ImmediateDescendantProvKey = [string, string, string, string] | null;

function createImmediateDescendantProvKey(
  hubmap_id: string,
  elasticsearchEndpoint: string,
  entityEndpoint: string,
  groupsToken: string,
  shouldFetch = true,
): ImmediateDescendantProvKey {
  if (!shouldFetch) return null;
  return [hubmap_id, elasticsearchEndpoint, entityEndpoint, groupsToken];
}

/**
 * Hook to fetch provenance data for immediate descendants of an entity
 * Uses SWR for caching and automatic revalidation
 * @param hubmap_id HuBMAP ID of the entity
 * @param shouldFetch Whether to fetch the data (default: true)
 * @returns Object containing immediateDescendantsProvData and isLoading state
 */
function useImmediateDescendantProv(hubmap_id: string, shouldFetch = true) {
  const { elasticsearchEndpoint, entityEndpoint, groupsToken } = useAppContext();
  const { data: immediateDescendantsProvData, isLoading } = useSWR<ProvData[], unknown, ImmediateDescendantProvKey>(
    createImmediateDescendantProvKey(hubmap_id, elasticsearchEndpoint, entityEndpoint, groupsToken, shouldFetch),
    (key: ImmediateDescendantProvKey) => {
      if (!key) throw new Error('Invalid SWR key');
      const [id, esEndpoint, entEndpoint, token] = key;
      return getImmediateDescendantsProvData(id, esEndpoint, entEndpoint, token);
    },
  );

  return { immediateDescendantsProvData, isLoading };
}

export default useImmediateDescendantProv;
