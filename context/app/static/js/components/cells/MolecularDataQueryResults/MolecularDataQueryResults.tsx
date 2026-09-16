import React from 'react';

import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider';
import { getScFindModality, useMolecularDataQueryFormState } from '../MolecularDataQueryForm/hooks';
import LoadingResults from './LoadingResults';
import { SCFindCellTypeQueryResults } from '../SCFindResults';
import SCFindGeneQueryResultsLoader from '../SCFindResults/SCFindGeneQueryResults';
import { useMolecularDataQueryFormTracking } from '../MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';
import { SCFindModalityProvider } from '../SCFindResults/SCFindModalityContext';

function Results() {
  const { watch } = useMolecularDataQueryFormState();
  const { sessionId } = useMolecularDataQueryFormTracking();

  const queryType = watch('queryType');
  const modality = getScFindModality(watch('queryMethod'));

  const trackingInfo = {
    action: 'Results',
    label: sessionId,
    category: 'Molecular and Cellular Query' as const,
  };

  return (
    <SCFindModalityProvider value={modality}>
      {queryType === 'cell-type' ? (
        <SCFindCellTypeQueryResults trackingInfo={trackingInfo} />
      ) : (
        <SCFindGeneQueryResultsLoader trackingInfo={trackingInfo} />
      )}
    </SCFindModalityProvider>
  );
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
