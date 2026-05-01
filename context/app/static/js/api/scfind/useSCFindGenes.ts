import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindKey, useScFindKey } from './utils';

type MarkerGenesKey = string;

interface SCFindGenesList {
  genes: string[];
}

function createMarkerGenesKey(scFindApiUrl: string, scFindIndexVersion?: string, modality?: string): MarkerGenesKey {
  return createScFindKey(scFindApiUrl, 'scfindGenes', { modality }, scFindIndexVersion);
}

export default function useScfindGenes(modality?: string) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createMarkerGenesKey(scFindEndpoint, scFindIndexVersion, modality);
  return useSWR<SCFindGenesList, unknown, MarkerGenesKey>(key, (url) => fetcher({ url }));
}
