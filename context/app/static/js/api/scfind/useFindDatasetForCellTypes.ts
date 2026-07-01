import useSWR from 'swr';
import {
  cellTypeNameContainsComma,
  createScFindFlaskKey,
  createScFindFlaskPostRequest,
  ScFindRequest,
  scFindMultiFetcher,
  stringOrArrayToString,
} from './utils';
import { useMemo } from 'react';

export interface FindDatasetForCellTypeParams {
  cellType: string;
  modality?: string;
}

type FindDatasetForCellTypeKey = ScFindRequest | null;

export interface FindDatasetForCellTypeResponse {
  counts: number[];
  datasets: string[];
}

export function createFindDatasetForCellTypeKey({
  cellType,
  modality,
}: FindDatasetForCellTypeParams): FindDatasetForCellTypeKey {
  if (typeof cellType !== 'string' || cellType.length === 0) return null;
  if (cellTypeNameContainsComma(cellType)) {
    return createScFindFlaskPostRequest('/scfind/find-dataset-for-cell-type.json', { cell_type: cellType });
  }
  return createScFindFlaskKey('/scfind/find-dataset-for-cell-type.json', {
    cell_type: cellType,
    modality,
  });
}

export interface FindDatasetForCellTypesParams {
  cellTypes: string[];
  modality?: string;
}

type FindDatasetForCellTypesKey = FindDatasetForCellTypeKey[];

/**
 * Returns lists of datasets that contain the given cell types, matching the index of the original passed cell types.
 * @param params.cellTypes The cell types to search for.
 * @returns A list of HBM dataset IDs that contain the given cell types.
 */
export default function useFindDatasetForCellTypes({ cellTypes, modality }: FindDatasetForCellTypesParams) {
  const key = cellTypes.map((cellType) => createFindDatasetForCellTypeKey({ cellType, modality }));
  const { data, ...rest } = useSWR<(FindDatasetForCellTypeResponse | undefined)[], unknown, FindDatasetForCellTypesKey>(
    key,
    (requests) =>
      scFindMultiFetcher<FindDatasetForCellTypeResponse>(requests, {
        errorMessages: {
          400: `No results found for ${stringOrArrayToString(cellTypes)}`,
          500: 'The scFind server encountered an error. Please try again.',
          504: 'The scFind server took too long to respond. Please try again.',
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
      if (!result) return;
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
