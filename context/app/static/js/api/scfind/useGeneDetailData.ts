import useSWR from 'swr/immutable';
import { fetcher } from 'js/helpers/swr';
import { GeneSignatureStats } from './useHyperQueryCellTypes';
import { DatasetsForGenesResponse } from './useFindDatasetForGenes';

/**
 * Aggregate payload for the Gene detail page, served by the Flask BFF route
 * `/scfind/gene-detail/<symbol>.json`. Collapses the page's initial-load scfind requests
 * (hyperQueryCellTypes across all organs + findDatasets + the label->CLID subset) into one fetch.
 */
export interface GeneDetailData {
  hyper_query: GeneSignatureStats[];
  find_datasets: DatasetsForGenesResponse;
  organs: string[];
  label_to_clid: Record<string, string[]>;
}

export function createGeneDetailDataKey(geneSymbol: string): string {
  return `/scfind/gene-detail/${encodeURIComponent(geneSymbol)}.json`;
}

export default function useGeneDetailData(geneSymbol: string) {
  const key = geneSymbol ? createGeneDetailDataKey(geneSymbol) : null;
  return useSWR<GeneDetailData, unknown, string | null>(key, (url) => fetcher({ url }));
}
