import useSWR from 'swr';
import { fetcher, multiFetcher } from 'js/helpers/swr';
import { useMemo } from 'react';
import { createScFindKey, formatCellTypeName, useScFindKey } from './utils';

interface CellTypeToCLID {
  CLIDs: string[];
}

export interface CellTypeToCLIDParams {
  cellType: string;
}

type CellTypeToCLIDKey = string;

export function createCLIDtoLabelKey(
  scFindEndpoint: string,
  { cellType }: CellTypeToCLIDParams,
  scFindIndexVersion?: string,
): CellTypeToCLIDKey {
  return createScFindKey(
    scFindEndpoint,
    'CellType2CLID',
    {
      cell_type: cellType,
    },
    scFindIndexVersion,
  );
}

export default function useLabelToCLID(props: CellTypeToCLIDParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createCLIDtoLabelKey(scFindEndpoint, props, scFindIndexVersion);
  return useSWR<CellTypeToCLID, unknown, CellTypeToCLIDKey>(key, (url) => fetcher({ url }));
}

export function useLabelsToCLIDs(cellTypes: string[]) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const keys = cellTypes.map((cellType) => createCLIDtoLabelKey(scFindEndpoint, { cellType }, scFindIndexVersion));

  return useSWR<CellTypeToCLID[], unknown, CellTypeToCLIDKey[]>(keys, (urls) => multiFetcher({ urls }));
}

interface UseLabelToClidConfig {
  formatCellTypeNames?: boolean;
}

const defaultConfig: UseLabelToClidConfig = {
  formatCellTypeNames: false,
};

export function useLabelToCLIDMap(cellTypes: string[], config: UseLabelToClidConfig = defaultConfig) {
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

    if (config.formatCellTypeNames) {
      // run all of the keys through formatCellTypeName
      Object.keys(labelToCLIDMap).forEach((key) => {
        const formattedKey = formatCellTypeName(key);
        labelToCLIDMap[formattedKey] = labelToCLIDMap[key];
        if (formattedKey !== key) {
          delete labelToCLIDMap[key];
        }
      });
    }

    return { labelToCLIDMap, isLoading, error };
  }, [isLoading, error, data, config.formatCellTypeNames, cellTypes]);
}
