import React from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import LogSlider from 'js/shared-styles/inputs/LogSlider';
import MarkedSlider from 'js/shared-styles/inputs/MarkedSlider';
import { useFormContext } from 'react-hook-form';
import { useEventCallback } from '@mui/material';
import GenomicModality from './GenomicModality';
import { MolecularDataQueryFormState } from './types';
import AutocompleteEntity from './AutocompleteEntity';
import { useCellVariableNames, useIsQueryType, useMolecularDataQueryFormState, useQueryType } from './hooks';

function CellPercentageInput() {
  const { register } = useFormContext<MolecularDataQueryFormState>();
  const { measurement } = useQueryType();
  const isCellType = useIsQueryType('cell-type');

  if (isCellType) {
    return null;
  }

  return (
    <div>
      <MarkedSlider
        label="Minimum Cell Percentage (%)"
        helperText={`Set the minimum cell percentage for cells in the datasets to represent the minimum ${measurement.toLowerCase()}.`}
        marks={[0, 1, 2, 5, 10].map((m) => ({ value: m, label: m || '>0' }))}
        id="min-cell-percentage"
        {...register('minimumCellPercentage')}
        min={0}
        max={10}
      />
    </div>
  );
}

function ExpressionInput() {
  const { register } = useFormContext<MolecularDataQueryFormState>();

  const isCellType = useIsQueryType('cell-type');
  const { measurement, fieldName, value: queryType } = useQueryType();
  if (isCellType || !fieldName) {
    return null;
  }

  return (
    <div>
      <LogSlider
        label={`Minimum ${measurement}`}
        helperText={`Set the minimum ${queryType} ${measurement.toLowerCase()} to refine your dataset selections.`}
        minLog={-4}
        maxLog={5}
        id="min-measurement"
        {...register(fieldName)}
      />
    </div>
  );
}
function QueryParametersFieldset() {
  const cellVariableNames = useCellVariableNames();
  const queryType = useQueryType();
  const { setValue } = useMolecularDataQueryFormState();
  const runQuery = useEventCallback(() => {
    setValue('step', 'results');
  });

  return (
    <Box sx={{ width: '100%' }}>
      <AutocompleteEntity targetEntity={queryType.value} />
      <GenomicModality />
      <CellPercentageInput />
      <ExpressionInput />
      <Box mt={2}>
        <Button
          disabled={cellVariableNames.length === 0}
          variant="contained"
          color="primary"
          id="run-query-button"
          onClick={runQuery}
        >
          Run Query
        </Button>
      </Box>
    </Box>
  );
}

export default QueryParametersFieldset;
