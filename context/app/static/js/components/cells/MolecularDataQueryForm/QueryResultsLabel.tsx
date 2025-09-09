import React from 'react';
import useIndexedDatasets from 'js/api/scfind/useIndexedDatasets';
import useSWR from 'swr';
import Typography from '@mui/material/Typography';
import StepLabel from '@mui/material/StepLabel';
import Stack from '@mui/material/Stack';
import { useMolecularDataQueryFormState } from './hooks';
import { useResultsProvider } from './ResultsProvider';
import CellsService from '../CellsService';
import QuerySubtitle from './QuerySubtitle';

function SCFindQueryResultsDisplay() {
  const { data: { datasets = [] } = { datasets: [] } } = useIndexedDatasets();
  const resultCount = useResultsProvider((state) => state.resultCount);
  const totalDatasets = datasets.length;
  const percentage = ((resultCount / totalDatasets) * 100).toFixed(1);

  return (
    <QuerySubtitle>
      {resultCount} Datasets Matching Query Parameters / {totalDatasets} Indexed Datasets ({percentage}%)
    </QuerySubtitle>
  );
}

const fetchTotalCellsApiDatasets = async () => {
  const cellService = new CellsService();
  const resultCount = await cellService.getIndexedDatasetCount();
  return resultCount;
};

function CrossModalityQueryResultsDisplay() {
  const results = useSWR<number, Error, string>('crossModalityIndexedDatasets', fetchTotalCellsApiDatasets);
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

function QueryResultsVariables() {
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
    return <>Error: {(error as Error)?.message ?? error ?? 'No datasets found'}</>;
  }

  if (queryMethod === 'scFind') {
    return <SCFindQueryResultsDisplay />;
  }
  if (['crossModality', 'crossModalityRNA', 'crossModalityATAC'].includes(queryMethod)) {
    return <CrossModalityQueryResultsDisplay />;
  }

  return <>Unknown query method. Please contact support.</>;
}

interface QueryResultsLabelProps {
  activeStep: number;
}

export default function QueryResultsLabel({ activeStep }: QueryResultsLabelProps) {
  return (
    <StepLabel>
      <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" gap={2} useFlexGap>
        <Stack direction="column">
          <Typography variant="subtitle1">Results</Typography>
          {activeStep !== 0 && <QueryResultsVariables />}
        </Stack>
      </Stack>
    </StepLabel>
  );
}
