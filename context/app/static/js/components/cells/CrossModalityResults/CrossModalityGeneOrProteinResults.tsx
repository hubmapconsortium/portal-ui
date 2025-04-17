import React from 'react';
import { useCrossModalityResults } from './hooks';
import DatasetsTable from '../DatasetsTable';
import { useAugmentedResults } from '../MolecularDataQueryResults/hooks';

export default function CrossModalityGeneOrProteinResults<T extends 'gene' | 'protein'>() {
  const { data } = useCrossModalityResults<T>();

  const { list, isLoading } = useAugmentedResults(data?.list);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <DatasetsTable datasets={list} />;
}
