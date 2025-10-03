import useSWR from 'swr';
import { multiFetcher } from 'js/helpers/swr';
import { createScFindKey, stringOrArrayToString, useScFindKey } from './utils';
import { useMemo } from 'react';

export interface FindDatasetForCellTypeParams {
  cellType: string;
}

type FindDatasetForCellTypeKey = string | null;

export interface FindDatasetForCellTypeResponse {
  counts: number[];
  datasets: string[];
}

export function createFindDatasetForCellTypeKey(
  scFindEndpoint: string,
  { cellType }: FindDatasetForCellTypeParams,
  scFindIndexVersion?: string,
): FindDatasetForCellTypeKey {
  if (typeof cellType !== 'string' || cellType.length === 0) return null;
  return createScFindKey(
    scFindEndpoint,
    'findDatasetForCellType',
    {
      cell_type: cellType,
    },
    scFindIndexVersion,
  );
}

export interface FindDatasetForCellTypesParams {
  cellTypes: string[];
}

type FindDatasetForCellTypesKey = FindDatasetForCellTypeKey[];

/**
 * Returns lists of datasets that contain the given cell types, matching the index of the original passed cell types.
 * @param params.cellTypes The cell types to search for.
 * @returns A list of HBM dataset IDs that contain the given cell types.
 */
export default function useFindDatasetForCellTypes({ cellTypes }: FindDatasetForCellTypesParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = cellTypes.map((cellType) =>
    createFindDatasetForCellTypeKey(scFindEndpoint, { cellType }, scFindIndexVersion),
  );
  const { data, ...rest } = useSWR<FindDatasetForCellTypeResponse[], unknown, FindDatasetForCellTypesKey>(
    key,
    (urls) =>
      multiFetcher({
        urls,
        errorMessages: {
          400: `No results found for ${stringOrArrayToString(cellTypes)}`,
        },
      }),
    {
      shouldRetryOnError: false,
    },
  );

  const countsMaps: Record<string, Record<string, number>> = useMemo(() => {
    if (!data) return {};
    const maps: Record<string, Record<string, number>> = {};

    data.forEach((result, index) => {
      const cellType = cellTypes[index];
      const map: Record<string, number> = {};
      result.counts.forEach((count, datasetIndex) => {
        const datasetId = result.datasets[datasetIndex];
        if (datasetId) {
          map[datasetId] = count;
        }
      });
      maps[cellType] = map;
    });

    return maps;
  }, [data, cellTypes]);

  return { data, countsMaps, ...rest };
}
