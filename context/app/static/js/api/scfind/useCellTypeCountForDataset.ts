import useSWR from 'swr';
import { fetcher, multiFetcher } from 'js/helpers/swr';
import { useMemo } from 'react';
import { createScFindKey, useScFindKey } from './utils';

export interface CellTypeCountForDataset {
  count: number;
  index: string;
}

export interface CellTypeCountsForDataset {
  cellTypeCounts: CellTypeCountForDataset[];
}

export interface CellTypeCountForDatasetParams {
  dataset: string;
}

type CellTypeCountForDatasetKey = string;

export function createCellTypeCountForDatasetKey(
  scFindEndpoint: string,
  { dataset }: CellTypeCountForDatasetParams,
  scFindIndexVersion?: string,
): CellTypeCountForDatasetKey {
  return createScFindKey(
    scFindEndpoint,
    'cellTypeCountForDataset',
    {
      dataset,
    },
    scFindIndexVersion,
  );
}

export default function useCellTypeCountForDataset(props: CellTypeCountForDatasetParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createCellTypeCountForDatasetKey(scFindEndpoint, props, scFindIndexVersion);
  return useSWR<CellTypeCountsForDataset, unknown, CellTypeCountForDatasetKey>(key, (url) => fetcher({ url }));
}

interface CellTypeCountForDatasetsParams {
  datasets?: string[];
}

type CellTypeCountForDatasetsKey = string[];

export function createCellTypeCountForDatasetsKey(
  scFindEndpoint: string,
  { datasets }: CellTypeCountForDatasetsParams,
  scFindIndexVersion?: string,
): CellTypeCountForDatasetsKey {
  if (!datasets) return [];
  return datasets.map((dataset) =>
    createScFindKey(
      scFindEndpoint,
      'cellTypeCountForDataset',
      {
        dataset,
      },
      scFindIndexVersion,
    ),
  );
}

export function useCellTypeCountForDatasets(props: CellTypeCountForDatasetsParams = { datasets: [] }) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createCellTypeCountForDatasetsKey(scFindEndpoint, props, scFindIndexVersion);
  const { data, ...rest } = useSWR<CellTypeCountsForDataset[], unknown, CellTypeCountForDatasetsKey>(key, (urls) =>
    multiFetcher({ urls }),
  );
  const formattedData: Record<string, CellTypeCountForDataset[]> = useMemo(() => {
    const formatted: Record<string, CellTypeCountForDataset[]> = {};
    if (!data || !props.datasets) {
      return formatted;
    }

    props.datasets.reduce<Record<string, CellTypeCountForDataset[]>>((acc, dataset, idx) => {
      const datasetData = data[idx];
      if (datasetData) {
        acc[dataset] = datasetData.cellTypeCounts;
      }
      return acc;
    }, formatted);

    return formatted;
  }, [data, props.datasets]);

  return { data: formattedData, ...rest };
}
