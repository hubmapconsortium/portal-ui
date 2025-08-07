import useSWR from 'swr';
import { fetcher, multiFetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { useMemo } from 'react';
import { createScFindKey } from './utils';

interface CellTypeToCLID {
  CLIDs: string[];
}

export interface CellTypeToCLIDParams {
  cellType: string;
}

type CellTypeToCLIDKey = string;

export function createCLIDtoLabelKey(scFindEndpoint: string, { cellType }: CellTypeToCLIDParams): CellTypeToCLIDKey {
  return createScFindKey(scFindEndpoint, 'CellType2CLID', {
    cell_type: cellType,
  });
}

export default function useLabelToCLID(props: CellTypeToCLIDParams) {
  const { scFindEndpoint } = useAppContext();
  const key = createCLIDtoLabelKey(scFindEndpoint, props);
  return useSWR<CellTypeToCLID, unknown, CellTypeToCLIDKey>(key, (url) => fetcher({ url }));
}

export function useLabelsToCLIDs(cellTypes: string[]) {
  const { scFindEndpoint } = useAppContext();
  const keys = cellTypes.map((cellType) => createCLIDtoLabelKey(scFindEndpoint, { cellType }));

  return useSWR<CellTypeToCLID[], unknown, CellTypeToCLIDKey[]>(keys, (urls) => multiFetcher({ urls }));
}

export function useLabelToCLIDMap(cellTypes: string[]) {
  const { data, error, isLoading } = useLabelsToCLIDs(cellTypes);

  return useMemo(() => {
    const labelToCLIDMap: Record<string, string[]> = {};

    if (isLoading || error) {
      return { labelToCLIDMap, isLoading, error };
    }

    if (data) {
      data.reduce((acc, item, idx) => {
        acc[cellTypes[idx]] = item.CLIDs;
        return acc;
      }, labelToCLIDMap);
    }
    return { labelToCLIDMap, isLoading, error };
  }, [isLoading, error, data, cellTypes]);
}
