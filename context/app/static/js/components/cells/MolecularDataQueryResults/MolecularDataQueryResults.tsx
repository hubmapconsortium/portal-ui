import React from 'react';

import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider';
import { CrossModalityCellTypeResults, CrossModalityGeneOrProteinResults } from '../CrossModalityResults';
import { useMolecularDataQueryFormState } from '../MolecularDataQueryForm/hooks';
import LoadingResults from './LoadingResults';
import { SCFindCellTypeQueryResults } from '../SCFindResults';

function Results() {
  const { watch } = useMolecularDataQueryFormState();

  const queryType = watch('queryType');
  const queryMethod = watch('queryMethod');

  if (queryType === 'cell-type' && queryMethod === 'crossModality') {
    return <CrossModalityCellTypeResults />;
  }
  if (queryType === 'cell-type' && queryMethod === 'scFind') {
    return <SCFindCellTypeQueryResults />;
  }
  if (queryType === 'protein' || (queryType === 'gene' && queryMethod !== 'scFind')) {
    return <CrossModalityGeneOrProteinResults />;
  }
  // TODO: Add support for SCFind Gene queries
  return null;
}

function CellsResults() {
  const {
    formState: { isLoading, isSubmitting, isSubmitted, isSubmitSuccessful },
  } = useMolecularDataQueryFormState();

  // If the form has not been submitted, do not show any results
  if (!isSubmitted && !isSubmitSuccessful) {
    return null;
  }

  // If the results are loading, show a loading spinner and message
  if (isLoading || isSubmitting) {
    return <LoadingResults />;
  }

  return (
    <SelectableTableProvider tableLabel="MolecularDataQueryResults">
      <Results />
    </SelectableTableProvider>
  );
}

export default CellsResults;
