import React from 'react';

import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider';
import { CrossModalityCellTypeResults, CrossModalityGeneOrProteinResults } from '../CrossModalityResults';
import { useMolecularDataQueryFormState } from '../MolecularDataQueryForm/hooks';
import LoadingResults from './LoadingResults';
import { SCFindCellTypeQueryResults } from '../SCFindResults';
import SCFindGeneQueryResultsLoader from '../SCFindResults/SCFindGeneQueryResults';
import { useMolecularDataQueryFormTracking } from '../MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';

function Results() {
  const { watch } = useMolecularDataQueryFormState();
  const { sessionId } = useMolecularDataQueryFormTracking();

  const queryType = watch('queryType');
  const queryMethod = watch('queryMethod');

  if (queryMethod === 'scFind') {
    switch (queryType) {
      case 'cell-type':
        return (
          <SCFindCellTypeQueryResults
            trackingInfo={{
              action: 'Results',
              label: sessionId,
              category: 'Molecular and Cellular Query',
            }}
          />
        );
      case 'gene':
        return (
          <SCFindGeneQueryResultsLoader
            trackingInfo={{
              action: 'Results',
              label: sessionId,
              category: 'Molecular and Cellular Query',
            }}
          />
        );
      default:
        return null;
    }
  } else {
    switch (queryType) {
      case 'cell-type':
        return <CrossModalityCellTypeResults />;
      default:
        return <CrossModalityGeneOrProteinResults />;
    }
  }
}

function ResultsWithLoader() {
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

export default ResultsWithLoader;
