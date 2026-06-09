import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindFlaskKey, stringOrArrayToString } from './utils';

type MarkerGenesKey = string;

type MarkerGenesResponse = object[];

export interface MarkerGenesParams {
  markerGenes: string | string[];
  datasetName?: string;
}

function createMarkerGenesKey({ markerGenes, datasetName }: MarkerGenesParams): MarkerGenesKey {
  return createScFindFlaskKey('/scfind/marker-genes.json', {
    marker_genes: stringOrArrayToString(markerGenes),
    dataset_name: datasetName,
  });
}

export default function useMarkerGenes(params: MarkerGenesParams) {
  const key = createMarkerGenesKey(params);
  return useSWR<MarkerGenesResponse, unknown, MarkerGenesKey>(key, (url) => fetcher({ url }));
}
