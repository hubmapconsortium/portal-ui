import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindKey, stringOrArrayToString, useScFindKey } from './utils';

type MarkerGenesKey = string;

type MarkerGenesResponse = object[];

export interface MarkerGenesParams {
  markerGenes: string | string[];
  datasetName?: string;
}

function createMarkerGenesKey(
  scFindApiUrl: string,
  { markerGenes, datasetName }: MarkerGenesParams,
  scFindIndexVersion?: string,
): MarkerGenesKey {
  return createScFindKey(
    scFindApiUrl,
    'marker_genes',
    {
      marker_genes: stringOrArrayToString(markerGenes),
      dataset_name: datasetName,
    },
    scFindIndexVersion,
  );
}

export default function useMarkerGenes(params: MarkerGenesParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createMarkerGenesKey(scFindEndpoint, params, scFindIndexVersion);
  return useSWR<MarkerGenesResponse, unknown, MarkerGenesKey>(key, (url) => fetcher({ url }));
}
