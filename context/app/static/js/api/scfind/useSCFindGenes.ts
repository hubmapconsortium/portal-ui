import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindKey, useScFindKey } from './utils';

type MarkerGenesKey = string;

interface SCFindGenesList {
  genes: string[];
}

function createMarkerGenesKey(scFindApiUrl: string, scFindIndexVersion?: string): MarkerGenesKey {
  return createScFindKey(scFindApiUrl, 'scfindGenes', {}, scFindIndexVersion);
}

export default function useScfindGenes() {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createMarkerGenesKey(scFindEndpoint, scFindIndexVersion);
  return useSWR<SCFindGenesList, unknown, MarkerGenesKey>(key, (url) => fetcher({ url }));
}
