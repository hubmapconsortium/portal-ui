import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindFlaskKey } from './utils';

type MarkerGenesKey = string;

interface SCFindGenesList {
  genes: string[];
}

function createMarkerGenesKey(modality?: string): MarkerGenesKey {
  return createScFindFlaskKey('/scfind/genes.json', { modality });
}

export default function useScfindGenes(modality?: string) {
  const key = createMarkerGenesKey(modality);
  return useSWR<SCFindGenesList, unknown, MarkerGenesKey>(key, (url) => fetcher({ url }));
}
