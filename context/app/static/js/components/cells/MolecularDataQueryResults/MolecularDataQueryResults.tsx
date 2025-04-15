import React from 'react';

import { CrossModalityCellTypeResults, CrossModalityGeneOrProteinResults } from '../CrossModalityResults';
import { useMolecularDataQueryFormState } from '../MolecularDataQueryForm/hooks';
import LoadingResults from './LoadingResults';
import { SCFindCellTypeQueryResults } from '../SCFindResults';

function CellsResults() {
  const {
    formState: { isLoading, isSubmitting, isSubmitted, isSubmitSuccessful },
    watch,
  } = useMolecularDataQueryFormState();

  const queryType = watch('queryType');
  const queryMethod = watch('queryMethod');

  // If the form has not been submitted, do not show any results
  if (!isSubmitted && !isSubmitSuccessful) {
    return null;
  }

  // // If the form has been submitted, but the form is dirty, show an alert to resubmit the query
  // if (isDirty) {
  //   return <FullWidthAlert severity="info">Please resubmit your query to view results.</FullWidthAlert>;
  // }

  // If the results are loading, show a loading spinner and message
  if (isLoading || isSubmitting) {
    return <LoadingResults />;
  }

  switch (queryType) {
    case 'gene':
      if (queryMethod === 'scFind') {
        return 'TODO: SCFIND GENE QUERY RESULTS DISPLAY.';
      }
      return <CrossModalityGeneOrProteinResults />;

    case 'protein':
      return <CrossModalityGeneOrProteinResults />;
    case 'cell-type':
      if (queryMethod === 'crossModality') {
        return <CrossModalityCellTypeResults />;
      }
      return <SCFindCellTypeQueryResults />;
    default:
      return `Unknown query type/method: ${queryType as string} with ${queryMethod}`;
  }
}

export default CellsResults;
