import { useSearchHits } from 'js/hooks/useSearchData';
import useLabelToCLID from 'js/api/scfind/useLabelToCLID';
import { capitalize } from '@mui/material/utils';
import { useOrganContext } from './contexts';

export function useUUIDsFromHubmapIds(hubmapIds: string[]) {
  const { searchHits: datasets, isLoading } = useSearchHits({
    size: 10000,
    query: {
      bool: {
        must: [
          {
            terms: {
              'hubmap_id.keyword': hubmapIds,
            },
          },
        ],
      },
    },
  });
  if (!datasets) {
    return { datasetUUIDs: [], isLoading };
  }
  const datasetUUIDs = datasets.map((hit) => hit._id);
  return { datasetUUIDs, isLoading };
}

export function useFormattedCellTypeName(cellType: string) {
  const { organ } = useOrganContext();
  return `${capitalize(organ.name)}.${cellType}`;
}

export function useFormattedCellTypeNames(cellTypes: string[]) {
  const { organ } = useOrganContext();
  return cellTypes.map((cellType) => `${capitalize(organ.name)}.${cellType}`);
}

export function useCLID(cellType: string) {
  const scFindKey = useFormattedCellTypeName(cellType);

  const { data } = useLabelToCLID({ cellType: scFindKey });

  const clid = data?.CLIDs?.[0];

  return clid;
}
