import React from 'react';

import LogSlider from 'js/shared-styles/inputs/LogSlider';
import MarkedSlider from 'js/shared-styles/inputs/MarkedSlider';
import { useFormContext } from 'react-hook-form';
import QueryMethod from './QueryMethod';
import { MolecularDataQueryFormState } from './types';
import AutocompleteEntity from './AutocompleteEntity';
import { useIsQueryType, useMolecularDataQueryFormState, useQueryType } from './hooks';
import { FormFieldContainer } from './FormField';
import { useMolecularDataQueryFormTracking } from './MolecularDataQueryFormTrackingProvider';
import GenePathwaysAutocomplete from './AutocompleteEntity/GenePathwaysAutocomplete';

function CellPercentageInput() {
  const { track } = useMolecularDataQueryFormTracking();
  const { register } = useFormContext<MolecularDataQueryFormState>();
  const { measurement } = useQueryType();
  const isCellType = useIsQueryType('cell-type');

  const props = register('minimumCellPercentage', {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      if (value < 0 || value > 10) {
        event.preventDefault();
        return;
      }
      track('Parameters / Select Minimum Cell Percentage', `${value}`);
    },
  });

  if (isCellType) {
    return null;
  }

  return (
    <MarkedSlider
      label="Minimum Cell Percentage (%)"
      helperText={`Set the minimum cell percentage for cells in the datasets to represent the minimum ${measurement.toLowerCase()}.`}
      marks={[0, 1, 2, 5, 10].map((m) => ({ value: m, label: m || '>0' }))}
      id="min-cell-percentage"
      {...props}
      min={0}
      max={10}
      defaultValue={5}
    />
  );
}

function ExpressionInput() {
  const { register } = useFormContext<MolecularDataQueryFormState>();
  const { track } = useMolecularDataQueryFormTracking();
  const isCellType = useIsQueryType('cell-type');
  const { measurement, fieldName, value: queryType } = useQueryType();

  const label = `Minimum ${measurement}`;

  const props = register('minimumExpressionLevel', {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      if (value < -4 || value > 5) {
        event.preventDefault();
        return;
      }
      track(`Parameters / Select ${label}`, `${value}`);
    },
  });

  if (isCellType || !fieldName) {
    return null;
  }

  return (
    <LogSlider
      label={label}
      helperText={`Set the minimum ${queryType} ${measurement.toLowerCase()} to refine your dataset selections.`}
      minLog={-4}
      maxLog={5}
      id="min-measurement"
      defaultValue={1}
      {...props}
    />
  );
}

function ThresholdOptions() {
  const queryMethod = useMolecularDataQueryFormState().watch('queryMethod');
  if (queryMethod === 'scFind') {
    return null;
  }
  return (
    <FormFieldContainer title="Threshold Options">
      <CellPercentageInput />
      <ExpressionInput />
    </FormFieldContainer>
  );
}

interface QueryParametersFieldsetProps {
  defaultValue?: string;
}

function GeneParameters({ defaultValue }: QueryParametersFieldsetProps) {
  return (
    <>
      <QueryMethod />
      <FormFieldContainer title="Gene and Pathway Selection">
        <GenePathwaysAutocomplete />
        <AutocompleteEntity targetEntity="gene" defaultValue={defaultValue} />
      </FormFieldContainer>
      <ThresholdOptions />
    </>
  );
}

function ProteinParameters({ defaultValue }: QueryParametersFieldsetProps) {
  return (
    <>
      <QueryMethod />
      <FormFieldContainer title="Protein Selection">
        <AutocompleteEntity targetEntity="protein" defaultValue={defaultValue} />
      </FormFieldContainer>
      <ThresholdOptions />
    </>
  );
}

function CellTypeParameters({ defaultValue }: QueryParametersFieldsetProps) {
  return (
    <>
      <QueryMethod />
      <FormFieldContainer title="Cell Type Selection">
        <AutocompleteEntity defaultValue={defaultValue} targetEntity="cell-type" />
      </FormFieldContainer>
    </>
  );
}

function QueryParametersFieldset({ defaultValue }: QueryParametersFieldsetProps) {
  const queryType = useQueryType();

  if (queryType.value === 'gene') {
    return <GeneParameters defaultValue={defaultValue} />;
  }

  if (queryType.value === 'protein') {
    return <ProteinParameters defaultValue={defaultValue} />;
  }

  return <CellTypeParameters defaultValue={defaultValue} />;
}

export default QueryParametersFieldset;
