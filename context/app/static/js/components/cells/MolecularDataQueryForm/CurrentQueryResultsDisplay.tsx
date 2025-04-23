import React from 'react';
import useIndexedDatasets from 'js/api/scfind/useIndexedDatasets';
import useSWR from 'swr';
import { useMolecularDataQueryFormState } from './hooks';
import { useResultsProvider } from './ResultsProvider';
import CellsService from '../CellsService';

function SCFindQueryResultsDisplay() {
  const { data: { datasets = [] } = { datasets: [] } } = useIndexedDatasets();
  const resultCount = useResultsProvider((state) => state.resultCount);
  const totalDatasets = datasets.length;
  const percentage = ((resultCount / totalDatasets) * 100).toFixed(1);

  return (
    <>
      {resultCount} Datasets Matching Query Parameters / {totalDatasets} Indexed Datasets ({percentage}%)
    </>
  );
}

function CrossModalityQueryResultsDisplay() {
  const results = useSWR<number, Error, string>('crossModalityIndexedDatasets', async () => {
    const cellService = new CellsService();
    const { results: resultCount } = await cellService.getIndexedDatasetCount();
    return resultCount;
  });
  const { data: totalDatasets, isLoading, error } = results;
  const resultCount = useResultsProvider((state) => state.resultCount);
  if (isLoading) {
    return <>Loading...</>;
  }

  if (error || !totalDatasets) {
    return <>Error: {error?.message ?? 'No datasets found.'}</>;
  }

  const percentage = ((resultCount / totalDatasets) * 100).toFixed(1);

  return (
    <>
      {resultCount} Datasets Matching Query Parameters / {totalDatasets} Indexed Datasets ({percentage}%)
    </>
  );
}

export default function CurrentQueryResultsDisplay() {
  const { formState, watch } = useMolecularDataQueryFormState();

  const isLoading = useResultsProvider((state) => state.isLoading);
  const error = useResultsProvider((state) => state.error);

  const queryMethod = watch('queryMethod');

  if (!formState.isSubmitted || !formState.isSubmitSuccessful || formState.isLoading) {
    return null;
  }

  if (isLoading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>Error: {error}</>;
  }

  if (queryMethod === 'scFind') {
    return <SCFindQueryResultsDisplay />;
  }
  if (['crossModality', 'crossModalityRNA', 'crossModalityATAC'].includes(queryMethod)) {
    return <CrossModalityQueryResultsDisplay />;
  }

  return <>Unknown query method. Please contact support.</>;
}
