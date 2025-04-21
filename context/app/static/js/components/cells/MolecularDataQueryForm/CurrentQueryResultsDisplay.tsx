import React from 'react';
import { useMolecularDataQueryFormState } from './hooks';

export default function CurrentQueryResultsDisplay() {
  const { formState } = useMolecularDataQueryFormState();

  if (!formState.isSubmitted || !formState.isSubmitSuccessful || formState.isLoading) {
    return null;
  }

  return <># Datasets Matching Query Parameters / ## Indexed Datasets (##.#%)</>;
}
