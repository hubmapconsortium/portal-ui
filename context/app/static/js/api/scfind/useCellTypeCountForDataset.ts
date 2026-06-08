import useSWR from 'swr';
import { fetcher, multiFetcher } from 'js/helpers/swr';
import { createScFindFlaskKey } from './utils';

export interface CellTypeCountForDataset {
  count: number;
  index: string;
}

export interface CellTypeCountsForDataset {
  cellTypeCounts: CellTypeCountForDataset[];
}

export interface CellTypeCountForDatasetParams {
  dataset: string;
  modality?: string;
}

type CellTypeCountForDatasetKey = string;

export function createCellTypeCountForDatasetKey({
  dataset,
  modality,
}: CellTypeCountForDatasetParams): CellTypeCountForDatasetKey {
  return createScFindFlaskKey('/scfind/cell-type-count-for-dataset.json', {
    dataset,
    modality,
  });
}

export default function useCellTypeCountForDataset(props: CellTypeCountForDatasetParams) {
  const key = createCellTypeCountForDatasetKey(props);
  return useSWR<CellTypeCountsForDataset, unknown, CellTypeCountForDatasetKey>(key, (url) => fetcher({ url }), {
    revalidateOnFocus: false,
  });
}

interface CellTypeCountForDatasetsParams {
  datasets?: string[];
  modality?: string;
}

type CellTypeCountForDatasetsKey = string[];

export function createCellTypeCountForDatasetsKey({
  datasets,
  modality,
}: CellTypeCountForDatasetsParams): CellTypeCountForDatasetsKey {
  if (!datasets) return [];
  return datasets.map((dataset) => createCellTypeCountForDatasetKey({ dataset, modality }));
}

export function useCellTypeCountForDatasets(props: CellTypeCountForDatasetsParams = { datasets: [] }) {
  const key = createCellTypeCountForDatasetsKey(props);

  const cellTypeCountForDatasetsFetcher = async (urls: string[]) => {
    const data = await multiFetcher<CellTypeCountsForDataset>({ urls });
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
  };

  return useSWR<Record<string, CellTypeCountForDataset[]>, unknown, CellTypeCountForDatasetsKey>(
    key,
    cellTypeCountForDatasetsFetcher,
  );
}
