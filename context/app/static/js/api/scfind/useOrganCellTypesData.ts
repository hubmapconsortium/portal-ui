import useSWR from 'swr/immutable';
import { fetcher } from 'js/helpers/swr';

export interface OrganCellType {
  name: string;
  clid: string | null;
  description: string | null;
  datasets: string[];
}

/**
 * Aggregate payload for the organ detail page's cell-types table, served by the Flask BFF route
 * `/scfind/organ-cell-types/<organ>.json`. Collapses the table's initial-load scfind requests
 * (per-cell-type findDatasetForCellType + label->CLID + Cell Ontology descriptions) into a single
 * fetch, bundling both modalities so the RNAseq/ATACseq tabs are served from one request.
 */
export interface OrganCellTypesData {
  cell_types: OrganCellType[];
  cell_types_atac: OrganCellType[];
}

export function createOrganCellTypesKey(organ: string): string {
  return `/scfind/organ-cell-types/${encodeURIComponent(organ)}.json`;
}

export default function useOrganCellTypesData(organ: string) {
  const key = organ ? createOrganCellTypesKey(organ) : null;
  return useSWR<OrganCellTypesData, unknown, string | null>(key, (url) => fetcher({ url }));
}
