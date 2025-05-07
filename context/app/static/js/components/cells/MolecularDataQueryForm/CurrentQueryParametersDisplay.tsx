import React from 'react';
import { useCellVariableNames, useMolecularDataQueryFormState } from './hooks';

export default function CurrentQueryParametersDisplay() {
  const { watch, formState } = useMolecularDataQueryFormState();
  const queryType = watch('queryType');
  const queryMethod = watch('queryMethod');
  const cellVariableNames = useCellVariableNames();
  const expressionLevel = watch('minimumExpressionLevel');
  const threshold = watch('minimumCellPercentage');

  if (!formState.isSubmitted || !formState.isSubmitSuccessful || formState.isLoading) {
    return null;
  }

  const variables = cellVariableNames.join(', ');

  switch (queryType) {
    case 'gene':
      if (queryMethod === 'scFind') {
        // TODO: Once we add pathways, the pathway name should be present here too
        // return `${queryMethod} | ${pathway} | ${variables}`;
        return `${queryMethod} | ${variables}`;
      }
      return (
        <>
          {variables} | Expression Level 10<sup>{expressionLevel}</sup> | {threshold}% Cell
        </>
      );
    case 'cell-type':
      return variables;
    case 'protein':
      return (
        <>
          {variables} | Abundance Level 10<sup>{expressionLevel}</sup> | {threshold}% Cell
        </>
      );
    default:
      return '';
  }
}
