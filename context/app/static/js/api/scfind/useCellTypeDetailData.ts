import useSWR from 'swr/immutable';
import { fetcher } from 'js/helpers/swr';

export interface CellTypeMarker {
  cellType?: string;
  genes: string;
  precision: number;
  recall: number;
  f1: number;
  tp?: number;
  fp?: number;
  fn?: number;
}

export interface DatasetsForCellType {
  counts: number[];
  datasets: string[];
}

/**
 * Aggregate payload for the Cell Type detail page, served by the Flask BFF route
 * `/scfind/cell-type-detail/<clid>.json`. Collapses the page's initial-load scfind requests
 * (CLID2CellType labels + cellTypeMarkers + per-cell-type findDatasetForCellType) into one fetch.
 * The distribution chart's per-organ counts are fetched separately (warmed, shared cache).
 */
export interface CellTypeDetailData {
  cell_types: string[];
  name: string;
  organs: string[];
  variants: Record<string, string[]>;
  markers: CellTypeMarker[];
  datasets_for_cell_types: Record<string, DatasetsForCellType>;
}

export function createCellTypeDetailDataKey(clid: string): string {
  return `/scfind/cell-type-detail/${encodeURIComponent(clid)}.json`;
}

export default function useCellTypeDetailData(clid: string) {
  const key = clid ? createCellTypeDetailDataKey(clid) : null;
  return useSWR<CellTypeDetailData, unknown, string | null>(key, (url) => fetcher({ url }));
}
