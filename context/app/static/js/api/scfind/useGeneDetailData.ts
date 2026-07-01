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
  // ATAC counterpart of `hyper_query` (hyperQueryCellTypes with modality=ATAC).
  hyper_query_atac: GeneSignatureStats[];
  find_datasets: DatasetsForGenesResponse;
  // ATAC counterpart of `find_datasets` (findDatasets with modality=ATAC).
  find_datasets_atac: DatasetsForGenesResponse;
  organs: string[];
  // Organs derived from the ATAC cell types.
  organs_atac: string[];
  label_to_clid: Record<string, string[]>;
}

export function createGeneDetailDataKey(geneSymbol: string): string {
  return `/scfind/gene-detail/${encodeURIComponent(geneSymbol)}.json`;
}

export default function useGeneDetailData(geneSymbol: string) {
  const key = geneSymbol ? createGeneDetailDataKey(geneSymbol) : null;
  return useSWR<GeneDetailData, unknown, string | null>(key, (url) => fetcher({ url }));
}
