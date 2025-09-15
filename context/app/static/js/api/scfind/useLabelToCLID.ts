import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useMemo } from 'react';
import { createScFindKey, formatCellTypeName } from './utils';

interface CellTypeToCLID {
  CLIDs: string[];
}

export interface CellTypeToCLIDParams {
  cellType: string;
}

type CellTypeToCLIDKey = string;

// Hook to get the complete label-to-CLID mapping from our Flask route
export function useLabelToCLIDMapping() {
  const url = '/scfind/label-to-clid-map.json';
  return useSWR<Record<string, string[]>, unknown, string>(url, (endpoint) => fetcher({ url: endpoint }));
}

// Legacy function for direct SCFIND API calls - kept for backward compatibility
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
  const { data: fullMapping, error, isLoading } = useLabelToCLIDMapping();

  return useMemo(() => {
    if (isLoading || error || !fullMapping) {
      return { data: undefined, error, isLoading };
    }

    const clids = fullMapping[props.cellType] || [];
    return {
      data: { CLIDs: clids } as CellTypeToCLID,
      error: undefined,
      isLoading: false,
    };
  }, [fullMapping, props.cellType, error, isLoading]);
}

export function useLabelsToCLIDs(cellTypes: string[]) {
  const { data: fullMapping, error, isLoading } = useLabelToCLIDMapping();

  return useMemo(() => {
    if (isLoading || error || !fullMapping) {
      return { data: undefined, error, isLoading };
    }

    const results = cellTypes.map((cellType) => ({
      CLIDs: fullMapping[cellType] || [],
    }));

    return {
      data: results as CellTypeToCLID[],
      error: undefined,
      isLoading: false,
    };
  }, [fullMapping, cellTypes, error, isLoading]);
}

interface UseLabelToClidConfig {
  formatCellTypeNames?: boolean;
}

const defaultConfig: UseLabelToClidConfig = {
  formatCellTypeNames: false,
};

export function useLabelToCLIDMap(cellTypes: string[], config: UseLabelToClidConfig = defaultConfig) {
  const { data: fullMapping, error, isLoading } = useLabelToCLIDMapping();

  return useMemo(() => {
    const labelToCLIDMap: Record<string, string[]> = {};

    if (isLoading || error) {
      return { labelToCLIDMap, isLoading, error };
    }

    if (fullMapping) {
      // Extract only the requested cell types from the full mapping
      cellTypes.forEach((cellType) => {
        const clids = fullMapping[cellType];
        if (clids) {
          labelToCLIDMap[cellType] = clids;
        } else {
          labelToCLIDMap[cellType] = [];
        }
      });
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
  }, [isLoading, error, fullMapping, config.formatCellTypeNames, cellTypes]);
}
