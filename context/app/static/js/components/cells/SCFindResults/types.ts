import { Dataset } from 'js/components/types';
import React from 'react';

type WrappedDatasetResult = Pick<Dataset, 'hubmap_id'>;
export interface SCFindQueryResultsListProps {
  datasetIds: { hubmap_id: string }[];
  countsMap?: Record<string, number>;
}

export type WrappedDatasetResults = Record<string, WrappedDatasetResult[]>;
export type UnwrappedDatasetResults = Record<string, string[]>;

export interface CellTypeCategory {
  label: string;
  icon: React.ReactNode;
  formattedLabel?: string;
}

export function getUnwrappedResult(result: WrappedDatasetResult | string): string {
  if (typeof result === 'object' && 'hubmap_id' in result) {
    return result.hubmap_id;
  }
  return result;
}
