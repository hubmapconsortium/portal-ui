import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindKey, stringOrArrayToString, useScFindKey } from './utils';
import { useMemo } from 'react';

export interface DatasetsForGenesResponse {
  counts: Record<string, number[]>;
  findDatasets: Record<string, string[]>;
}

export interface DatasetsForGenesParams {
  geneList: string | string[];
}

type DatasetsForGenesKey = string | null;

export function createFindDatasetForGenesKey(
  scFindEndpoint: string,
  { geneList }: DatasetsForGenesParams,
  scFindIndexVersion?: string,
): DatasetsForGenesKey {
  if (
    (Array.isArray(geneList) && geneList.length === 0) ||
    (typeof geneList === 'string' && geneList.trim().length === 0)
  )
    return null;
  return createScFindKey(
    scFindEndpoint,
    'findDatasets',
    {
      gene_list: stringOrArrayToString(geneList) || undefined, // Convert to string or return undefined if empty
    },
    scFindIndexVersion,
  );
}

export default function useFindDatasetForGenes(props: DatasetsForGenesParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createFindDatasetForGenesKey(scFindEndpoint, props, scFindIndexVersion);
  const { data, ...rest } = useSWR<DatasetsForGenesResponse, Error, DatasetsForGenesKey>(
    key,
    (url) =>
      fetcher({
        url,
        errorMessages: {
          400: `No results found for ${Array.isArray(props.geneList) ? props.geneList.join(', ') : props.geneList}`,
        },
      }),
    {
      shouldRetryOnError: false,
    },
  );

  const countsMaps: Record<string, Record<string, number>> = useMemo(() => {
    if (!data) return {};
    const maps: Record<string, Record<string, number>> = {};

    Object.entries(data.counts).forEach(([gene, counts]) => {
      const datasets = data.findDatasets[gene] || [];
      const map: Record<string, number> = {};
      counts.forEach((count, index) => {
        const datasetId = datasets[index];
        if (datasetId) {
          map[datasetId] = count;
        }
      });
      maps[gene] = map;
    });

    return maps;
  }, [data]);

  return { data, countsMaps, ...rest };
}
