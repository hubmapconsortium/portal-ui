import useSWR from 'swr/immutable';
import { fetcher } from 'js/helpers/swr';

/**
 * Aggregate payload for the Cell Types landing page, served by the Flask BFF route
 * `/scfind/cell-types-landing.json` (warmed at startup). Collapses the page's RNA + ATAC
 * cellTypeNames requests into one. The distribution chart's per-organ counts are fetched
 * separately (warmed, shared cache).
 */
export interface CellTypesLandingData {
  cell_type_names: string[];
  cell_type_names_atac: string[];
  organs: string[];
  // Per formatted cell type label: how many datasets contain it for each modality (for the
  // panel's Data Type chips). Computed + cached server-side.
  dataset_counts: Record<string, { rna: number; atac: number }>;
  // Cell Ontology descriptions keyed by full CLID (e.g. "CL:0000236"), cached server-side so the
  // panel doesn't fetch them from UBKG per load.
  descriptions: Record<string, string>;
}

export function createCellTypesLandingDataKey(): string {
  return '/scfind/cell-types-landing.json';
}

export default function useCellTypesLandingData() {
  return useSWR<CellTypesLandingData, unknown, string>(createCellTypesLandingDataKey(), (url) => fetcher({ url }));
}
